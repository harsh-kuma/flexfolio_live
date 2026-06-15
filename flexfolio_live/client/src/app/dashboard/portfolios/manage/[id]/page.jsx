"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createDomain,
  deleteDomain,
  deletePortfolio,
  getPortfolioForManage,
  publishPortfolio,
  sendPortfolioVerificationEmail,
  unpublishPortfolio,
  updatePortfolioGeneralDetail,
  verifyDomain,
  verifyPortfolioEmailOtp
} from "@/lib/api";

import Loader from "@/components/common/loader/Loader";
import DashboardPortfolioNotFound from "@/components/dashboard/layout/portfolio/DashboardPortfolioNotFound";
import { useAuth } from "@/components/providers/AuthProvider";
import { isValidDomain, normalizeDomain } from "@/utils/domain";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  MailWarning,
  Pencil,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dr38wac7n/image/upload/v1779525495/default_portfolio_shk797.png";

export default function PortfolioManagePage() {
  const { fetchUser } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [domain, setDomain] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState(false);

  const [form, setForm] = useState({ title: "", username: "" });

  const [showVerifyBox, setShowVerifyBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await getPortfolioForManage(id);
        const portfolio = res?.portfolio;

        setData(portfolio);
        setForm({
          title: portfolio?.title || "",
          username: portfolio?.username || "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const isLive = data?.isPublished;
  const isEmailVerified = data?.emailVerified;

  const saveChanges = async () => {
    setSaving(true);
    try {
      await updatePortfolioGeneralDetail({ id, form });
      setData((prev) => ({
        ...prev,
        ...form,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    setPublishing(true);
    try {
      if (isLive) await unpublishPortfolio(id);
      else await publishPortfolio(id);

      setData((p) => ({ ...p, isPublished: !isLive }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setPublishing(false);
    }
  };

  const deleteItem = async () => {
    const ok = confirm("Are you sure you want to delete this portfolio? All portfolio data, contact messages, and uploaded images will be permanently removed. This action cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    try {
      await deletePortfolio(id);
      await fetchUser();
      router.push("/dashboard/portfolios");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const verifyEmail = async () => {
    setEmailSending(true);
    try {
      const data = await sendPortfolioVerificationEmail({ id });
      toast.success(data.message);

      setShowVerifyBox(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setEmailSending(false);
    }
  };

  const verifyOtp = async () => {
    setVerifying(true);
    try {
      const data = await verifyPortfolioEmailOtp({ id, otp });

      setData((prev) => ({
        ...prev,
        emailVerified: true,
      }));

      setShowVerifyBox(false);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyUrl = async (username, isPublished, main = false) => {
    const url = isPublished ? (main ? `https://${username}.flexfolio.online` : `https://flexfolio.online/portfolio/${username}`) : `https://flexfolio.online/preview/${username}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const connectDomain = async () => {
    const cleanDomain = normalizeDomain(domain);

    if (!isValidDomain(cleanDomain)) {
      return toast.error("Enter a valid domain");
    }

    try {
      setDomainLoading(true);

      const res = await createDomain({
        portfolioId: id,
        domain: cleanDomain,
      });

      setData((prev) => ({
        ...prev,
        pendingDomain: res?.domain,
        dnsRecords: res?.dnsRecords,
        domainVerified: false,
      }));

      toast.success("Domain connected");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to connect domain"
      );
    } finally {
      setDomainLoading(false);
    }
  };


  const verifyDomainHandler = async () => {
    try {
      setVerifyingDomain(true);

      const res = await verifyDomain(id);

      if (res.verified) {
        setData((prev) => ({
          ...prev,
          domainVerified: res.verified,
          customDomain: data.pendingDomain,
          pendingDomain: null,
          dnsRecords: [],
          domainVerificationError: null,
        }));

        toast.success("Domain verified");
      } else {
        setData((prev) => ({
          ...prev,
          domainVerificationError: res.error,
        }));
        toast.error("DNS not configured yet");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Verification failed"
      );
    } finally {
      setVerifyingDomain(false);
    }
  };

  const removeDomainHandler = async () => {
    const confirmed = window.confirm(
      `Remove ${data.customDomain ? data.customDomain : data.pendingDomain}?`
    );

    if (!confirmed) return;

    try {
      await deleteDomain(id);

      setData((prev) => ({
        ...prev,
        customDomain: null,
        pendingDomain: null,
        domainVerified: false,
        domainConnectedAt: null,
        domainVerificationError: null,
        dnsRecords: [],
      }));

      setDomain("");

      toast.success("Domain removed");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to remove domain"
      );
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!data) {
    return (
      <DashboardPortfolioNotFound />
    );
  }

  return (
    <div className="min-h-dvh bg-white pb-12">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* TOP NAVIGATION */}
        <Link
          href="/dashboard/portfolios"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Sites
        </Link>

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your site details, visibility, and settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${isLive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
            >
              {isLive ? <Globe size={14} /> : <XCircle size={14} />}
              {isLive ? "PUBLISHED" : "DRAFT"}
            </span>
            {isLive && (
              <Link
                href={`https://${data.username}.flexfolio.online`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ExternalLink size={16} />
                View Live
              </Link>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - MAIN DETAILS */}
          <div className="lg:col-span-2 space-y-6">

            {/* THUMBNAIL PREVIEW */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative h-48 sm:h-64 bg-gray-100 group">
                <img
                  src={data?.thumbnail || DEFAULT_IMAGE}
                  alt={data?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href={`/dashboard/portfolios/edit/${id}`}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil size={16} /> Edit Site
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{data?.title || "Untitled Portfolio"}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">/{data?.username}</p>
              </div>
            </div>

            {/* GENERAL SETTINGS FORM */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4">General Portfolio Details</h2>

              <div className="space-y-5 text-black">
                <div className="space-y-1.5">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Site Title
                  </label>
                  <input
                    id="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value
                          .replace(/\s+/g, " ")
                          .trimStart(),
                      })
                    }
                    onBlur={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value.trim(),
                      })
                    }
                    placeholder="E.g., Jane Doe - Product Designer"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Custom Username (URL)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <span className="bg-gray-50 px-2 py-2.5 text-gray-500 text-sm border-r border-gray-300">
                      https://
                    </span>
                    <input
                      id="username"
                      value={form.username}
                      onChange={(e) => {
                        let value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "") // only letters, numbers, hyphen
                          .replace(/-{2,}/g, "-") // prevent multiple hyphens
                          .replace(/^-+/, ""); // prevent starting hyphen

                        setForm({ ...form, username: value });
                      }}
                      onBlur={() => {
                        setForm((prev) => ({
                          ...prev,
                          username: prev.username.replace(/-+$/, ""), // prevent ending hyphen
                        }));
                      }}
                      placeholder="username"
                      className="w-full px-4 py-2.5 text-sm outline-none bg-transparent"
                    />
                    <span className="bg-gray-50 px-2 py-2.5 text-gray-500 text-sm border-r border-gray-300">
                      .flexfolio.online
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={saveChanges}
                    disabled={saving || (form.title === data.title && form.username === data.username)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - ACTIONS & STATUS */}
          <div className="space-y-6">

            {/* PUBLISH STATUS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase mb-4">Visibility</h2>
              {data.isPublished && (
                <div className="flex items-center justify-between gap-2 p-1.5 pl-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Globe size={14} className="text-blue-500 shrink-0" />
                    <span className="text-xs text-gray-600 truncate select-all">
                      https://{data.username}.flexfolio.online
                    </span>

                  </div>
                  <button
                    onClick={() => handleCopyUrl(data.username, data.isPublished, true)}
                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    title="Copy URL"
                    aria-label="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 p-1.5 pl-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  {data.isPublished ?
                    <>
                      <Globe size={14} className="text-blue-500 shrink-0" />
                      <span className="text-xs text-gray-600 truncate select-all">
                        https://flexfolio.online/portfolio/{data.username}
                      </span>
                    </> :
                    <>
                      <Lock size={14} className="text-green-600 shrink-0" />
                      <span className="text-xs text-gray-600 truncate select-all">
                        https://flexfolio.online/preview/{data.username}
                      </span>
                    </>}
                </div>
                <button
                  onClick={() => handleCopyUrl(data.username, data.isPublished)}
                  className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  title="Copy URL"
                  aria-label="Copy URL"
                >
                  <Copy size={14} />
                </button>
              </div>
              <button
                onClick={togglePublish}
                disabled={publishing}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${isLive
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-blue-600 border border-transparent text-white hover:bg-blue-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isLive ? (
                  <>
                    <XCircle size={16} /> Unpublish Site
                  </>
                ) : (
                  <>
                    <Globe size={16} /> Publish Site
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {isLive
                  ? "Your portfolio is visible to anyone with the link."
                  : "Your portfolio is currently hidden from the public."}
              </p>
            </div>

            {/* EMAIL VERIFICATION */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase mb-4">Account Status</h2>

              <div className="mt-2 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Email :
                </span>

                <span className="text-sm font-medium text-gray-800 truncate ml-2">
                  {data?.email}
                </span>
              </div>

              {!isEmailVerified ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <MailWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold">Email Unverified</p>
                      <p className="mt-0.5 opacity-90">Verify your email to unlock all features.</p>
                    </div>
                  </div>
                  <button
                    onClick={verifyEmail}
                    disabled={emailSending}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Resend Verification Link"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Email Verified</span>
                </div>
              )}

              {showVerifyBox && !isEmailVerified && (
                <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3 shadow-sm">

                  <div className="text-sm font-medium text-gray-700">
                    Enter Verification Code
                  </div>

                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(value);
                    }}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full border rounded-lg px-3 py-2 tracking-widest bg-white text-black"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyOtp()}
                      disabled={verifying}
                      className="flex-1 bg-black text-white py-2 rounded-lg text-sm"
                    >
                      {verifying ? "Verifying..." : "Verify"}
                    </button>

                    <button
                      onClick={() => setShowVerifyBox(false)}
                      className="flex-1 border py-2 rounded-lg text-sm text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DANGER ZONE */}
            <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <h2 className="text-sm font-bold tracking-wide text-red-600 uppercase mb-2">Danger Zone</h2>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete a portfolio, there is no going back. Please be certain.
              </p>
              <button
                onClick={deleteItem}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} /> Delete Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          {/* CUSTOM DOMAIN */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  Custom Domain
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Connect your own domain to this portfolio.
                </p>
              </div>

              {data?.domainVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
                  <CheckCircle2 size={14} />
                  Verified
                </span>
              )}
            </div>

            {!data?.customDomain && !data?.pendingDomain ? (
              <>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />

                  <p className="text-xs text-gray-500">
                    Enter your root domain without https:// or www.
                  </p>

                  <button
                    onClick={connectDomain}
                    disabled={domainLoading}
                    className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    {domainLoading ? "Connecting..." : "Connect Domain"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* CONNECTED DOMAIN */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Connected Domain
                      </p>

                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-gray-500" />

                        <p className="font-semibold text-gray-900 break-all">
                          {data.customDomain ? data.customDomain : data.pendingDomain}
                        </p>
                      </div>

                      {data?.domainConnectedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Connected on{" "}
                          {new Date(
                            data.domainConnectedAt
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          data.customDomain ? data.customDomain : data.pendingDomain
                        );
                        toast.success("Domain copied");
                      }}
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-4">
                  {data.domainVerified ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={18}
                          className="text-green-600"
                        />

                        <p className="font-medium text-green-800">
                          Domain Successfully Verified
                        </p>
                      </div>

                      <p className="text-sm text-green-700 mt-2">
                        Your portfolio is now available on your custom
                        domain.
                      </p>

                      <a
                        href={`https://${data.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
                      >
                        <ExternalLink size={15} />
                        Visit Domain
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <Globe
                              size={16}
                              className="text-amber-600"
                            />

                            <p className="text-sm font-semibold text-amber-900">
                              DNS Configuration Required
                            </p>
                          </div>

                          <p className="text-xs text-amber-700 mt-1">
                            Add the DNS record below in your domain
                            provider dashboard and then click Verify.
                          </p>
                        </div>

                        {/* DNS TABLE */}
                        <div className="bg-white">
                          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-xs font-medium text-gray-500 border-b bg-gray-50">
                            <span>Type</span>
                            <span>Name</span>
                            <span>Value</span>
                          </div>

                          {data.dnsRecords?.map((record, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-4 px-4 py-4 text-sm items-center border-b last:border-b-0"
                            >
                              <span className="font-medium text-gray-900">
                                {record.type}
                              </span>
                              <div className="flex items-center justify-normal gap-2">
                                <span className="font-mono text-gray-700 truncate">
                                  {record.host}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(record.host);
                                    toast.success("DNS Name copied");
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>

                              <div className="flex items-center justify-normal gap-2">
                                <span className="font-mono text-gray-900 truncate">
                                  {record.value}
                                </span>

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(record.value);
                                    toast.success("DNS Value copied");
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="px-4 py-3 border-t border-amber-200 bg-amber-50">
                          <p className="text-xs text-amber-800">
                            DNS propagation may take anywhere from a few
                            minutes up to 24 hours.
                          </p>
                        </div>
                      </div>

                      {data?.domainVerificationError && (
                        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
                          <p className="text-sm text-red-700">
                            {data.domainVerificationError}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-5">
                  {!data.domainVerified && (
                    <button
                      onClick={verifyDomainHandler}
                      disabled={verifyingDomain}
                      className="flex-1 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white rounded-xl py-3 text-sm font-medium"
                    >
                      {verifyingDomain
                        ? "Verifying..."
                        : "Verify Domain"}
                    </button>
                  )}

                  <button
                    onClick={removeDomainHandler}
                    className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    Remove Domain
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}