"use client";

import Loader from "@/components/common/loader/Loader";
import { getCurrentUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashbordShell({ children }) {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.user);
                setLoading(false);
            } catch (err) {
                router.replace("/auth/login");
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <Loader/>
        );
    }
     console.log("Dashboard Layout Render");
    return (
        <div className="h-screen w-full flex flex-col bg-[#0a0a0a] text-white overflow-hidden">

            {/* TOP NAVBAR */}
            <div className="shrink-0 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
                <DashboardNavbar user={user}  />
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR */}
                <aside className="hidden md:flex">
                    <DashboardSidebar user={user} />
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto relative ">

                    {/* subtle background glow for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                    {/* content wrapper */}
                    <div className="relative p-6 md:p-8 max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>

                </main>

            </div>
        </div>
    );
}