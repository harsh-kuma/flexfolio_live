"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";
import SocialLogin from "@/components/auth/SocialLogin";
import { registerUser } from "@/lib/api";
import { validateSignup } from "@/lib/validations/signupValidation";

export default function SignupPage() {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isCredentialLogin, setIsCredentialLogin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleSignup = async () => {
    try {
      const validationErrors = validateSignup(form);
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      if (loading) return;
      setIsCredentialLogin(true);
      setLoading(true);

      const res = await registerUser(form);

      toast.success(res.message);

      router.push(
        `${res.redirectTo}?email=${res.email}`
      );

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <AuthLayout
        title="Create account"
        subtitle="Start building your portfolio today"
      >
        <AuthInput
          disabled={loading}
          label="Full Name"
          placeholder="John Doe"
          error={errors.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setErrors((prev) => ({ ...prev, name: null, }));
          }}
        />

        <AuthInput
          disabled={loading}
          label="Email"
          type="email"
          error={errors.email}
          placeholder="john@example.com"
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors((prev) => ({ ...prev, email: null, }));
          }}
        />


        <div className="flex items-center justify-center text-sm pt-1">
          <p className="text-slate-500">
            Already have an account?
          </p>

          <button
            disabled={loading}
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="ml-2 font-semibold text-black hover:opacity-70 transition"
          >
            Login
          </button>
        </div>
        <AuthButton
          disabled={loading}
          loading={loading}
          isCredentialLogin={isCredentialLogin}
          onClick={handleSignup}
        >
          Create Account
        </AuthButton>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">
              OR
            </span>
          </div>
        </div>

        <SocialLogin loading={loading} setLoading={setLoading} />
      </AuthLayout>
    </AuthRedirect>
  );
}