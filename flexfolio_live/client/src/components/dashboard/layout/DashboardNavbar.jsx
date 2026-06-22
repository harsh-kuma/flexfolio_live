"use client";

import { Bell, ChevronDown, Loader2, LogOut, Menu, Newspaper } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// NOTE: Ensure you import your logout functions here based on your file structure.
import { useAuth } from "@/components/providers/AuthProvider";
import { logoutUser } from "@/lib/api";
import { signOut } from "next-auth/react";
import MobileMenu from "./MobileMenu";

export default function DashboardNavbar() {
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navRef = useRef(null);
  const scrollRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  // 1. Handle clicking outside to close dropdowns
  useEffect(() => {
  function handleClickOutside(event) {
    const mobileMenu = document.getElementById("mobile-menu");

    if (navRef.current && !navRef.current.contains(event.target)) {
      setActiveDropdown(null);
    }

    if (
      mobileMenuOpen &&
      mobileMenu &&
      !mobileMenu.contains(event.target) &&
      navRef.current &&
      !navRef.current.contains(event.target)
    ) {
      setMobileMenuOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [mobileMenuOpen]);

  // 2. Handle 'Escape' key to close dropdowns (Accessibility feature)
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const mainContent = document.querySelector("main");

    if (mobileMenuOpen && mainContent) {
      mainContent.style.overflow = "hidden";
    } else if (mainContent) {
      mainContent.style.overflow = "auto";
    }

    return () => {
      if (mainContent) {
        mainContent.style.overflow = "auto";
      }
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // 3. Production-level logout handler with loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // CLEAR JWT COOKIE (Ensure logoutUser is imported or passed in)
      await logoutUser();

      // CLEAR GOOGLE SESSION
      await signOut({
        redirect: false,
      });

      // REDIRECT TO HOME/ROOT
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false); // Reset state only if it fails, otherwise let the redirect happen
    }
  };

  return (
    <header
      ref={navRef}
      className="h-16 px-4 md:px-8 bg-white text-gray-900 flex items-center justify-between border-b border-gray-200 sticky top-0 z-40 shadow-sm"
    >

      {/* LEFT - Logo */}
      <div className="flex items-center gap-2 cursor-pointer group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        <img
          src="https://res.cloudinary.com/dr38wac7n/image/upload/v1781678227/flexfolio-full_xkooln.png"
          alt="Flexfolio Logo"
          className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200 ease-out"
        />
      </div>

      {/* RIGHT - Actions */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* ========================================= */}
        {/* 1. BELL NOTIFICATIONS                       */}
        {/* ========================================= */}
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="group relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation();toggleDropdown('bell');}}
              className={`p-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeDropdown === 'bell'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              aria-label="Notifications"
              aria-expanded={activeDropdown === 'bell'}
            >
              <Bell size={20} className="stroke-[1.5]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Tooltip hides when dropdown is active */}
            <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] font-medium rounded transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-sm ${activeDropdown === 'bell' ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
              Notifications
            </span>
          </div>

          <div className={`absolute right-0 mt-3 top-full flex flex-col w-72 sm:w-80 min-h-[250px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right ease-out ${activeDropdown === 'bell' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'
            }`}>
            <div className="p-4 border-b border-gray-100 bg-gray-50/80">
              <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-semibold mb-1">You're all caught up!</p>
                <p className="text-xs text-gray-500">No new notifications right now.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* 2. NEWS / UPDATES                           */}
        {/* ========================================= */}
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="group relative">
            <button
              type="button"
               onClick={(e) => { e.stopPropagation();toggleDropdown('news');}}
              className={`p-2 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeDropdown === 'news'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              aria-label="News Center"
              aria-expanded={activeDropdown === 'news'}
            >
              <Newspaper size={20} className="stroke-[1.5]" />
            </button>

            {/* Tooltip hides when dropdown is active */}
            <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[11px] font-medium rounded transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-sm ${activeDropdown === 'news' ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
              News Center
            </span>
          </div>

          <div className={`absolute right-0 mt-3 top-full flex flex-col w-72 sm:w-80 min-h-[250px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right ease-out ${activeDropdown === 'news' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'
            }`}>
            <div className="p-4 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-800">News Center</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">New</span>
            </div>
            <div className="flex-1 p-2 overflow-y-auto max-h-80">
              <button type="button" className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group">
                <p className="text-xs text-indigo-600 font-semibold mb-1 group-hover:text-indigo-700">v1.0.0 is live</p>
                <p className="text-sm text-gray-800 font-medium">UI Improvements</p>
                <p className="text-xs text-gray-500 mt-1">We've polished the dashboard layout and added a crisp new light theme for better visibility.</p>
              </button>
            </div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="h-6 w-px hidden lg:flex  bg-gray-200 mx-1" aria-hidden="true" />

        {/* ========================================= */}
        {/* 3. PROFILE                                  */}
        {/* ========================================= */}
        <div className="relative hidden lg:flex  items-center justify-center">
          <button
            type="button"
             onClick={(e) => { e.stopPropagation();toggleDropdown('profile');}}
            className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full transition-colors duration-200 border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeDropdown === 'profile' ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
            aria-haspopup="true"
            aria-expanded={activeDropdown === 'profile'}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm">
              {user?.profile ? (
                <img
                  src={user.profile}
                  alt={`${user?.name}'s Profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
          </button>

          <div className={`absolute right-0 mt-3 top-full flex flex-col w-64 sm:w-72 min-h-[250px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right ease-out ${activeDropdown === 'profile' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'
            }`}>

            {/* Header info */}
            <div className="p-4 bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 shrink-0 bg-white flex items-center justify-center text-gray-600 font-bold shadow-sm">
                  {user?.profile ? (
                    <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstLetter}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Empty space pushes the logout button to the bottom */}
            <div className="flex-1 p-2">
              {/* Add settings/profile links here in the future */}
            </div>

            <div className="h-px bg-gray-200 w-full mt-auto" />

            {/* Interactive Logout Area */}
            <div className="p-2 bg-gray-50/50">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2.5 rounded-lg transition-colors group font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {isLoggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>

          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}