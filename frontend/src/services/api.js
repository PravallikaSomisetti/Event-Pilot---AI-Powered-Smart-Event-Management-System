import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eventpilot_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("eventpilot_token");
      localStorage.removeItem("loggedInUser");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post("/api/auth/login", data);
    if (res.data.access_token) {
      localStorage.setItem("eventpilot_token", res.data.access_token);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (email, tempCode, newPassword) => {
    const res = await api.post("/api/auth/reset-password", {
      email,
      temp_code: tempCode,
      new_password: newPassword,
    });
    return res.data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/auth/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("eventpilot_token");
    localStorage.removeItem("loggedInUser");
  },
};

export const eventService = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.venue) params.append("venue", filters.venue);
    if (filters.organizer_id) params.append("organizer_id", filters.organizer_id);
    if (filters.search) params.append("search", filters.search);
    if (filters.status_filter) params.append("status_filter", filters.status_filter);
    if (filters.start_date) params.append("start_date", filters.start_date);
    
    const res = await api.get(`/api/events/?${params.toString()}`);
    return res.data;
  },
  get: async (id) => {
    const res = await api.get(`/api/events/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/api/events/", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/events/${id}`);
    return res.data;
  },
  publish: async (id) => {
    const res = await api.post(`/api/events/${id}/publish`);
    return res.data;
  },
  cancel: async (id) => {
    const res = await api.post(`/api/events/${id}/cancel`);
    return res.data;
  },
  uploadBanner: async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/api/events/${id}/upload-banner`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  remind: async (id) => {
    const res = await api.post(`/api/events/${id}/remind`);
    return res.data;
  },
};

export const registrationService = {
  register: async (eventId) => {
    const res = await api.post("/api/registrations/", { event_id: eventId });
    return res.data;
  },
  listMine: async () => {
    const res = await api.get("/api/registrations/my-registrations");
    return res.data;
  },
  listEventRegs: async (eventId) => {
    const res = await api.get(`/api/registrations/event/${eventId}`);
    return res.data;
  },
};

export const attendanceService = {
  checkIn: async (qrCodeData) => {
    const res = await api.post("/api/attendance/check-in", { qr_code_data: qrCodeData });
    return res.data;
  },
  listEventAttendance: async (eventId) => {
    const res = await api.get(`/api/attendance/event/${eventId}`);
    return res.data;
  },
  listMineHistory: async () => {
    const res = await api.get("/api/attendance/my-history");
    return res.data;
  },
};

export const feedbackService = {
  submit: async (eventId, data) => {
    const res = await api.post(`/api/feedback/event/${eventId}`, data);
    return res.data;
  },
  list: async (eventId) => {
    const res = await api.get(`/api/feedback/event/${eventId}`);
    return res.data;
  },
  getSentiment: async (eventId) => {
    const res = await api.get(`/api/feedback/event/${eventId}/sentiment`);
    return res.data;
  },
};

export const analyticsService = {
  getSummary: async () => {
    const res = await api.get("/api/analytics/summary");
    return res.data;
  },
  getCharts: async () => {
    const res = await api.get("/api/analytics/charts");
    return res.data;
  },
  getActivityLogs: async () => {
    const res = await api.get("/api/analytics/activity-logs");
    return res.data;
  },
};

export const aiService = {
  getPrediction: async (eventId) => {
    const res = await api.get(`/api/ai/predict/${eventId}`);
    return res.data;
  },
};

export const reportService = {
  downloadAttendance: async (eventId, format) => {
    const response = await api.get(`/api/reports/attendance/${eventId}?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
  downloadFeedback: async (eventId, format) => {
    const response = await api.get(`/api/reports/feedback/${eventId}?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
  downloadAnalytics: async (format) => {
    const response = await api.get(`/api/reports/analytics?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
};

export const userService = {
  list: async () => {
    const res = await api.get("/api/users/");
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/api/users/", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/api/users/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },
};

export default api;
