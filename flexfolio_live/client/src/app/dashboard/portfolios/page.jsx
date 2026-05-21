import Link from "next/link";

export default function PortfoliosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            My Portfolios
          </h1>

          <p className="text-neutral-400 mt-1">
            Manage all your published portfolios.
          </p>
        </div>

        <Link
          href="/dashboard/portfolios/create"
          className="bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-2xl transition-colors"
        >
          Create New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-5">
          <div className="aspect-video rounded-2xl bg-neutral-900 mb-4"></div>

          <h2 className="text-lg font-semibold mb-2">
            Portfolio Title
          </h2>

          <p className="text-sm text-neutral-400 mb-5">
            Template: Developer Portfolio
          </p>

          <div className="flex gap-3">
            <Link
              href="/dashboard/portfolios/edit/123"
              className="flex-1 text-center bg-white text-black py-2 rounded-xl font-medium"
            >
              Edit
            </Link>

            <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-xl font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}