"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin({ loading , setLoading}) {
  const [isThisGoogleLogin,setIsThisGoogleLogin] = useState(false);
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setIsThisGoogleLogin(true);
    await signIn("google", {
      callbackUrl: "/auth/google-success",
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="
        w-full h-12
        border border-slate-300
        rounded-xl
        font-medium
        hover:bg-slate-100
        transition
        flex items-center justify-center gap-3
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      {loading && isThisGoogleLogin ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FcGoogle className="text-xl" />
      )}

      <span>
        {loading && isThisGoogleLogin ? "Please wait..." : "Continue with Google"}
      </span>
    </button>
  );
}