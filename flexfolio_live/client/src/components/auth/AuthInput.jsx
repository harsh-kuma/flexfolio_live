export default function AuthInput({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>

        {error && (
          <p className="text-xs text-red-500 pl-1">
            ({error})
          </p>
        )}
      </div>

      <input
        {...props}
        className={`
          w-full h-12 rounded-xl border px-4 outline-none transition
          ${error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-300 focus:border-black"}
          ${className}
        `}
      />
    </div>
  );
}