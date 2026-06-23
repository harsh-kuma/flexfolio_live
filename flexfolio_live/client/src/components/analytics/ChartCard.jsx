"use client";

export default function ChartCard({
  title,
  loading,
  height = "280px",
  children,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <h2 className="font-semibold mb-4">
        {title}
      </h2>

      <div style={{ height }}>
        {loading ? (
          <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}