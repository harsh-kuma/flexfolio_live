"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
  return (
    <button
      onClick={() => signIn("google",{
          callbackUrl: "/auth/google-success",
        })
      }
      className="
        w-full h-12
        border border-slate-300
        rounded-xl
        font-medium
        hover:bg-slate-100
        transition
        flex items-center justify-center gap-3
      "
    >
      <FcGoogle className="text-xl" />

      <span>Continue with Google</span>
    </button>
  );
}