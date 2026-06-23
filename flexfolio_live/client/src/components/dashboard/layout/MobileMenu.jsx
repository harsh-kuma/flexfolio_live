"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { usePlan } from "@/hooks/usePlan";
import { logoutUser } from "@/lib/api";
import {
  Crown,
  House,
  Layers,
  LayoutGrid,
  Loader2,
  LogOut,
  Settings,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileMenu({ isOpen, onClose }) {
  const { user } = useAuth();
  const { plan } = usePlan();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: "Home", icon: House, path: "/dashboard" },
    { name: "My Sites", icon: LayoutGrid, path: "/dashboard/portfolios" },
    { name: "Templates", icon: Layers, path: "/dashboard/templates" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div id="mobile-menu"
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen
          ? "visible bg-black/40 backdrop-blur-sm"
          : "invisible opacity-0"
        }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute left-0 top-0 h-dvh w-[300px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <img
            src="https://res.cloudinary.com/dr38wac7n/image/upload/v1781678227/flexfolio-full_xkooln.png"
            alt="Logo"
            className="h-8 object-contain"
          />

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-4 border-b border-gray-200">
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {user?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {plan !== "pro" && (
            <div className="mx-3 mb-3 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={16} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">
                  Upgrade to Pro
                </span>
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                Unlock unlimited portfolios, custom domains, analytics and premium templates.
              </p>

              <Link
                href="/pricing"
                className="flex items-center justify-center gap-1 w-full rounded-lg bg-purple-600 py-2 text-xs font-medium text-white hover:bg-purple-700 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          )}


          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            Logout
          </button>

          {/* Version */}
          <div className="pt-4  px-4 text-xs text-gray-400">
            Flexfolio v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}