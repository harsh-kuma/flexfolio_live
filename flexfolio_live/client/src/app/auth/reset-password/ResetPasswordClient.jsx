"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";

import { checkResetOtpAllowed, resetPassword } from "@/lib/api";

import Loader from "@/components/common/loader/Loader";
import { useAuth } from "@/components/providers/AuthProvider";
import { validateResetPassword } from "@/lib/validations/resetPasswordValidation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    let isActive = true;
    if (authLoading) return;
    const validateResetOtpAccess = async () => {
      try {
        if (user) {
          router.replace("/");
          return;
        }
        if (!email) {
          router.replace("/auth/forgot-password");
          return;
        }

        const res = await checkResetOtpAllowed(email);
        if (!isActive) return;

        if (!res.allowed) {
          if (res?.code === "NOT_ALLOWED") {
            router.replace(res.redirectTo || "/auth/signup");
            toast.error(res.message || "User Not Found");
          } else {
            router.replace(res.redirectTo || "/auth/forgot-password");
            toast.error(res.message || "Reset OTP expired");
          }
          return;
        }
      } catch (err) {
        if (!isActive) return;
        toast.error(err?.response?.data?.message ||"Something Went Wrong");
        router.replace("/auth/forgot-password");
      } finally {
        if (isActive) setChecking(false);
      }
    };

    validateResetOtpAccess();
    return () => {
      isActive = false;
    };
  }, [email, user, router,authLoading]);

  const handleResetPassword = async () => {
    const validationErrors =
      validateResetPassword(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        email,
        otp: form.otp,
        password: form.password,
      });

      toast.success(res.message || "Password reset successful");

      router.push("/auth/login");

    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Reset failed";
      toast.error(message);
      router.push("/auth/forgot-password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleResetPassword();
    }
  };

  if (checking) {
    return (
      <Loader/>
    );
  }

  return (
    <AuthRedirect>
      <AuthLayout
        title="Reset password"
        subtitle="Enter OTP and your new password"
      >
        <AuthInput
          label="OTP"
          error={errors.otp}
          placeholder="123456"
          disabled={loading}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d*"
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setForm({ ...form, otp: e.target.value, });
            setErrors((prev) => ({ ...prev, otp: null, }));
          }}
        />

        <AuthInput
          label="New Password"
          type="password"
          error={errors.password}
          placeholder="••••••••"
          disabled={loading}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value, });
            setErrors((prev) => ({ ...prev, password: null, }));
          }}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword}
          placeholder="••••••••"
          disabled={loading}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setForm({ ...form, confirmPassword: e.target.value, });
            setErrors((prev) => ({ ...prev, confirmPassword: null, }));
          }}
        />

        <AuthButton
          loading={loading}
          disabled={loading}
          onClick={handleResetPassword}
        >
          Reset Password
        </AuthButton>
      </AuthLayout>
    </AuthRedirect>
  );
}