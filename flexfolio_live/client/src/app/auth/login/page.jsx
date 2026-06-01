"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";
import SocialLogin from "@/components/auth/SocialLogin";
import { useAuth } from "@/components/providers/AuthProvider";

import { loginUser } from "@/lib/api";
import { validateLogin } from "@/lib/validations/loginValidation";

export default function LoginPage() {
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCredentialLogin, setIsCredentialLogin] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {

      const validationErrors = validateLogin(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      if (loading) return;
      setIsCredentialLogin(true);
      setLoading(true);
      const res = await loginUser(form);
      await fetchUser();
      toast.success("Login successful");

      router.push("/");

    } catch (err) {
      const data = err?.response?.data;

      // 🔥 NOT VERIFIED CASE
      if (data?.code === "NOT_VERIFIED") {
        toast.error("Please verify your email first");

        router.replace(
          `${data.redirectTo}?email=${data.email}`
        );

        return;
      }

      toast.error(data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <AuthLayout
        title="Welcome back"
        subtitle="Login to continue building"
      >
        <AuthInput disabled={loading}
          label="Email"
          type="email"
          error={errors.email}
          placeholder="john@example.com"
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors((prev) => ({ ...prev, email: null, }));
          }}
        />

        <AuthInput
          disabled={loading}
          label="Password"
          type="password"
          error={errors.password}
          placeholder="••••••••"
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            setErrors((prev) => ({ ...prev, password: null, }));
          }}
        />

        <div className="flex items-center justify-between text-sm">
          <button
            disabled={loading}
            type="button"
            onClick={() => router.replace("/auth/forgot-password")}
            className="text-slate-500 hover:text-black transition"
          >
            Forgot password?
          </button>

          <button
            type="button"
            onClick={() => router.replace("/auth/signup")}
            className="font-medium text-black hover:opacity-70 transition"
          >
            Create account
          </button>
        </div>
        <AuthButton
          loading={loading}
          isCredentialLogin={isCredentialLogin}
          onClick={handleLogin}
        >
          Login
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