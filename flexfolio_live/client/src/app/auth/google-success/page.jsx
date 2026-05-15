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
          router.replace("/");
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

        router.push("/auth/login");
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
      <div className="min-h-screen flex items-center justify-center">
        {loading ? "Logging you in..." : "Checking session..."}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      Processing Google login...
    </div>
  );
}