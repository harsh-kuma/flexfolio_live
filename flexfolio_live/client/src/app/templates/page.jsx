import { templates } from "@/lib/templates";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Portfolio Templates
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">
            Select a template to start building your professional Portfolio.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Object.entries(templates).map(([key, t]) => {
            const [category, template] = key.split("-");

            return (
              <div 
                key={key} 
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Visual Preview Container */}
                <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10">
                    <Link 
                      href={`/builder?template=${key}`}
                      className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Plus size={18} /> Use This
                    </Link>
                  </div>
                  
                  {/* Placeholder Text (Replace with <img> later) */}
                  <div className="h-full w-full flex items-center justify-center text-slate-300 text-sm uppercase tracking-widest font-bold">
                    {t.name} Preview
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-bold text-slate-800 text-lg leading-tight">
                      {t.name}
                    </h2>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                      {category}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                    <Link 
                      href={`/templates/${category}/${template}`}
                      className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={16} /> Live Preview
                    </Link>
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