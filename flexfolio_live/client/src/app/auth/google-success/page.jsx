"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/components/providers/AuthProvider";
import { googleLogin } from "@/lib/api";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, loading: authLoading, fetchUser } = useAuth();

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      try {
        if (authLoading || status === "loading") return;
        //  already logged in
        if (user) {
          router.push("/");
          return;
        }

        //  no session
        if (!session?.user) {
          router.replace("/auth/login");
          return;
        }

        const res = await googleLogin({
          name: session.user.name,
          email: session.user.email,
          profile: session.user.image,
        });

        if (!isActive) return;

        setLoading(true);

        await fetchUser();

        toast.success("Login successful");

        router.push("/");
      } catch (err) {
        if (!isActive) return;

        toast.error(
          err?.response?.data?.message || "Google login failed"
        );

        router.replace("/auth/login");
      } finally {
        if (isActive) {
          setLoading(false);
          setChecking(false);
        }
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [session, user, authLoading, status]);

  if (checking) {
    return (
      <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased font-sans flex flex-col items-center justify-center relative w-full overflow-x-hidden p-6">
        {/* Platform Canvas Mesh Background Sync */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-70 pointer-events-none z-0" />

        {/* Premium Authorization Secure Box */}
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl shadow-slate-100 rounded-2xl p-8 flex flex-col items-center text-center relative z-10">

          {/* Animated Custom Scanning Authentication Ring */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* Static track */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            {/* Active Tracing Scan Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-500 animate-spin" />

            {/* Core Status Logo Indicator Icon */}
            <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center shadow-inner">
              <span className="text-xl animate-pulse">{loading ? "🔑" : "🔍"}</span>
            </div>
          </div>

          {/* Text Interface Headers */}
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {loading ? "Authenticating Session" : "Verifying Credentials"}
          </h2>

          {/* Dynamic Status Text Line */}
          <p className="mt-2 text-xs font-semibold tracking-wide text-indigo-600 animate-pulse min-h-[16px]">
            {loading ? "Logging you in..." : "Checking session..."}
          </p>

          {/* Progress System Indicator Dot Matrix */}
          <div className="flex gap-1.5 mt-6 justify-center items-center">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
          </div>

        </div>

        {/* Footnote Branding Stamp */}
        <div className="mt-6 text-[11px] font-bold text-slate-300 uppercase tracking-widest z-10">
          Flexfolio Security Layer
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased font-sans flex flex-col items-center justify-center relative w-full overflow-x-hidden p-6">
      {/* Platform Canvas Mesh Background Sync */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-70 pointer-events-none z-0" />

      {/* Premium Authorization Secure Box */}
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl shadow-slate-100 rounded-2xl p-8 flex flex-col items-center text-center relative z-10">

        {/* Animated Custom Scanning Authentication Ring */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Static track */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          {/* Active Tracing Scan Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-500 animate-spin" />

          {/* Core Status Logo Indicator Icon */}
          <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center shadow-inner">
            <span className="text-xl animate-pulse">🔒</span>
          </div>
        </div>

        {/* Text Interface Headers */}
        <h2 className="text-xl font-black tracking-tight text-slate-950">
          Securing Workspace
        </h2>

        {/* Interactive Processing Subtitle Context Lines */}
        <p className="mt-2 text-xs font-semibold tracking-wide text-indigo-600 animate-pulse min-h-[16px]">
          Processing Google login...
        </p>

        {/* Progress System Indicator Dot Matrix */}
        <div className="flex gap-1.5 mt-6 justify-center items-center">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
        </div>

      </div>

      {/* Footnote Branding Stamp */}
      <div className="mt-6 text-[11px] font-bold text-slate-300 uppercase tracking-widest z-10">
        Flexfolio Security Layer
      </div>
    </div>
  );
}