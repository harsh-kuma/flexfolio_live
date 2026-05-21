"use client";

import { Layers, LayoutGrid, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();

  const fullName = user?.name || "user";
  const shortName = fullName.split(" ").slice(0, 2).join(" ");

  const navItems = [
    {
      name: "Sites",
      icon: LayoutGrid,
      path: "/dashboard/portfolio",
    },
    {
      name: "Templates",
      icon: Layers,
      path: "/dashboard/templates",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/setting",
    },
  ];

  return (
    <aside className="w-[260px] h-full flex flex-col bg-white text-black border-r border-gray-300  shadow-gray-400 shadow-lg ">

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
            <button
              key={item.name}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-all duration-200

                ${isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}

      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        Flexfolio v1.0.0
      </div>

    </aside>
  );
}