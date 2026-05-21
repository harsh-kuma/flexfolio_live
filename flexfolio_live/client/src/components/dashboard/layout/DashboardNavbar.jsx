"use client";

import { Bell, Globe } from "lucide-react";

export default function DashboardNavbar({ user }) {

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="h-14 px-6 bg-black text-white flex items-center justify-between border-b border-white/10 backdrop-blur-md">

      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="font-bold text-lg">Flexfolio</div>

        <nav className="hidden md:flex gap-4 text-sm text-white/70">
          <button className="hover:text-white">All Sites</button>
          <button className="hover:text-white">Help</button>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 text-white/70">

        <button className="hover:text-white">
          <Bell size={18} />
        </button>

        <button className="hover:text-white">
          <Globe size={18} />
        </button>

        {/* AVATAR */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center text-sm font-semibold">

          {user?.profile ? (
            <img
              src={user.profile}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            firstLetter
          )}

        </div>

      </div>

    </header>
  );
}