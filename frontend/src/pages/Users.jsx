import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { userService } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, UserPlus, Trash2, Edit2, Shield, User, Star } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modals / forms state
  const [editingUser, setEditingUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "participant",
    password: "",
    phone: "",
    organization: ""
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.list();
      setUsers(data);
    } catch (err) {
      toast.error("Error loading user directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.warn("Please enter all required fields.");
      return;
    }
    try {
      await userService.create(formData);
      toast.success("User added successfully!");
      setShowAddModal(false);
      resetForm();
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not add user.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await userService.update(editingUser.id, formData);
      toast.success("User updated successfully!");
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.delete(userId);
      toast.error("User deleted successfully.");
      loadUsers();
    } catch (err) {
      toast.error("Error deleting user.");
    }
  };

  const startEdit = (userObj) => {
    setEditingUser(userObj);
    setFormData({
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      password: "", // do not fill password
      phone: userObj.phone || "",
      organization: userObj.organization || ""
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "participant",
      password: "",
      phone: "",
      organization: ""
    });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Manage Users</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">List, edit details, and modify platform access permissions.</p>
          </div>
          
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <UserPlus size={16} /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 w-full sm:w-80 focus-within:border-blue-500 transition">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="bg-transparent outline-none px-3 text-xs w-full text-slate-650 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-650">
                <thead className="bg-slate-550 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="py-4">Role</th>
                    <th className="py-4">Contact</th>
                    <th className="py-4">Affiliation</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-800 text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{u.email}</p>
                        </td>
                        <td className="py-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            u.role === "admin"
                              ? "bg-red-50 text-red-650 border-red-500/10"
                              : u.role === "organizer"
                              ? "bg-purple-50 text-purple-650 border-purple-500/10"
                              : "bg-blue-50 text-blue-650 border-blue-500/10"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-semibold text-slate-500">{u.phone || "N/A"}</td>
                        <td className="py-4 text-xs font-semibold text-slate-500">{u.organization || "N/A"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(u)}
                              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer transition"
                              title="Edit User"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 border border-red-200/30 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition"
                              title="Delete User"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-semibold">
                        No users found in directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog Modals */}
      {(showAddModal || editingUser) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => { setShowAddModal(false); setEditingUser(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
            >
              ×
            </button>

            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {showAddModal ? "Add New Platform User" : "Edit User Account"}
              </h3>
              <p className="text-slate-400 text-xs mt-1">Configure account access permissions and attributes.</p>
            </div>

            <form onSubmit={showAddModal ? handleCreateUser : handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                <div className="col-span-2 space-y-1">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label>Account Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="participant">Participant</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {showAddModal && (
                  <div className="col-span-2 space-y-1">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter secure password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+12345..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label>Affiliation</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="College or Firm"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                  className="w-1/2 border border-slate-300 text-slate-650 font-semibold py-2.5 rounded-xl text-xs transition hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-750 text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  {showAddModal ? "Create User" : "Update Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Users;
