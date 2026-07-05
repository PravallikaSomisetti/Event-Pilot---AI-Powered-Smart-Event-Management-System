import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { authService, userService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserCircle, Upload, Save, Lock } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    organization: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser");
    if (loggedIn) {
      const parsed = JSON.parse(loggedIn);
      setUser(parsed);
      setFormData({
        name: parsed.name,
        phone: parsed.phone || "",
        organization: parsed.organization || "",
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean request body
      const payload = {
        name: formData.name,
        phone: formData.phone || null,
        organization: formData.organization || null,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      // Update basic fields
      const updatedUser = await userService.update(user.id, payload);
      
      // Update avatar if provided
      if (avatarFile) {
        const avatarRes = await authService.uploadAvatar(avatarFile);
        updatedUser.avatar_url = avatarRes.avatar_url;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData(prev => ({ ...prev, password: "" }));
      setAvatarFile(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Update your account information and avatar.</p>
        </div>

        <form onSubmit={handleSubmitProfile} className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-8">
          
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              {user.avatar_url || avatarFile ? (
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : `http://localhost:8000${user.avatar_url}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow"
                />
              ) : (
                <UserCircle size={96} className="text-slate-300" />
              )}
              
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-750 text-white rounded-full cursor-pointer shadow-md transition">
                <Upload size={14} />
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-bold text-slate-850 text-base">{user.name}</h3>
              <p className="text-xs text-slate-400 font-semibold">{user.email}</p>
              <span className="inline-block text-[9px] font-bold bg-blue-50 border border-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
            </div>
          </div>

          {/* Form details */}
          <div className="grid md:grid-cols-2 gap-6 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <div className="space-y-2">
              <label>Full Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label>College / Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Enter organization"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1">
                <Lock size={12} /> New Password <span className="text-[10px] text-slate-400 capitalize">(optional)</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-500/10 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Save size={16} /> {loading ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
