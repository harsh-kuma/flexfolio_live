import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPortfolioNotFound({
  title = "Site Not found",
  description = "Something went wrong",
  backHref = "/dashboard/portfolios",
  backLabel = "My Sites",
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-50/50 space-y-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <XCircle className="w-8 h-8 text-gray-400" />
      </div>

      <p className="text-gray-500 font-medium">{description}</p>

      <Link
        href={backHref}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        <ArrowLeft size={16} /> {backLabel}
      </Link>
    </div>
  );
}