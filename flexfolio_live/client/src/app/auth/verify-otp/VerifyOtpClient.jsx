"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";
import { validateOTP } from "@/lib/validations/otpValidation";

import Loader from "@/components/common/loader/Loader";
import { useAuth } from "@/components/providers/AuthProvider";
import { checkOtpAllowed, verifyOTP } from "@/lib/api";

export default function VerifyOTPPage() {
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  
  const { user, loading:authLoading, fetchUser } = useAuth();
  // ✅ SECURE OTP ACCESS CHECK
  useEffect(() => {
    let isActive = true;
    if (authLoading) return;

    const validateOtpAccess = async () => {
      try {
        if (user) {
          router.replace("/");
          return;
        }

        if (!email) {
          router.replace("/auth/signup");
          return;
        }

        const res = await checkOtpAllowed(email);
        if (!isActive) return;

        if (!res.allowed) {
          router.replace("/auth/signup");
          toast.error(res.message || "Invalid access");
          return;
        }
        if (isActive) setChecking(false);

      } catch (err) {
        if (!isActive) return;
        console.log("*****************");
        toast.error(err?.response?.data?.message ||"Something went wrong");
        router.replace("/auth/signup");
      } finally {
        if (isActive) setChecking(false);
      }
    };

    validateOtpAccess();
    return () => {
      isActive = false;
    };
  }, [email, user, router,authLoading]);

  const handleVerify = async () => {
    try {
      const validationErrors = validateOTP(form);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setLoading(true);

      await verifyOTP({
        email,
        otp: form.otp,
        password: form.password,
      });

      //  STEP 2: update auth state instantly
      await fetchUser();

      toast.success("Account verified");

      router.push("/");

    } catch (err) {
      toast.error(err?.response?.data?.message || "Verification failed");
      router.push("/auth/signup");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Loader/>
    );
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <AuthRedirect>
      <AuthLayout
        title="Verify Account"
        subtitle="Enter OTP and your password"
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
          label="Password"
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
          onClick={handleVerify}
        >
          Verify Account
        </AuthButton>
      </AuthLayout>
    </AuthRedirect>
  );
}