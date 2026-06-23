"use client";

import {
  deleteAllMessages,
  deleteMessage,
  getPortfolioMessages,
  getSingleAnalyticsSummary,
  markMessageRead,
} from "@/lib/api";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Filter,
  Mail,
  MailOpen,
  MousePointerClick,
  Reply,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import ChartCard from "@/components/analytics/ChartCard";
import EngagementChart from "@/components/analytics/EngagementChart";
import StatCard from "@/components/analytics/StatCard";
import TopClicksChart from "@/components/analytics/TopClicksChart";
import ViewsChart from "@/components/analytics/ViewsChart";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "unread", label: "Unread First" },
];

export default function InsightsPage() {
  const { id } = useParams();
  const observerRef = useRef();
  const sortRef = useRef();

  // State Management
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Custom Sorting State
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Data State
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [unread, setUnread] = useState(0);
  const [expandedMessages, setExpandedMessages] = useState({});

  // Click Outside Listener for Sorting Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await getSingleAnalyticsSummary(id);
      if (res?.success) {
        setAnalytics(res);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load analytics");
    }
  }, [id]);

  const fetchMessages = useCallback(
    async (pageNo = 1, append = false) => {
      try {
        const res = await getPortfolioMessages(id, pageNo);
        if (!res?.success) return;

        setUnread(res.unread || 0);
        setHasMore(res.hasMore || false);

        if (append) {
          setMessages((prev) => [...prev, ...(res.messages || [])]);
        } else {
          setMessages(res.messages || []);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load messages");
      }
    },
    [id]
  );

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchMessages()]);
      if (isMounted) setLoading(false);
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [fetchAnalytics, fetchMessages]);

  const loadMoreRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const next = page + 1;
          setLoadingMore(true);
          await fetchMessages(next, true);
          setPage(next);
          setLoadingMore(false);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, page, hasMore, fetchMessages]
  );

  const handleRead = async (msgId) => {
    setProcessingId(msgId);
    try {
      await markMessageRead(msgId);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === msgId ? { ...msg, isRead: true } : msg))
      );
      setUnread((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      toast.error("Failed to mark message as read");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setProcessingId(msgId);
    try {
      await deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL messages? This cannot be undone."
      )
    )
      return;

    setIsDeletingAll(true);
    try {
      await deleteAllMessages(id);
      setMessages([]);
      setUnread(0);
      toast.success("All messages deleted");
    } catch (err) {
      toast.error("Failed to delete messages");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const toggleMessage = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  // Sorting Logic
  const sortedMessages = [...messages].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "unread") return (a.isRead === b.isRead) ? 0 : a.isRead ? 1 : -1;
    return 0;
  });

  const MessageSkeleton = () => (
    <div className="p-4 sm:p-6 mb-3 sm:mb-0 sm:border-b sm:border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-5 animate-pulse bg-white rounded-2xl sm:rounded-none border border-gray-200/60 sm:border-none">
      {/* Avatar Skeleton */}
      <div className="shrink-0 pt-1 hidden sm:block">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0 w-full space-y-4 py-1">
        {/* Name and Date */}
        <div className="flex items-center gap-3">
          <div className="h-5 bg-gray-200 rounded-md w-32" />
          <div className="h-4 bg-gray-100 rounded-md w-16" />
        </div>

        {/* Email */}
        <div className="h-4 bg-gray-100 rounded-md w-48" />

        {/* Message Body */}
        <div className="h-24 bg-gray-100 rounded-xl w-full" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex flex-row sm:flex-col items-center justify-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-100 sm:border-t-0 sm:border-l sm:pl-5">
        <div className="h-10 bg-gray-200 rounded-xl w-full sm:w-32 flex-1 sm:flex-none" />
        <div className="h-10 bg-gray-100 rounded-xl w-full sm:w-32 flex-1 sm:flex-none" />
        <div className="h-10 bg-gray-100 rounded-xl w-full sm:w-32 flex-1 sm:flex-none" />
      </div>
    </div>
  );


  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Insights</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Analytics & Contact Messages
            </p>
          </div>
        </div>

        {/* ANALYTICS FALLBACK */}
        {!analytics && !loading ? (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-4 rounded-2xl text-orange-700 shadow-sm">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">
              Analytics data is currently unavailable for this site.
            </p>
          </div>
        ) : (
          <>
            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard label="Total Views" value={analytics?.overview?.totalViews} icon={<Eye size={18} className="text-blue-500" />} />
              <StatCard label="Total Clicks" value={analytics?.overview?.totalClicks} icon={<MousePointerClick size={18} className="text-emerald-500" />} />
              <StatCard label="Unique Visitors" value={analytics?.overview?.uniqueVisitors} icon={<Users size={18} className="text-violet-500" />} />
              <StatCard label="Unread Messages" value={unread} icon={<Mail size={18} className="text-amber-500" />} />
              <StatCard label="Avg Visit Time (Sec.)" value={analytics?.engagement?.averageVisitTime} icon={<Clock size={18} className="text-rose-500" />} />
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Views Analytics" loading={loading}>
                <ViewsChart data={analytics?.chart ?? []} />
              </ChartCard>
              <ChartCard title="Engagement Overview" loading={loading}>
                <EngagementChart engagement={analytics?.engagement ?? {}} />
              </ChartCard>
              <ChartCard title="Top Clicked Links" loading={loading} height="320px">
                <TopClicksChart topClicks={analytics?.topClicks ?? []} />
              </ChartCard>
            </div>
          </>
        )}

        {/* INBOX SECTION */}
        <div className="mt-8 relative">

          {/* STICKY INBOX HEADER */}
          {/* Adjusted to top-0 for mobile so it never "floats" awkwardly. Change lg:top-[64px] to match your exact desktop navbar height if needed */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border border-gray-200/80 p-4 sm:p-5 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-4 sm:mb-0 sm:rounded-b-none sm:border-b-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Inbox</h2>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  {messages.length} Total
                </span>
              </div>

              {messages.length > 0 && (
                <div className="flex items-center gap-3 w-full sm:w-auto">

                  {/* CUSTOM PROFESSIONAL DROPDOWN */}
                  <div className="relative flex-1 sm:flex-none" ref={sortRef}>
                    <button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full flex justify-between items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-violet-500/20 outline-none whitespace-nowrap"
                    >
                      <span className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        {selectedSortLabel}
                      </span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isSortOpen && (
                      <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sortBy === opt.value
                              ? "bg-violet-50 text-violet-700 font-semibold"
                              : "text-gray-700 hover:bg-gray-50 font-medium"
                              }`}
                          >
                            {opt.label}
                            {sortBy === opt.value && <Check size={14} className="text-violet-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CLEAR INBOX BUTTON */}
                  <button
                    onClick={handleDeleteAll}
                    disabled={isDeletingAll}
                    className="flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">
                      {isDeletingAll ? "Clearing..." : "Clear Inbox"}
                    </span>
                    <span className="sm:hidden">Clear All</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div className="bg-transparent sm:bg-white sm:border sm:border-gray-200/80 sm:rounded-b-2xl shadow-sm sm:divide-y sm:divide-gray-100">
            {loading ? (
              // Show 4 Skeleton loaders while fetching data
              Array.from({ length: 4 }).map((_, index) => (
                <MessageSkeleton key={index} />
              ))
            ) : sortedMessages.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center gap-4 bg-white rounded-2xl sm:rounded-none sm:rounded-b-2xl border border-gray-200/80 sm:border-none">
                <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <MailOpen size={32} className="text-gray-300" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">You're all caught up!</h3>
                  <p className="text-gray-500 font-medium mt-1">
                    No messages found in your inbox.
                  </p>
                </div>
              </div>
            ) : (
              sortedMessages.map((msg, index) => (
                <div
                  key={msg._id}
                  className={`group p-4 sm:p-6 mb-3 rounded-2xl sm:rounded-none border border-gray-200/60 transition-all duration-300  flex flex-col sm:flex-row gap-4 sm:gap-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] sm:shadow-none ${index % 2 ? "bg-white hover:bg-purple-100" : " bg-purple-100"} `}
                >

                  {/* Avatar & Content Wrapper */}
                  <div className="flex-1 flex gap-4 min-w-0">

                    {/* Avatar */}
                    <div className="shrink-0 pt-1 hidden sm:block">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-100 to-fuchsia-100 text-violet-700 flex items-center justify-center text-lg font-bold uppercase shadow-sm border border-white">
                        {msg.name ? msg.name.charAt(0) : <User size={20} />}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">

                      {/* Name, Status, and Date Row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {msg.name}
                        </h3>

                        {/* Read / Unread Status Badge */}
                        {msg.isRead ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[11px] font-bold tracking-wide uppercase ring-1 ring-green-600/10">
                            <CheckCircle2 size={12} strokeWidth={3} />
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold tracking-wide uppercase ring-1 ring-blue-600/10 animate-pulse">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            New
                          </span>
                        )}

                        <span className="text-gray-300 hidden sm:inline">•</span>

                        <time className="text-xs font-semibold text-gray-400">
                          {new Date(msg.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>

                      <div className="text-sm font-medium text-blue-600 inline-flex items-center gap-1.5 mb-3 mt-1 truncate max-w-full">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{msg.email}</span>
                      </div>

                      <div className="bg-gray-50/80 rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">

                        <div className="relative">

                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMessages[msg._id]
                              ? "max-h-[1000px]"
                              : "max-h-[72px]"
                              }`}
                          >
                            <p className="text-[15px] text-gray-700 leading-6 whitespace-pre-wrap break-words">
                              {msg.message}
                            </p>
                          </div>

                          {!expandedMessages[msg._id] &&
                            msg.message.split("\n").length > 3 && (
                              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50/90 to-transparent pointer-events-none" />
                            )}

                        </div>

                        {msg.message.length > 180 && (
                          <button
                            onClick={() => toggleMessage(msg._id)}
                            className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                          >
                            {expandedMessages[msg._id]
                              ? "View Less"
                              : "View More"}
                          </button>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Container */}
                  <div className="flex flex-row flex-wrap sm:flex-col items-center justify-end gap-2 pt-4 sm:pt-0 border-t border-gray-100 sm:border-t-0 sm:border-l sm:pl-5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">

                    {/* Native Link instead of Button for Reply */}
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your message from my portfolio`}
                      className="basis-full sm:basis-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm w-full sm:w-32 whitespace-nowrap"
                    >
                      <Reply size={16} />
                      Reply
                    </a>

                    {!msg.isRead && (
                      <button
                        onClick={() => handleRead(msg._id)}
                        disabled={processingId === msg._id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all w-full sm:w-32 whitespace-nowrap"
                      >
                        <Check size={16} />
                        {processingId === msg._id ? "..." : "Mark Read"}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(msg._id)}
                      disabled={processingId === msg._id}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all w-full sm:w-32 whitespace-nowrap"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Infinite Scroll Anchor */}
          <div ref={loadMoreRef} className="h-4" />

          {loadingMore && (
            <div className="p-6 flex items-center justify-center gap-3 text-sm font-bold text-gray-500 bg-gray-50/50 border-t rounded-b-2xl">
              <div className="w-5 h-5 border-[3px] border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              Loading older messages...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}