"use client";

export default function StatCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 hover:shadow-sm transition">
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{label}</span>
        {icon}
      </div>

      {value !== undefined && value !== null ? (
        <h2 className="text-2xl font-bold mt-2">
          {Number.isFinite(Number(value))
            ? Number(value).toLocaleString()
            : value}
        </h2>
      ) : (
        <div className="h-8 w-20 mt-2 bg-gray-100 animate-pulse rounded-xl" />
      )}
    </div>
  );
}