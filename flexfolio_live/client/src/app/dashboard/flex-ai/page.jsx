"use client";

import DashboardPortfolioNotFound from "@/components/dashboard/layout/portfolio/DashboardPortfolioNotFound";
import { generateSiteByDocs } from "@/lib/api";
import { verifyTemplate } from "@/lib/verifyTemplate";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// --- SVG Icons ---
const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MagicWandIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const DevicesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const UploadButtonIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AI_STEPS = [
  "Loading your AI-generated portfolio...",
  "Preparing your professional profile...",
  "Organizing projects and experience...",
  "Building your portfolio layout...",
  "Applying the final finishing touches..."
];

export default function FlexAIPage() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("template");
  const isValidTemplate = verifyTemplate(type);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < AI_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF document.");
      return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("File is too large. Maximum size is 2MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    validateAndSetFile(e.target.files[0]);
    e.target.value = null;
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a resume to continue.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");

      const res = await generateSiteByDocs(formData);
      let generatedId = "";
      if (res.generatedId) {
        generatedId = res.generatedId;
      }
      router.push(`/dashboard/builder?template=${type}&generatedAiSlug=${generatedId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong while generating your portfolio. Please try again.");
      setLoading(false);
    }
  };

  if (!isValidTemplate) {
    return (
      <div>
        <DashboardPortfolioNotFound />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f9] flex flex-col items-center justify-center md:p-6 font-sans">

      {/* Main Card */}
      <div className="bg-white md:rounded-[32px] shadow-sm w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden border border-gray-100 p-8 md:p-12 gap-12">

        {/* Left Column: Features */}
        <div className="flex-1 flex flex-col">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f0f1ff] text-[#5b64f3] text-sm font-bold w-max mb-6">
            <SparkleIcon />
            AI POWERED
          </div>

          <h1 className="text-[36px] leading-tight font-extrabold text-gray-900 mb-4 tracking-tight">
            AI Portfolio <span className="text-[#5b64f3]">Builder</span>
          </h1>

          <p className="text-gray-500 text-md mb-10">
            Upload your resume and let AI craft a stunning, professional portfolio tailored just for you.
          </p>

          <div className="space-y-8 flex-1">
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#5b64f3] shrink-0">
                <DocumentIcon />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Smart Resume Analysis</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  AI scans your resume and extracts key information instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#5b64f3] shrink-0">
                <MagicWandIcon />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Personalized Content</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Generates engaging copy that highlights your skills and experience.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#5b64f3] shrink-0">
                <DevicesIcon />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Beautiful Portfolios</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Creates modern, responsive portfolios that make you stand out.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload Zone */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="h-full border-2 border-dashed border-[#e2e4f0] rounded-[24px] bg-[#fafafc] flex flex-col items-center justify-center p-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-24 h-24 bg-[#5b64f3] rounded-full animate-ping opacity-20"></div>
                <div className="absolute w-16 h-16 bg-[#5b64f3] rounded-full animate-pulse opacity-40"></div>
                <div className="relative w-14 h-14 bg-[#5b64f3] rounded-full flex items-center justify-center text-white shadow-xl">
                  <SparkleIcon className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-6 transition-all duration-300 text-center">
                {AI_STEPS[loadingStep]}
              </h3>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#5b64f3] h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((loadingStep + 1) / AI_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`h-full min-h-[400px] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-10 text-center transition-all duration-200 ${isDragging
                  ? "border-[#5b64f3] bg-[#f8f9ff]"
                  : "border-[#e2e4f0] bg-[#fafafc] hover:bg-[#f8f9ff] hover:border-[#cbd0f9]"
                }`}
            >
              {!file ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#5b64f3] mb-8 shadow-sm">
                    <CloudUploadIcon />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-gray-500 mb-6">or click to browse files</p>

                  <span className="px-4 py-1.5 bg-[#f0f1ff] text-[#717698] text-xs font-semibold rounded-md mb-8">
                    PDF only (Max 2MB)
                  </span>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center px-6 py-3.5 bg-[#5b64f3] text-white font-semibold rounded-xl hover:bg-[#4b54e3] transition-colors shadow-md w-48"
                  >
                    <UploadButtonIcon />
                    Choose File
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-6 shadow-sm">
                    <FileIcon />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 w-full truncate px-4">
                    {file.name}
                  </h3>
                  <p className="text-gray-500 mb-8 font-medium">
                    {formatFileSize(file.size)}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => { setFile(null); setError(""); }}
                      className="flex items-center justify-center px-5 py-2.5 bg-white border border-gray-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm"
                    >
                      <TrashIcon />
                      <span className="ml-2">Remove</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center px-5 py-2.5 bg-[#f0f1ff] text-[#5b64f3] font-semibold rounded-xl hover:bg-[#e4e6ff] transition-colors shadow-sm"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center border border-red-100">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Generate Section */}
      <div className="w-full max-w-5xl mt-6 flex flex-col items-center p-2 mb-6">
        <button
          onClick={handleGenerate}
          disabled={!file || loading}
          className={`group w-full py-4 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 ${!file || loading
              ? "bg-[#e8ebf3] text-[#a0a5ba] cursor-not-allowed"
              : "bg-gradient-to-r from-[#5b64f3] via-[#7c84ff] to-[#5b64f3] bg-[length:200%_auto] text-white shadow-md hover:shadow-xl hover:bg-right hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0"
            }`}
        >
          <SparkleIcon
            className={`w-5 h-5 mr-2 transition-transform duration-500 ${!file || loading ? "" : "group-hover:rotate-12 group-hover:scale-110"
              }`}
          />
          Generate Portfolio
        </button>

        <div className="flex items-center text-[#a0a5ba] text-sm font-medium mt-4">
          <LockIcon />
          Click the button above to generate your AI portfolio
        </div>
      </div>

    </div>
  );
}