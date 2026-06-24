"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { usePlan } from "@/hooks/usePlan";
import {
  Ban,
  Check,
  ChevronDown,
  Crown,
  Minus,
  ShieldCheck,
  Star,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    popular: false,
    features: [
      "2 Portfolios",
      "Free Templates",
      "20 Media Files",
      "20 MB Storage",
      "500 Portfolio Views",
      "5 AI Generations",
      "Contact Form",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 99,
    description: "For freelancers & professionals",
    popular: true,
    features: [
      "5 Portfolios",
      "Standard Templates",
      "1 Custom Domain",
      "500 MB Storage",
      "10,000 Portfolio Views",
      "100 AI Generations",
      "Basic Analytics & SEO",
      "Export to PDF",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 399,
    description: "Everything you need to scale",
    popular: false,
    features: [
      "Unlimited Portfolios",
      "Premium Templates",
      "5 Custom Domains",
      "5 GB Storage",
      "Unlimited Views & AI",
      "Advanced Analytics",
      "Export PDF & JSON",
      "Remove Branding",
      "Priority Support",
    ],
  },
];

const FAQS = [
  {
    question: "Can I upgrade later?",
    answer: "Yes, absolutely. You can upgrade or downgrade your plan at any time from your billing dashboard. Changes take effect immediately, and we'll prorate the difference.",
  },
  {
    question: "Do you support custom domains?",
    answer: "Yes! Both the Basic and Pro plans include custom domain support. You can easily connect a domain you already own or purchase a new one.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes, our Free plan allows you to create and publish up to 2 portfolios using our standard Flexfolio subdomain. It's a great way to test out the builder.",
  },
  {
    question: "What happens if I exceed my portfolio views?",
    answer: "Your portfolios will remain online, but we will notify you to upgrade to a higher tier to support your increased traffic.",
  },
];

export default function PricingPage() {
  const {user} = useAuth();
  const router = useRouter();
  const { plan, usage } = usePlan();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const getButtonText = (planId) => {
    if (plan === planId) return "Current Plan";

    if (
      (plan === "free" && planId !== "free") ||
      (plan === "basic" && planId === "pro")
    ) {
      return "Upgrade";
    }

    return "Downgrade";
  };

  const handlePlanSelect = (selectedPlan) => {
    if (!user) {
      router.push(`/auth/login`);
      return;
    }
    if (selectedPlan === plan) return;

    toast("Upgrade plan avalible soon")

    // router.push(`/checkout?plan=${selectedPlan}`);
  };

  return (
    <div className="relative min-h-dvh bg-purple-100 selection:bg-indigo-100 selection:text-indigo-900 pb-24 overflow-hidden font-sans">

      {/* --- REFINED SUBTLE BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 -z-20" />

      {/* Professional Soft Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-gradient-to-tr from-indigo-200/40 via-sky-100/30 to-blue-100/40 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-32 -left-20 w-[300px] h-[300px] bg-indigo-200/30 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-32 -right-20 w-[300px] h-[300px] bg-sky-200/30 blur-[100px] rounded-full -z-10 pointer-events-none" />
      {/* ----------------------------- */}

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 text-indigo-700 text-xs font-semibold tracking-wide uppercase border border-indigo-100 backdrop-blur-md shadow-sm mb-6">
          <Crown size={14} />
          Flexfolio Pricing
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-6xl mx-auto px-6 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {PLANS.map((singleplan) => (
            <div
              key={singleplan.name}
              className={`relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 ${singleplan.popular
                  ? "border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 lg:-translate-y-2 bg-white"
                  : "border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1"
                }`}
            >
              {singleplan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                    <Star size={12} className="fill-white" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-slate-900">{singleplan.name}</h3>
                  {plan === singleplan.id && (
                    <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Active Plan
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">{singleplan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ₹{singleplan.price}
                </span>
                <span className="text-sm text-slate-500 font-medium">/month</span>
              </div>

              <button
                disabled={plan === singleplan.id}
                onClick={() => handlePlanSelect(singleplan.id)}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all focus:ring-2 focus:ring-offset-2 ${plan === singleplan.id
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : singleplan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 focus:ring-indigo-600"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 focus:ring-slate-300"
                  }`}
              >
                {getButtonText(singleplan.id)}
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-5">
                  What's Included
                </p>
                <ul className="space-y-3.5">
                  {singleplan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} className="text-indigo-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED FEATURE COMPARISON TABLE */}
      <section className="max-w-5xl mx-auto px-6 mb-24 hidden md:block relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Compare Plans in Detail</h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-6 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-900 w-1/3">Core Features</th>
                  <th className="p-6 bg-slate-50 border-b border-slate-200 text-center text-sm font-bold text-slate-900 w-1/5">Free</th>
                  <th className="p-6 bg-white border-b border-slate-200 text-center text-sm font-bold text-indigo-600 relative w-1/5 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />
                    Basic
                  </th>
                  <th className="p-6 bg-slate-50 border-b border-slate-200 text-center text-sm font-bold text-slate-900 w-1/5">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">

                {/* Usage Limits */}
                <tr><td colSpan={4} className="py-4 px-6 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Usage & Limits</td></tr>
                {[
                  { feature: "Portfolios", free: "2", basic: "5", pro: "Unlimited" },
                  { feature: "Custom Domains", free: "0", basic: "1", pro: "5" },
                  { feature: "Media Files", free: "20", basic: "500", pro: "Unlimited" },
                  { feature: "Storage Limit", free: "20 MB", basic: "500 MB", pro: "5 GB" },
                  { feature: "Portfolio Views", free: "500", basic: "10,000", pro: "Unlimited" },
                  { feature: "AI Generations", free: "5", basic: "100", pro: "Unlimited" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 text-sm font-medium text-slate-700">{row.feature}</td>
                    <td className="p-4 text-center text-sm text-slate-600">{row.free}</td>
                    <td className="p-4 text-center text-sm font-bold text-slate-900 bg-indigo-50/30">{row.basic}</td>
                    <td className="p-4 text-center text-sm text-slate-600">{row.pro}</td>
                  </tr>
                ))}

                {/* Features & Tools */}
                <tr><td colSpan={4} className="py-4 px-6 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-100">Features & Tools</td></tr>
                {[
                  { feature: "Templates Available", free: "Free Only", basic: "Standard", pro: "Premium" },
                  { feature: "Contact Form", free: <Check size={18} className="mx-auto text-indigo-500" />, basic: <Check size={18} className="mx-auto text-indigo-500" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                  { feature: "SEO Settings", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: <Check size={18} className="mx-auto text-indigo-500" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                  { feature: "Analytics", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: "Basic", pro: "Advanced" },
                  { feature: "Export to PDF", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: <Check size={18} className="mx-auto text-indigo-500" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                  { feature: "Export to JSON", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: <Minus size={18} className="mx-auto text-slate-300" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                  { feature: "Remove Branding", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: <Check size={18} className="mx-auto text-indigo-500" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                  { feature: "Priority Support", free: <Minus size={18} className="mx-auto text-slate-300" />, basic: <Minus size={18} className="mx-auto text-slate-300" />, pro: <Check size={18} className="mx-auto text-indigo-500" /> },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors border-t border-slate-50">
                    <td className="p-4 pl-6 text-sm font-medium text-slate-700">{row.feature}</td>
                    <td className="p-4 text-center text-sm text-slate-600">{row.free}</td>
                    <td className="p-4 text-center text-sm font-bold text-slate-900 bg-indigo-50/30">{row.basic}</td>
                    <td className="p-4 text-center text-sm text-slate-600">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REFINED FEATURES/BENEFITS SECTION */}
      <section className="max-w-5xl mx-auto px-6 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Secure Payments
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Payments processed securely through Razorpay with bank-level encryption.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6">
              <Ban size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Cancel Anytime
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No long-term contracts, hidden fees, or complicated cancellation processes.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Instant Activation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upgrade your plan and instantly unlock all premium features and tools.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${isOpen ? "border-indigo-200 shadow-md shadow-indigo-100/50" : "border-slate-200 hover:border-slate-300"
                  }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <h3 className={`font-semibold pr-4 transition-colors ${isOpen ? "text-indigo-700" : "text-slate-900"}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"}`}>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}