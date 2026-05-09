import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 bg-white">
      
      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        Build Your Portfolio in Minutes 🚀
      </h1>

      {/* SUBTEXT */}
      <p className="mt-4 text-gray-500 text-sm sm:text-base md:text-lg max-w-md md:max-w-xl">
        Create, customize and launch your portfolio with beautiful templates —
        no coding required.
      </p>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
        
        <Link href="/templates" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            Browse Templates
          </button>
        </Link>

        <Link href="/builder" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Start from Scratch
          </button>
        </Link>

      </div>

    </div>
  );
}