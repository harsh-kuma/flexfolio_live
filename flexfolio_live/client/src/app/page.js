"use client";

import Loader from "@/components/common/loader/Loader";
import { useAuth } from "@/components/providers/AuthProvider";
import { logoutUser } from "@/lib/api";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      // CLEAR JWT COOKIE
      await logoutUser();

      // CLEAR GOOGLE SESSION
      await signOut({
        redirect: false,
      });

      // REDIRECT TO HOME/ROOT
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 antialiased font-sans flex flex-col relative w-full overflow-x-hidden selection:bg-indigo-600/10">

      {/* 1. BACKGROUND CANVAS MESH */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none z-0" />

      {/* 2. RIGID PREMIUM STICKY HEADER */}
      <header className="w-full max-w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Image
            src="/flexfolio_full.jpeg"
            alt="FlexFolio"
            width={100}
            height={40}
            priority
            className="object-contain"
          />

          <nav className="flex items-center gap-3 sm:gap-4 min-w-0">
            {user ? (
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-full max-w-[140px] sm:max-w-none truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-400 hover:text-rose-600 transition shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:opacity-70 transition shrink-0">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* 3. HERO & FLOW INTERACTIVE SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12 px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24 z-10">

        {/* Left Side: Dynamic App Introduction */}
        <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100/80 rounded-full mb-6 mx-auto lg:mx-0 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase">
              How it works
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-950 leading-[1.1]">
            Your stunning portfolio, <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              generated in 3 steps.
            </span>
          </h1>

          {/* Detailed Platform Flow */}
          <div className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Select Template:</strong> Pick a premium pre-designed structural layout canvas.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Build & Customize:</strong> Fill out your details, projects, and experiences via a simple input form.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
              <p className="text-sm text-slate-600"><strong className="text-slate-900">Publish Instantly:</strong> Deploy immediately onto your global custom application path.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <Link href="/templates" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xl shadow-slate-950/10 hover:shadow-slate-950/20 transform hover:-translate-y-0.5 transition duration-200">
                Choose a Template
              </button>
            </Link>

            {!user && (
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200 shadow-sm transform hover:-translate-y-0.5 transition duration-200">
                  Create Free Account
                </button>
              </Link>
            )}
            {user && (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-xl border border-slate-200 shadow-sm transform hover:-translate-y-0.5 transition duration-200">
                  Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Step-by-Step Visual Live Form Mockup */}
        <div className="lg:col-span-6 flex flex-col gap-4 relative w-full max-w-xl mx-auto">
          {/* Visual Canvas 1: Completed State */}
          <div className="bg-slate-50/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 shadow-sm transition-all duration-300 relative group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Muted number for completed state */}
                <span className="w-5 h-5 rounded-full bg-slate-200/70 text-slate-500 text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-100">1</span>
                <span className="text-xs font-bold text-slate-600 tracking-tight">Select Your Template</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-500 font-bold">Template Selected</span>
            </div>

            <div className="space-y-3 opacity-80">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Preview Portfolio</label>
                <div className="px-3 py-2.5 bg-slate-100/50 border border-slate-200/50 rounded-xl text-xs font-mono text-slate-500">Use Template</div>
              </div>
            </div>
          </div>

          {/* Animated Processing Connection Dot Line */}
          <div className="flex justify-center my-1 relative z-0">
            <div className="h-6 w-[2px] bg-gradient-to-b from-slate-200 to-indigo-400 rounded-full animate-pulse opacity-80" />
          </div>

          {/* Visual Canvas 2: Active Form State */}
          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-indigo-100 shadow-[0_8px_30px_rgb(99,102,241,0.06)] ring-1 ring-indigo-50/50 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] transition-all duration-300 relative group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Highlighted number for active state */}
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center justify-center ring-2 ring-indigo-100/50 shadow-sm">2</span>
                <span className="text-xs font-bold text-slate-800 tracking-tight">Fill My Details</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded-full text-indigo-500 font-bold">Canvas Build</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-wider block mb-1.5 ml-0.5">Portfolio Slug Name</label>
                <div className="px-3 py-2.5 bg-white border border-indigo-100 rounded-xl text-xs font-mono text-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">johndoe</div>
              </div>
            </div>
          </div>

          {/* Animated Processing Connection Dot Line */}
          <div className="flex justify-center my-1 relative z-0">
            <div className="h-6 w-[2px] bg-gradient-to-b from-indigo-400 to-emerald-500 rounded-full animate-pulse opacity-80" />
          </div>

          {/* Visual Canvas 3: The Instant Live Routing */}
          <div className="bg-[#0A0F1C] text-white p-5 rounded-2xl border border-slate-800/80 shadow-2xl relative group overflow-hidden hover:border-slate-700 transition-all duration-500">
            {/* Subtle top inner glow */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center justify-center ring-2 ring-emerald-500/20">3</span>
                <span className="text-xs font-bold text-slate-200 tracking-tight">Instant Live Routing</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                https://alex.Flexfolio.online
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-sm shadow-inner">✨</div>
              <div>
                <div className="text-xs font-bold text-white tracking-wide mb-0.5">Production Build Successful</div>
                <div className="text-[10px] text-slate-400 font-medium">Deployed globally to edge network servers</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. PREMIUM USER FEATURES ADVANTAGES SECTION */}
      <section className="bg-white border-t border-slate-200/60 relative z-10 w-full px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Everything you need to launch effectively</h2>
            <p className="text-sm text-slate-500 mt-2">Engineered directly into your static deployment framework with zero installation dependencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Contact Inbox Configuration */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col justify-between hover:shadow-md transition duration-200">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm mb-4">📬</div>
                <h3 className="text-base font-bold text-slate-900">Free Contact Integration</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Anyone can drop messages straight through your live contact section. Review updates via your secure user dashboard, or let us dispatch a copy straight to your email inbox automatically.
                </p>
              </div>
            </div>

            {/* Feature 2: One-Click Engine Updates */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col justify-between hover:shadow-md transition duration-200">
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-sm mb-4">⚡</div>
                <h3 className="text-base font-bold text-slate-900">Easy One-Click Layout Switch</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Modify your presentation instantly. Seamlessly transform your live design presets into our latest structural portfolio themes without losing your filled database profile details.
                </p>
              </div>
            </div>

            {/* Feature 3: Automated Free SEO */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/50 flex flex-col justify-between hover:shadow-md transition duration-200">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm mb-4">📈</div>
                <h3 className="text-base font-bold text-slate-900">Built-in Automated SEO</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Get high-speed search optimization natively out-of-the-box. Your generated link comes fully packed with structured schema indexing rules to ensure Google reads your profile safely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}