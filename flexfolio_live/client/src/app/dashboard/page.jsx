import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data for production map rendering
  const stats = [
    { label: "Total Portfolios", value: "0" },
    { label: "Published", value: "0" },
    { label: "Total Views", value: "0" },
  ];

  return (
    <div className="space-y-8 text-black bg-white max-w-7xl mx-auto p-6 pb-12 min-h-screen "> {/* Removed text-black */}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold text-black tracking-tight">
            Dashboard
          </h1>
          <p className="text-neutral-400 mt-1 text-sm sm:text-base">
            Manage your portfolios and templates.
          </p>
        </div>

        <div className="item-center">
          <Link
            href="/dashboard/templates"
            className="bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            Create Portfolio
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-200 backdrop-blur-sm border border-white rounded-2xl p-6 hover:bg-white hover:border hover:border-gray-200 transition-colors duration-300"
          >
            <h3 className="text-black text-sm font-medium mb-2">
              {stat.label}
            </h3>
            <p className="text-4xl font-bold tracking-tight text-black">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
