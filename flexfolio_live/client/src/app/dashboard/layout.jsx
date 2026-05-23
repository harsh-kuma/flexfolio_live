"use client";

import Loader from "@/components/common/loader/Loader";
import DashboardShell from "@/components/dashboard/layout/DashboardShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loader />;
  }

  return <DashboardShell>{children}</DashboardShell>;
}