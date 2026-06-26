import { Crown, Lock } from "lucide-react";
import Link from "next/link";

export default function AnalyticsLocked({
  title = "Analytics Locked",
  description = "Upgrade your plan to unlock portfolio analytics, visitor tracking, engagement insights and click reports.",
}) {
  return (
    <div className="bg-white rounded-2xl border p-10 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-purple-100">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-3 text-gray-500 max-w-md mx-auto">
        {description}
      </p>

      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#5642E6] text-white"
      >
        <Crown size={18} />
        Upgrade Plan
      </Link>
    </div>
  );
}