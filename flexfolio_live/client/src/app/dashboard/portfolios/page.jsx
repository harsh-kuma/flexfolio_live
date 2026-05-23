"use client";

import Loader from "@/components/common/loader/Loader";
import { deletePortfolio, getMyPortfolios } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Calendar,
  ExternalLink,
  Globe,
  LayoutTemplate,
  Pencil,
  Plus,
  Search,
  Trash2
} from "lucide-react";

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Professional fallback image for portfolios without a thumbnail
  const DEFAULT_IMAGE ="https://res.cloudinary.com/dr38wac7n/image/upload/v1779525495/default_portfolio_shk797.png";

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const res = await getMyPortfolios();
      setPortfolios(res.portfolios);
    } catch (error) {
      console.error("Failed to fetch portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this portfolio? This action cannot be undone.")) return;
    
    setDeletingId(id);
    try {
      await deletePortfolio(id);
      setPortfolios((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPortfolios = portfolios.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.templateKey?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = portfolios.filter(p => p.isPublished).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-12 bg-white min-h-screen">
      
      {/* HEADER & METRICS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Portfolios
          </h1>
          <p className="text-sm text-gray-500">
            Manage your websites, templates, and deployments.
          </p>
        </div>

        <div className="item-center"> 
          <Link
            href="/dashboard/templates"
            className="bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 active:scale-95"
          >
            <Plus size={16} strokeWidth={2.5} />
            Create Portfolio
          </Link>
        </div>
      </div>

      {portfolios.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-24 p-4  border border-dashed border-gray-300 rounded-xl bg-gray-50">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6">
            <LayoutTemplate size={28} className="text-black" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No portfolios created
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
            Get started by selecting a template and building your first professional website.
          </p>
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-200 shadow-sm"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* SEARCH TOOLBAR */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-gray-300 rounded-lg py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* GRID */}
          {filteredPortfolios.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm border border-gray-200 rounded-xl bg-gray-50">
              No portfolios match your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="group flex flex-col bg-white border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* IMAGE HEADER - This fixes your missing image issue */}
                  <div className="relative aspect-[16/9] bg-gray-100 border-b border-gray-100 overflow-hidden">
                    <img
                      src={portfolio.thumbnail || DEFAULT_IMAGE}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase shadow-sm ${
                          portfolio.isPublished
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-white/95 text-gray-700 ring-1 ring-inset ring-gray-200 backdrop-blur-sm"
                        }`}
                      >
                        {portfolio.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {portfolio.title || "Untitled Portfolio"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {portfolio.templateKey || "Custom"} Template
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto pb-5">
                      <div className="flex items-center gap-2.5 text-xs text-gray-500">
                        <Globe size={14} className="text-gray-400" />
                        <span className="truncate hover:text-gray-900 transition-colors cursor-pointer">
                          flexfolio.online/portfolio/{portfolio.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-gray-500">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          Updated {new Date(portfolio.updatedAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* FOOTER ACTIONS - Professional layout */}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                      <Link
                        href={`/dashboard/portfolios/edit/${portfolio._id}`}
                        className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 h-9 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm"
                      >
                        <Pencil size={14} className="text-gray-500" />
                        Edit Site
                      </Link>

                      <Link
                        href={`/portfolio/${portfolio.username}`}
                        target="_blank"
                        className="h-9 w-10 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900 rounded-md flex items-center justify-center transition-all shadow-sm"
                        title="View Live Site"
                      >
                        <ExternalLink size={16} />
                      </Link>

                      <button
                        onClick={() => handleDelete(portfolio._id)}
                        disabled={deletingId === portfolio._id}
                        className="h-9 w-10 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 rounded-md flex items-center justify-center transition-all shadow-sm disabled:opacity-50"
                        title="Delete Site"
                      >
                        {deletingId === portfolio._id ? (
                          <Loader className="w-4 h-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}