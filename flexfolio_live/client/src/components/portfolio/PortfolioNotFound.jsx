export default function PortfolioNotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#f5f5f5] px-6 antialiased">
      <div className="text-center max-w-md flex flex-col items-center">
        
        {/* ENHANCED TYPOGRAPHY */}
        <h1 className="text-6xl sm:text-7xl font-bold text-black mb-4 tracking-tighter">
          404
        </h1>

        <p className="text-xl font-medium text-black tracking-tight mb-2">
          Portfolio Not Found
        </p>

        <p className="text-neutral-500 text-sm sm:text-base max-w-xs leading-relaxed">
          The portfolio instance you are looking for does not exist or has been removed.
        </p>
        
      </div>
    </div>
  );
}