"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { usePlan } from "@/hooks/usePlan";
import { Crown, House, Layers, LayoutGrid, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function DashboardSidebar() {
  const { user } = useAuth();
  const { plan } = usePlan();
  const pathname = usePathname();

  const fullName = user?.name || "user";
  const shortName = fullName.split(" ").slice(0, 2).join(" ");

  const navItems = [
    {
      name: "Home",
      icon: House,
      path: "/dashboard",
    },
    {
      name: "My Sites",
      icon: LayoutGrid,
      path: "/dashboard/portfolios",
    },
    {
      name: "Templates",
      icon: Layers,
      path: "/dashboard/templates",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside className="w-[200px] h-full flex flex-col bg-white text-black border-r border-gray-300  shadow-gray-400 shadow-lg ">

      {/* USER SECTION */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="text-sm font-semibold tracking-wide text-black">
          {shortName}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Role: Owner
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              href={item.path}
              key={item.name}
              className={`
                w-full flex items-center gap-3 px-3 mb-2 py-2.5 rounded-lg text-sm
                transition-all duration-200

                ${isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}

      </nav>

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


      {/* FOOTER */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        Flexfolio v1.0.0
      </div>

    </aside>
  );
}