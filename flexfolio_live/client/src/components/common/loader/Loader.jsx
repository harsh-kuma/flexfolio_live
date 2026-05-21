"use client";
import { useEffect, useState } from "react";

export default function Loader() {
  const [loadingText, setLoadingText] = useState("Assembling grid...");

  // Wix-style dynamic micro-copy to make the wait feel faster and interactive
  useEffect(() => {
    const phrases = [
      "Optimizing layout...",
      "Polishing canvas...",
      "Flexing pixels...",
      "Readying Flexfolio...",
    ];
    let index = 0;
    const interval = setInterval(() => {
      if (index >= phrases.length) {
        index = 0;
      }

      setLoadingText(phrases[index]);
      index++;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-slate-900 antialiased font-sans">
      {/* Subtle, clean grid background reminiscent of a website builder canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

      <div className="relative flex flex-col items-center z-10 w-full max-w-sm px-6">
        {/* Wix-Style Morphing Geometry Container */}
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          {/* Animated geometric accent blocks */}
          <div className="absolute w-12 h-12 border-2 border-indigo-600 rounded-xl animate-[spin_4s_linear_infinite]" />
          <div className="absolute w-12 h-12 border-2 border-pink-500 rounded-md rotate-45 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
          <div className="absolute w-6 h-6 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-sm animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Brand Typography */}
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
          Flexfolio<span className="text-indigo-600">.</span>
        </h1>

        {/* Elegant Minimal Progress Bar */}
        <div className="w-40 h-[3px] bg-slate-100 rounded-full overflow-hidden mb-3 relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-full animate-[loading-bar_3s_ease-in-out_infinite]" />
        </div>

        {/* Dynamic Canvas Status */}
        <p className="text-xs font-medium tracking-wide text-slate-400 min-h-[16px] animate-fade-in">
          {loadingText}
        </p>
      </div>

      {/* Required custom CSS animation keyframe for the progress bar */}
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; left: 0%; right: auto; }
          50% { width: 100%; left: 0%; right: auto; }
          50.1% { width: 100%; left: auto; right: 0%; }
          100% { width: 0%; left: auto; right: 0%; }
        }
      `}</style>
    </div>
  );
}