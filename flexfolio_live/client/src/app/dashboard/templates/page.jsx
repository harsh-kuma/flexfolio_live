"use client";
import { templates } from "@/lib/templates";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TemplatesPage() {
  const [activeCard, setActiveCard] = useState(null);
  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-12 antialiased">
      <div className="max-w-[1800px] mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-black mb-10 tracking-tight">
          All Responsive Templates
        </h1>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Object.entries(templates).map(([key, t]) => {
            const [category, template] = key.split("-");

            return (
              <div
                key={key}
                className="group flex flex-col"
                onClick={() => {
                  if (window.innerWidth < 640) {
                    setActiveCard(activeCard === key ? null : key);
                  }
                }}
              >

                {/* CONTAINER WITH 1PX PADDING */}
                <div className="bg-white p-2 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-neutral-200/40">

                  {/* IMAGE WRAPPER - No fixed aspect ratio so the image shows FULLY */}
                  <div className="relative w-full overflow-hidden">

                    {/* Using a standard img tag here handles long template screenshots 
                      much better than a fixed-height Next.js fill container.
                    */}
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                    />

                    {/* HOVER ACTIONS OVERLAY */}
                    <div
                      className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 px-6 z-10 transition-all duration-300 sm:opacity-0 sm:pointer-events-none sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto
                          ${activeCard === key
                          ? "opacity-100 pointer-events-auto"
                          : "opacity-0 pointer-events-none"
                        }`}
                    >
                      {/* USE TEMPLATE */}
                      <Link href={`/dashboard/builder?template=${key}`} className="w-full max-w-[200px]">
                        <button className="w-full bg-white text-black font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition">
                          <Plus size={16} />
                          Use Template
                        </button>
                      </Link>

                      {/* LIVE PREVIEW */}
                      <Link href={`/templates/${category}/${template}`} className="w-full max-w-[200px]">
                        <button className="w-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition">
                          <Eye size={16} />
                          Live Preview
                        </button>
                      </Link>

                    </div>
                  </div>

                  {/* NAME ONLY */}
                  <div className="p-2 mt-auto bg-white">
                    <h2 className="text-base font-medium text-black tracking-tight line-clamp-2">
                      {t.name}
                    </h2>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}