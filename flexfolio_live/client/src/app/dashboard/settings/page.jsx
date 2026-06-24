"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { usePlan } from "@/hooks/usePlan";
import { deleteAccountAPI, updateProfileAPI } from "@/lib/api";

import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronRight,
  Crown,
  Files,
  Folder,
  Globe,
  HardDrive,
  Lock,
  Shield,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SettingsPage() {
  const { fetchUser } = useAuth();
  const { user, plan, usage, features, canCreatePortfolio, canAddDomain } = usePlan();

  // Initial state to track changes against
  const [initialData, setInitialData] = useState({
    name: "",
    username: "",
    profile: "",
  });

  const [form, setForm] = useState({
    name: "",
    username: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fileInputRef = useRef(null);

  // Sync user data when it loads
  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        username: user.username || "",
        profile: user.profile || "",
      };
      setInitialData(data);
      setForm({ name: data.name, username: data.username });
    }
  }, [user]);

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ----------------------------
  // DYNAMIC USAGE VALUES
  // ----------------------------

  const portfoliosUsed = usage?.portfolios || 0;
  const maxPortfolios = features.maxPortfolios === -1 ? "Unlimited" : features.maxPortfolios;
  const usagePercentage = features.maxPortfolios === -1 ? 100 : Math.min((portfoliosUsed / features.maxPortfolios) * 100, 100);

  const domainUsed = usage?.domains || 0;
  const maxDomains = features.maxDomains === -1 ? "Unlimited" : features.maxDomains;
  let domainUsagePercentage;
  if(maxDomains !== 0){
    domainUsagePercentage = features.maxDomains === -1 ? 100 : Math.min((domainUsed / features.maxDomains) * 100, 100);
  }else{
    domainUsagePercentage = 100;
  }
  

  const mediaUsed = usage?.mediaFiles || 0;
  const maxMediaFiles = features.maxMediaFiles === -1 ? "Unlimited" : features.maxMediaFiles;
  const mediaUsagePercentage = features.maxMediaFiles === -1 ? 100 : Math.min((mediaUsed / features.maxMediaFiles) * 100, 100);


  const storageUsed = usage?.storageUsed || 0;
  const storageLimit = features.storageLimit === -1 ? "Unlimited" : features.storageLimit;
  const storageUsagePercentage = features.storageLimit === -1 ? 100 : Math.min((storageUsed / features.storageLimit) * 100, 100);

  // ----------------------------
  // VALIDATION LOGIC
  // ----------------------------
  const isUsernameValid = form.username === "" || /^[a-zA-Z0-9-]+$/.test(form.username);

  const hasChanges =
    form.name.trim() !== initialData.name ||
    form.username.trim() !== initialData.username ||
    selectedFile !== null;

  const canSave = hasChanges && isUsernameValid && form.name.trim() !== "" && form.username.trim() !== "";

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleChange = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict 2MB size limit check
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "Image size must be less than 2MB", type: "error" });
      e.target.value = ""; // Reset input
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage({ text: "", type: "" });
  };

  const handleSave = async () => {
    if (!canSave) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Build FormData payload for the backend
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);

      // Append raw file if user selected a new image
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      // Send to backend (backend handles Cloudinary upload)
      const data = await updateProfileAPI(formData);
      await fetchUser();

      if (data.success) {
        setMessage({ text: "Profile updated successfully", type: "success" });

        // Update local state to disable the save button
        setInitialData({
          name: form.name,
          username: form.username,
          profile: data.user?.profile || initialData.profile // fallback to old profile if backend doesn't return new URL
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      }
    } catch (err) {
      setMessage({
        text: err?.response?.data?.message || "Update failed. Username might be taken.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone. Once your account is deleted, all associated data will be permanently removed, including your portfolios and portfolio content, analytics and visitor statistics, contact form messages, uploaded images and files, account settings, profile information, and any other data connected to your account. After deletion, you will no longer be able to access or recover this information. Please make sure you have backed up any important data before proceeding."
    );

    if (!confirmDelete) return;

    setDeleteLoading(true);

    try {
      const data = await deleteAccountAPI();
      await fetchUser();
    } catch (err) {
      setMessage({ text: "Failed to delete account", type: "error" });
      setDeleteLoading(false);
    }
  };

  const formatStorage = (bytes) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-dvh bg-[#F8F9FA] px-4 py-8 sm:px-6 lg:px-10 font-sans pb-24">
      <div className="mx-auto space-y-8 max-w-5xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Manage your account, profile and preferences.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {message.text && (
              <span className={`text-sm font-medium hidden md:block ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!canSave || loading}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 ${!canSave || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#5642E6] hover:bg-[#4a39c7] text-white"
                }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Mobile Message Display */}
        {message.text && (
          <div className={`md:hidden p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal details and how others see you.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar Column */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={previewUrl || initialData.profile || "/flexfolio_logo.jpeg"}
                  alt="Profile avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm bg-gray-100 transition-opacity group-hover:opacity-90"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-700 hover:text-[#5642E6] transition-colors"
                >
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#5642E6] text-sm font-medium border border-[#5642E6]/20 bg-[#5642E6]/5 hover:bg-[#5642E6]/10 px-4 py-2 rounded-lg transition-colors"
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileSelect}
                />
                <p className="mt-2 text-xs text-gray-400">JPG, PNG up to 2MB</p>
              </div>
            </div>

            {/* Inputs Column */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="text-black w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5642E6]/20 focus:border-[#5642E6] outline-none transition-all"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50/50 text-gray-500 cursor-not-allowed outline-none"
                />
                {user?.isVerified && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <BadgeCheck size={16} className="text-green-500" />
                    <span className="text-xs font-medium text-green-600">Verified Email</span>
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Username
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`text-black w-full md:max-w-[50%] border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${!isUsernameValid
                    ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                    : "border-gray-200 focus:ring-[#5642E6]/20 focus:border-[#5642E6]"
                    }`}
                  placeholder="username-slug"
                />

                {/* Real-time username validation feedback */}
                {!isUsernameValid ? (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> Use only letters, numbers, and hyphens.
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* USAGE OVERVIEW */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Usage Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Track your current usage and limits.</p>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="bg-[#5642E6]/10 p-4 rounded-xl text-[#5642E6]">
                <Folder size={32} strokeWidth={1.5} />
              </div>

              <div className="flex-1 w-full">
                <p className="text-sm font-medium text-gray-500 mb-1">Portfolios Created</p>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{portfoliosUsed}</span>
                  <span className="text-sm text-gray-500 mb-1.5">
                    out of {maxPortfolios} allowed
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{features.maxPortfolios === -1 ? "Unlimited" : `${Math.round(usagePercentage)}%`}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 bg-[#5642E6]"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                {plan !== "pro" && (
                  <p className="text-xs text-gray-500">Upgrade to Pro for unlimited portfolios.</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Domains Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">Domains</p>
                  <div className="flex items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <Globe size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{domainUsed}</h3>
                  <span className="text-sm font-medium text-gray-500">
                    / {maxDomains}
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{features.maxDomains === -1 ? "Unlimited" : `${Math.round(domainUsagePercentage)}%`}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500 bg-blue-600"
                      style={{ width: `${domainUsagePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Media Files Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">Media Files</p>
                  <div className="flex items-center justify-center rounded-full bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                    <Files size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{mediaUsed}</h3>
                  <span className="text-sm font-medium text-gray-500">
                    / {maxMediaFiles}
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{features.maxMediaFiles === -1 ? "Unlimited" : `${Math.round(mediaUsagePercentage)}%`}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500 bg-purple-600"
                      style={{ width: `${mediaUsagePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Storage Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">Storage</p>
                  <div className="flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <HardDrive size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {formatStorage(storageUsed)}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">
                    / {formatStorage(storageLimit)}
                  </span>
                </div>
                 <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{features.storageLimit === -1 ? "Unlimited" : `${Math.round(storageUsagePercentage)}%`}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500 bg-emerald-600"
                      style={{ width: `${storageUsagePercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your subscription and billing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Plan Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl bg-[#5642E6]/10 ${plan !== "pro" ? "text-[#5642E6]" : "text-amber-500"}`}>
                  <Crown size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">{plan} Plan</h3>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user?.subscription?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {user?.subscription?.status || "Active"}
                </span>
              </div>

              {plan !== "pro" && ( 
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link href="/pricing" className="bg-[#5642E6] hover:bg-[#4a39c7] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <Crown size={16} /> Upgrade to Pro
                  </Link>
                  <Link href="/pricing" className="text-[#5642E6] text-sm font-medium hover:underline flex items-center gap-1">
                    View Plans & Features <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* Plan Features */}
            <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 max-h-60 overflow-y-auto scrollbar-thin">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <Check size={18} className="text-green-500 shrink-0" />
                  {maxPortfolios} Portfolios
                </li>

                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <Check size={18} className="text-green-500 shrink-0" />
                  {features.maxDomains === -1
                    ? "Unlimited Domains"
                    : `${features.maxDomains} Custom Domains`}
                </li>

                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <Check size={18} className="text-green-500 shrink-0" />
                  {features.templates.charAt(0).toUpperCase() + features.templates.slice(1)} Templates
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.contactForm
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.contactForm
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  Contact Form
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.removeBranding
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.removeBranding
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  Remove Branding
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.seoSettings
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.seoSettings
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  SEO Setting
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.analytics
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.analytics
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  Analytics
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.customDomain
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.customDomain
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  Custom Domain
                </li>

                <li className={`flex items-center gap-3 text-sm ${features.prioritySupport
                  ? "text-gray-700"
                  : "text-gray-400"
                  }`}>
                  {features.prioritySupport
                    ? <Check size={18} className="text-green-500 shrink-0" />
                    : <Lock size={18} className="text-gray-300 shrink-0" />}
                  Priority Support
                </li>

              </ul>
            </div>
          </div>
        </div>

        {/* SECURITY / DANGER ZONE */}
        <div className="bg-white border border-red-50/50 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-500 mt-1">Irreversible and destructive actions.</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Delete Account */}
            <div
              onClick={handleDeleteAccount}
              className={`flex items-center justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl hover:bg-red-50 transition-colors cursor-pointer group ${deleteLoading && "opacity-50 pointer-events-none"}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-2.5 rounded-lg text-red-600">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{deleteLoading ? "Deleting..." : "Delete Account"}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all data</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 pb-8 text-center px-4">
          <Shield size={16} className="shrink-0" />
          <p>Your data is secure.</p>
        </div>

      </div>
    </div>
  );
}