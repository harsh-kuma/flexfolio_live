"use client";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashbordShell({ children }) {
    return (
        <div className="h-screen w-full flex flex-col bg-gray-200 text-white overflow-hidden">

            {/* TOP NAVBAR */}
            <div className="shrink-0 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
                <DashboardNavbar/>
            </div>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR */}
                <aside className="hidden md:flex">
                    <DashboardSidebar/>
                </aside>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto relative ">

                    {/* subtle background glow for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                    {/* content wrapper */}
                    <div className="relative md:p-2 max-w-[1400px] mx-auto w-full">
                        {children}
                    </div>

                </main>

            </div>
        </div>
    );
}