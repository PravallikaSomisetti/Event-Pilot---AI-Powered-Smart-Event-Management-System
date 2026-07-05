import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { authService } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = input email, 2 = input code & password

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login({
        email: data.email,
        password: data.password,
      });
      toast.success(`Welcome back, ${res.user.name}!`);
      setTimeout(() => {
        // Redirect based on role if needed
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.warn("Please enter your email.");
      return;
    }
    try {
      const res = await authService.forgotPassword(forgotEmail);
      toast.success(res.message);
      if (res.debug_code) {
        toast.info(`Debug Reset Code: ${res.debug_code}`, { autoClose: 10000 });
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Email address not found.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      toast.warn("Please fill in all fields.");
      return;
    }
    try {
      await authService.resetPassword(forgotEmail, resetCode, newPassword);
      toast.success("Password reset successfully. Please login.");
      setShowForgot(false);
      setStep(1);
      setForgotEmail("");
      setResetCode("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid reset code.");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to EventPilot"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {!showForgot ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            register={register}
            errors={errors}
          />

          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            register={register}
            errors={errors}
          />

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition flex justify-center items-center ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>

          <p className="text-center mt-6 text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Reset Password</h3>
          {step === 1 ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email to receive reset code"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-1/2 border border-slate-300 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-750 text-white py-3 rounded-xl text-sm font-semibold transition"
                >
                  Send Code
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Reset Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit code"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new secure password"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 border border-slate-300 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 hover:bg-blue-750 text-white py-3 rounded-xl text-sm font-semibold transition"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </AuthLayout>
  );
}

export default Login;