import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
import os
import datetime

# Path to save trained model model
MODEL_PATH = "static/models/attendance_predictor.pkl"

# Dictionary to encode event categories
CATEGORY_MAPPING = {
    "tech": 0,
    "business": 1,
    "cultural": 2,
    "sports": 3,
    "education": 4,
    "other": 5
}

class AttendancePredictor:
    def __init__(self):
        self.model = None
        self.is_trained = False
        self._load_or_init_model()

    def _load_or_init_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
                self.is_trained = True
            except Exception:
                self.model = None
        
        if not self.model:
            # Create a simple default random forest regressor
            self.model = RandomForestRegressor(n_estimators=50, random_state=42)

    def generate_synthetic_data(self):
        """Generates realistic synthetic data to train the model initially."""
        np.random.seed(42)
        n_samples = 150
        
        # Features: Registration Count, Previous Attendance Rate, Category Code, Day of Week (0-6), Hour of Day (9-20)
        registrations = np.random.randint(20, 500, size=n_samples)
        prev_attendance = np.random.uniform(0.60, 0.95, size=n_samples)
        categories = np.random.randint(0, 6, size=n_samples)
        day_of_week = np.random.randint(0, 7, size=n_samples)
        hour_of_day = np.random.randint(9, 21, size=n_samples)
        
        # Target: Attendance Rate % (base rate + random variations based on features)
        # Weekends (5,6) have slightly higher attendance, business events (1) have higher attendance, etc.
        attendance_rates = []
        for i in range(n_samples):
            base_rate = prev_attendance[i]
            # Adjust based on hour (midday 12-14 is slightly lower, evening 17-19 is higher)
            hour_adj = 0.05 if 17 <= hour_of_day[i] <= 19 else (-0.05 if 12 <= hour_of_day[i] <= 14 else 0.0)
            # Adjust based on day
            day_adj = 0.03 if day_of_week[i] >= 5 else -0.02
            # Adjust based on capacity/registrations (very large events have slightly lower percentage attendance)
            size_adj = -0.05 if registrations[i] > 300 else 0.02
            
            rate = base_rate + hour_adj + day_adj + size_adj + np.random.normal(0, 0.03)
            rate = max(0.40, min(1.0, rate))  # Keep between 40% and 100%
            attendance_rates.append(rate)
            
        df = pd.DataFrame({
            "registration_count": registrations,
            "prev_attendance_rate": prev_attendance,
            "category": categories,
            "day_of_week": day_of_week,
            "hour_of_day": hour_of_day,
            "attendance_rate": attendance_rates
        })
        return df

    def train(self, db_session=None):
        """Train the model model. Fallback to synthetic if DB is empty."""
        df = None
        
        # Check database for completed events
        if db_session:
            from app.models.models import Event, Registration
            # Query all events that have already started and have registrations
            now = datetime.datetime.utcnow()
            events = db_session.query(Event).filter(Event.start_date < now).all()
            
            data = []
            for e in events:
                reg_count = db_session.query(Registration).filter(Registration.event_id == e.id).count()
                if reg_count > 0:
                    checked_in_count = db_session.query(Registration).filter(
                        Registration.event_id == e.id,
                        Registration.checked_in == True
                    ).count()
                    
                    rate = checked_in_count / reg_count
                    cat_code = CATEGORY_MAPPING.get(e.category.lower(), 5)
                    day = e.start_date.weekday()
                    hour = e.start_date.hour
                    
                    data.append({
                        "registration_count": reg_count,
                        "prev_attendance_rate": 0.85,  # default average
                        "category": cat_code,
                        "day_of_week": day,
                        "hour_of_day": hour,
                        "attendance_rate": rate
                    })
            if len(data) >= 10:
                df = pd.DataFrame(data)
                
        if df is None:
            df = self.generate_synthetic_data()
            
        X = df[["registration_count", "prev_attendance_rate", "category", "day_of_week", "hour_of_day"]]
        y = df["attendance_rate"]
        
        self.model.fit(X, y)
        
        # Save model
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(self.model, f)
            
        self.is_trained = True
        return len(df)

    def predict(self, registration_count: int, previous_attendance_rate: float, category: str, start_date: datetime.datetime):
        if not self.is_trained:
            self.train()
            
        cat_code = CATEGORY_MAPPING.get(category.lower(), 5)
        day = start_date.weekday()
        hour = start_date.hour
        
        features = np.array([[registration_count, previous_attendance_rate, cat_code, day, hour]])
        
        prediction = self.model.predict(features)[0]
        # Guarantee it remains bounded
        prediction = max(0.0, min(1.0, float(prediction)))
        
        # Add a tiny confidence factor based on registrations
        confidence = 0.95 - (0.05 if registration_count > 300 else 0.0)
        
        return prediction, confidence

# Singleton instance
predictor = AttendancePredictor()
