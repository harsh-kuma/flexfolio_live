import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TemplateNotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#f5f5f5] px-6 antialiased">
      <div className="text-center max-w-md flex flex-col items-center">
        
        {/* ENHANCED TYPOGRAPHY */}
        <h1 className="text-6xl sm:text-7xl font-bold text-black mb-4 tracking-tighter">
          404
        </h1>

        <p className="text-xl font-medium text-black tracking-tight mb-2">
          Template Not Found
        </p>

        <p className="text-neutral-500 text-sm sm:text-base mb-8 max-w-xs leading-relaxed">
          The requested template blueprint does not exist or has been removed.
        </p>

        {/* REFINED PILL BUTTON MATCHING YOUR SITE */}
        <Link href="/">
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-sm shadow-sm active:scale-[0.98] transition duration-200">
            <ArrowLeft size={16} />
            Go Home
          </button>
        </Link>
        
      </div>
    </div>
  );
}