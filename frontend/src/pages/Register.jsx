import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { authService } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "participant"
    }
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register({
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization || null,
        role: data.role,
        password: data.password,
      });
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
        console.log("===== REGISTER ERROR =====");
        console.log("Status:", err.response?.status);
        console.log("Response:", err.response?.data);
        console.log("Message:", err.message);
       console.log("Full Error:", err);

       toast.error(
         JSON.stringify(err.response?.data) ||
         err.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join EventPilot today"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          register={register}
          errors={errors}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          errors={errors}
        />

        <InputField
          label="Phone Number"
          name="phone"
          placeholder="Enter your phone number"
          register={register}
          errors={errors}
          required={false}
        />

        <InputField
          label="College / Organization"
          name="organization"
          placeholder="Enter your college or organization"
          register={register}
          errors={errors}
          required={false}
        />

        {/* Role Selector */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-slate-700">
            I want to register as
          </label>
          <select
            {...register("role", { required: "Please select a role" })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="participant">Event Participant</option>
            <option value="organizer">Event Organizer</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <PasswordField
          label="Password"
          name="password"
          placeholder="Create your password"
          register={register}
          errors={errors}
        />

        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-slate-700">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-750 text-white py-3.5 rounded-xl font-semibold transition flex justify-center items-center ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;