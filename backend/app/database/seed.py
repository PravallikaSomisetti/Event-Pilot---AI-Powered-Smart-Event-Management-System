import datetime
import random
from sqlalchemy.orm import Session
from app.database.session import Base, engine, SessionLocal
from app.models.models import User, Event, Registration, Attendance, Feedback, ActivityLog
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    # Create all tables if not exists
    Base.metadata.create_all(bind=engine)
    
    # Check if database is already seeded
    if db.query(User).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database...")
    
    # 1. Create Users
    roles = {
        "admin": "admin",
        "organizer": "organizer",
        "participant": "participant"
    }
    
    users = []
    # Core test accounts
    users.append(User(
        name="System Admin",
        email="admin@eventpilot.com",
        password=get_password_hash("admin123"),
        role="admin",
        phone="+1234567890",
        organization="EventPilot Inc."
    ))
    
    users.append(User(
        name="Alex Organizer",
        email="organizer@eventpilot.com",
        password=get_password_hash("organizer123"),
        role="organizer",
        phone="+1234567891",
        organization="Tech Events Guild"
    ))
    
    users.append(User(
        name="Sam Participant",
        email="participant@eventpilot.com",
        password=get_password_hash("participant123"),
        role="participant",
        phone="+1234567892",
        organization="Vercel College"
    ))
    
    # Additional mock users
    names = [
        "Emily Watson", "John Doe", "Michael Chen", "Sarah Jenkins", "David Smith",
        "Jessica Taylor", "Daniel Kim", "Lisa Anderson", "James Miller", "Sophia Martinez"
    ]
    
    for idx, name in enumerate(names):
        email = f"{name.lower().replace(' ', '')}@example.com"
        role = "organizer" if idx < 3 else "participant"
        users.append(User(
            name=name,
            email=email,
            password=get_password_hash("password123"),
            role=role,
            phone=f"+198765432{idx}",
            organization="Standard Corp" if role == "organizer" else "Global University"
        ))
        
    for u in users:
        db.add(u)
    db.commit()
    
    # Refresh to load IDs
    for u in users:
        db.refresh(u)
        
    organizers = [u for u in users if u.role == "organizer"]
    participants = [u for u in users if u.role == "participant"]

    # 2. Create Events (Mix of Past and Future)
    categories = ["Tech", "Business", "Cultural", "Sports", "Education"]
    venues = ["Grand Convention Hall", "Auditorium B", "Downtown Innovation Hub", "Arena 5", "Conference Suite C"]
    titles = {
        "Tech": ["AI Hackathon 2026", "Vite & React Dev Summit", "DevOps & Cloud Day", "CyberSecurity Workshop", "Web3 Future Panel"],
        "Business": ["SaaS Founders Meetup", "Startup Pitch Night", "Product Marketing masterclass", "Global Investment Summit"],
        "Cultural": ["Symphony Concert", "Indie Film festival", "Abstract Art Gallery", "Street Food Fiesta"],
        "Sports": ["Charity Marathon", "3v3 Basketball Showdown", "E-Sports Cup 2026", "Yoga & Wellness Retreat"],
        "Education": ["Data Science Bootcamp", "Quantum Physics Seminar", "Public Speaking Workshop", "UX/UI Design Crashcourse"]
    }
    
    events = []
    now = datetime.datetime.utcnow()
    
    # Generate 15 past events for AI historical training and charts
    for idx in range(15):
        category = random.choice(categories)
        title = random.choice(titles[category]) + f" (Vol. {random.randint(1,4)})"
        organizer = random.choice(organizers)
        venue = random.choice(venues)
        
        # Started between 60 days ago and 5 days ago
        days_ago = random.randint(5, 60)
        start = now - datetime.timedelta(days=days_ago, hours=random.randint(2, 6))
        end = start + datetime.timedelta(hours=random.randint(3, 8))
        deadline = start - datetime.timedelta(days=random.randint(1, 3))
        
        event = Event(
            organizer_id=organizer.id,
            title=title,
            description=f"A fantastic retro review of {title}. We discussed key trends, hosted panel discussions, and explored hands-on workshops with industry leaders.",
            category=category,
            venue=venue,
            capacity=random.randint(50, 150),
            start_date=start,
            end_date=end,
            registration_deadline=deadline,
            is_published=True,
            is_cancelled=False
        )
        events.append(event)

    # Generate 10 upcoming events
    for idx in range(10):
        category = random.choice(categories)
        title = random.choice(titles[category])
        organizer = random.choice(organizers)
        venue = random.choice(venues)
        
        # Starts in 5 to 60 days
        days_ahead = random.randint(5, 60)
        start = now + datetime.timedelta(days=days_ahead, hours=random.randint(1, 5))
        end = start + datetime.timedelta(hours=random.randint(2, 6))
        deadline = start - datetime.timedelta(days=random.randint(1, 3))
        
        event = Event(
            organizer_id=organizer.id,
            title=title,
            description=f"Join us at the upcoming {title}! This event covers the state of the art in {category}, providing top-tier networking and learning experiences.",
            category=category,
            venue=venue,
            capacity=random.randint(40, 200),
            start_date=start,
            end_date=end,
            registration_deadline=deadline,
            is_published=True,
            is_cancelled=False
        )
        events.append(event)
        
    for e in events:
        db.add(e)
    db.commit()
    
    for e in events:
        db.refresh(e)

    # 3. Create Registrations & Attendance for Past Events
    # Also register current participant Sam for a few upcoming and past events
    sam = [p for p in participants if p.email == "participant@eventpilot.com"][0]
    
    # Comments & Feedbacks dataset
    feedback_comments = [
        ("The event was absolutely great! Everything was very well organized.", 5, "Positive", "organized,event", "Maintain high standards of organization."),
        ("Very informative session, but the chairs were uncomfortable.", 4, "Positive", "informative,chairs", "Provide better seating next time."),
        ("Terrible experience. The registration queue took over an hour.", 1, "Negative", "terrible,queue", "Speed up registration and check-in processing."),
        ("Good speakers and valuable info. Venue was a bit cold.", 4, "Positive", "speakers,venue", "Optimize climate control."),
        ("Average event, nothing special. Could add more interactive Q&As.", 3, "Neutral", "interactive,average", "Include live quizzes or longer Q&A sessions."),
        ("Waste of money. The presentation slides were broken.", 2, "Negative", "waste,slides", "Double-check audio-visual tech before starting."),
        ("Loved the networking opportunities! Truly inspiring mentors.", 5, "Positive", "mentors,networking", "Keep inviting high-caliber mentors.")
    ]

    for e in events:
        is_past = e.start_date < now
        
        # Determine registration count
        if is_past:
            # Past events: fill random registrations
            reg_count = random.randint(15, min(e.capacity, len(participants) + 5))
        else:
            # Upcoming events: few registrations
            reg_count = random.randint(5, min(e.capacity, len(participants)))
            
        # Select random participants to register
        registered_users = random.sample(participants, min(reg_count, len(participants)))
        
        # Force register Sam for testing
        if sam not in registered_users:
            registered_users.append(sam)

        for u in registered_users:
            reg = Registration(
                user_id=u.id,
                event_id=e.id,
                qr_code=f"eventpilot_pass_{u.id}_{e.id}_{random.randint(1000,9999)}",
                checked_in=False
            )
            db.add(reg)
            db.commit()
            db.refresh(reg)
            
            # If past event, check-in some participants (e.g. 70%-90% attendance rate)
            if is_past:
                # 80% check-in rate
                if random.random() < 0.8:
                    reg.checked_in = True
                    att = Attendance(
                        registration_id=reg.id,
                        check_in_time=e.start_date + datetime.timedelta(minutes=random.randint(-15, 30)),
                        checked_in_by_id=e.organizer_id
                    )
                    db.add(att)
                    
                    # 50% submit feedback for checked-in past events
                    if random.random() < 0.5:
                        comment, rating, sentiment, keywords, suggestions = random.choice(feedback_comments)
                        # Add slight noise to ratings
                        rating = max(1, min(5, rating + random.choice([-1, 0, 1])))
                        feedback = Feedback(
                            event_id=e.id,
                            user_id=u.id,
                            rating=rating,
                            comment=comment,
                            sentiment=sentiment,
                            keywords=keywords,
                            suggestions=suggestions
                        )
                        db.add(feedback)
                        
            # If upcoming event, check-in 0 (waiting)
            db.commit()

    # Pre-train predictor model
    from app.ai.predictor import predictor
    predictor.train(db)

    # Add audit log
    admin_user = db.query(User).filter(User.role == "admin").first()
    log = ActivityLog(
        user_id=admin_user.id,
        action="Database Seeded",
        details="Initial platform dataset seeded with mock users, events, check-ins, and feedbacks."
    )
    db.add(log)
    db.commit()
    
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
