"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";

import { forgotPassword } from "@/lib/api";
import { validateForgotPassword } from "@/lib/validations/forgotPasswordValidation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    const validationErrors = validateForgotPassword(email);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword({
        email,
      });

      toast.success(res.message);

      router.replace(
        `${res.redirectTo}?email=${res.email}`
      );

    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <AuthLayout
        title="Forgot password"
        subtitle="We will send a reset code to your email"
      >
        <AuthInput
          label="Email"
          type="email"
          error={errors.email}
          placeholder="john@example.com"
          onChange={(e) => {
            setEmail(e.target.value);

            setErrors((prev) => ({
              ...prev,
              email: null,
            }));
          }}
        />

        <AuthButton
          loading={loading}
          onClick={handleForgotPassword}
        >
          Send Reset Code
        </AuthButton>

        <div className="text-center text-sm text-slate-500">
          Remember your password? {" "}

          <button
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="font-medium text-black hover:opacity-70 transition"
          >
            Login
          </button>
        </div>
      </AuthLayout>
    </AuthRedirect>
  );
}