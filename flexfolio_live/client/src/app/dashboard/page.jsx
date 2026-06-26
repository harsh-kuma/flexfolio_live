"use client";

import AnalyticsLocked from "@/components/analytics/AnalyticsLocked";
import ChartCard from "@/components/analytics/ChartCard";
import EngagementChart from "@/components/analytics/EngagementChart";
import StatCard from "@/components/analytics/StatCard";
import TopClicksChart from "@/components/analytics/TopClicksChart";
import ViewsChart from "@/components/analytics/ViewsChart";
import { usePlan } from "@/hooks/usePlan";
import { getMyAnalyticsSummary } from "@/lib/api";
import {
  AlertCircle,
  ArrowUpRight,
  Eye,
  LayoutGrid,
  MousePointerClick,
  Plus,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_THUMBNAIL =
  "https://res.cloudinary.com/dr38wac7n/image/upload/v1779525495/default_portfolio_shk797.png";

export default function DashboardPage() {
  const { plan, features } = usePlan();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    overview: {
      totalPortfolios: null,
      totalViews: null,
      totalClicks: null,
      uniqueVisitors: null,
      todayViews: null,
    },
    portfolios: [],
    chart: [],
    engagement: {
      averageVisitTime: 0,
      longestVisit: 0,
      totalVisitTime: 0,
    },
    topClicks: [],
  });

  // =====================
  // FETCH DASHBOARD
  // =====================
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getMyAnalyticsSummary();

      if (!res?.success) throw new Error("Failed to load dashboard");

      setStats({
        overview: res.overview || {},
        portfolios: res.portfolios || [],
        chart: res.chart || [],
        engagement: res.engagement || {
          averageVisitTime: 0,
          longestVisit: 0,
          totalVisitTime: 0,
        },
        topClicks: res.topClicks || [],
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // =====================
  // OVERVIEW CARDS
  // =====================
  const overviewCards = [
    {
      label: "Total Live Portfolios",
      value: stats.overview.totalPortfolios,
      icon: <LayoutGrid size={18} className="text-violet-500" />,
    },
    {
      label: "Total Views",
      value: stats.overview.totalViews,
      icon: <Eye size={18} className="text-blue-500" />,
    },
    {
      label: "Total Clicks",
      value: stats.overview.totalClicks,
      icon: <MousePointerClick size={18} className="text-emerald-500" />,
    },
    ...(plan === "pro" ?[
    {
      label: "Unique Visitors",
      value: stats.overview.uniqueVisitors,
      icon: <Users size={18} className="text-orange-500" />,
    }] : []),
    {
      label: "Today Views",
      value: stats.overview.todayViews,
      icon: <Eye size={18} className="text-pink-500" />,
    },
  ];

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Manage Live Sites & analytics
            </p>
          </div>

          <Link
            href="/dashboard/templates"
            className="bg-violet-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Create Portfolio
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex justify-between items-center bg-red-50 border border-red-200 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              {error}
            </div>
            <button onClick={fetchDashboard} className="text-red-600">
              Retry
            </button>
          </div>
        )}

        {/* OVERVIEW */}
        {plan && features.analytics ? <div className="space-y-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2  gap-4 ${plan === "pro" ? "lg:grid-cols-5" :"lg:grid-cols-4"}`}>
            {overviewCards.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
              />
            ))}
          </div>

          {/* ===================== */}
          {/* CHARTS SIDE BY SIDE */}
          {/* ===================== */}
          {plan === "pro" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <ChartCard
                title="Views Analytics"
                loading={loading}
              >
                <ViewsChart
                  data={stats.chart}
                />
              </ChartCard>

              <ChartCard
                title="Engagement Overview (Seconds)"
                loading={loading}
              >
                <EngagementChart
                  engagement={stats.engagement}
                />
              </ChartCard>

              <ChartCard
                title="Top Clicked Links"
                loading={loading}
                height="320px"
              >
                <TopClicksChart
                  topClicks={stats.topClicks}
                />
              </ChartCard>

            </div>) : <AnalyticsLocked
            title="Advanced Analytics"
            description="Upgrade to Pro to unlock charts, engagement metrics and top clicked links."
          />}
        </div> : <AnalyticsLocked />}

        {/* PORTFOLIOS */}
        <div className="space-y-5">
          <h2 className="text-xl font-semibold">Your Live Sites</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : stats.portfolios.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-2xl">
              No portfolios yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.portfolios.map((p) => (
                <Link
                  key={p._id}
                  href={`https://${p.username}.flexfolio.online`}
                  target="_blank" rel="noopener noreferrer"
                  className="group relative bg-white rounded-[28px] p-2 flex flex-col ring-1 ring-gray-900/5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:ring-gray-900/10"
                >
                  {/* 1. Framed Image (Modern trend: floating image inside the card) */}
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-gray-100/80">
                    <Image
                      src={p.thumbnail || DEFAULT_THUMBNAIL}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                    />

                    {/* Subtle Glassmorphism Blur on Hover */}
                    <div className="absolute inset-0 bg-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* 2. Floating Action Button (Slides in from the right) */}
                    <div className="absolute top-3 right-3 translate-x-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0 group-hover:opacity-100">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-sm text-gray-900">
                        <ArrowUpRight size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* 3. Content Body */}
                  <div className="flex flex-col flex-1 px-4 py-5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-[1.1rem] font-bold text-gray-900 tracking-tight line-clamp-1">
                          {p.title}
                        </h3>
                      </div>
                    </div>

                    {/* 4. Linear-Style Data Pills */}
                    <div className="mt-6 flex flex-wrap items-center gap-2">

                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200/60 text-[13px] font-semibold text-gray-600 transition-colors duration-300 group-hover:bg-violet-50/80 group-hover:border-violet-200/60 group-hover:text-violet-700">
                        <Eye size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
                        {p.views?.toLocaleString() || 0}
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200/60 text-[13px] font-semibold text-gray-600 transition-colors duration-300 group-hover:bg-blue-50/80 group-hover:border-blue-200/60 group-hover:text-blue-700">
                        <MousePointerClick size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        {p.clicks?.toLocaleString() || 0}
                      </div>

                      {plan === "pro" && (<div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-50 border border-gray-200/60 text-[13px] font-semibold text-gray-600 transition-colors duration-300 group-hover:bg-emerald-50/80 group-hover:border-emerald-200/60 group-hover:text-emerald-700">
                        <Users size={14} strokeWidth={2.5} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        {p.uniqueVisitors?.toLocaleString() || 0}
                      </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}