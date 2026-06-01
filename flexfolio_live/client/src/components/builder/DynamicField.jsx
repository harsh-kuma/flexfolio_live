"use client";

import { getCompany } from "@/lib/api";
import { useEffect, useRef, useState } from "react";

export default function DynamicField({ field, value, onChange, itemIndex, currentData }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debounceTimeout = useRef(null);
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);
    const today = new Date().toISOString().split("T")[0];

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);

            return () => URL.revokeObjectURL(url);
        }

        if (typeof value === "string" && value.length > 0) {
            setPreviewUrl(value);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    // ✅ Click outside to close autocomplete
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAuto = (val) => {
        onChange(field.name, val, itemIndex);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (val.trim().length > 2) {
            setLoading(true);
            debounceTimeout.current = setTimeout(async () => {
                try {
                    const res = await getCompany(val);
                    setSuggestions(res || []);
                } catch (err) {
                    console.error("Company fetch error", err);
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            }, 700); // 700ms debounce
        } else {
            setSuggestions([]);
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        const mapped = field.mapResult ? field.mapResult(item) : {};
        Object.keys(mapped).forEach((key) => onChange(key, mapped[key], itemIndex));
        setSuggestions([]);
    };

    if (field.type === "hidden") return null;

    // ✅ COMMON STYLES
    const baseInput = "w-full p-3 bg-slate-50 text-slate-900  border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm";
    const labelStyle = "text-xs font-semibold text-slate-700 mb-1.5 block ml-1 uppercase tracking-wide";

    // 🔹 FILE (IMAGE)
    // 🔹 FILE (IMAGE)
    if (field.type === "file") {
        // Generate a preview URL if the value is a File object (newly uploaded) or a string (existing image URL)

        return (
            <div className="w-full md:col-span-2">
                {field.label && <label className={labelStyle}>{field.label}</label>}

                <div className="flex items-center gap-5 p-4 border border-slate-200 rounded-xl bg-slate-50">
                    {/* 1. The Image Preview Box */}
                    <div className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-slate-400 font-medium text-center">No<br />Image</span>
                        )}
                    </div>

                    {/* 2. The File Input */}
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    onChange(field.name, file, itemIndex);
                                }
                            }}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 file:shadow-sm hover:file:bg-blue-50 transition cursor-pointer"
                        />
                        <p className="text-xs text-slate-400 mt-2 ml-1">
                            Recommended: Square image (1:1), max 2MB.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 🔹 TEXT / EMAIL / TEL
    if (["text", "email", "tel"].includes(field.type)) {
        return (
            <div className="w-full">
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <input
                    type={field.type}
                    value={value || ""}
                    placeholder={field.placeholder || ""}
                    onChange={(e) => onChange(field.name, e.target.value, itemIndex)}
                    className={baseInput}
                />
            </div>
        );
    }

    // 🔹 TEXTAREA
    if (field.type === "textarea") {
        return (
            <div className="w-full md:col-span-2">
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <textarea
                    rows={4}
                    value={value || ""}
                    placeholder={field.placeholder || ""}
                    onChange={(e) => onChange(field.name, e.target.value, itemIndex)}
                    className={`${baseInput} resize-y`}
                />
            </div>
        );
    }

    // 🔹 DATE
    if (field.type === "date") {
        // Disable end date if "currently working here" is checked
        const isDisabled = field.name === "endDate" && currentData?.current;
        return (
            <div className="w-full">
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <input
                    type="date"
                    max={today}
                    value={isDisabled ? "" : (value || "")}
                    disabled={isDisabled}
                    onChange={(e) => onChange(field.name, e.target.value, itemIndex)}
                    className={`${baseInput} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                />
            </div>
        );
    }

    // 🔹 SELECT
    if (field.type === "select") {
        return (
            <div className="w-full">
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <select
                    value={value || ""}
                    onChange={(e) => onChange(field.name, e.target.value, itemIndex)}
                    className={baseInput}
                >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        );
    }

    // 🔹 CHECKBOX
    if (field.type === "checkbox") {
        return (
            <div className="w-full flex items-center h-full pt-6">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(field.name, e.target.checked, itemIndex)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    {field.label}
                </label>
            </div>
        );
    }

    // 🔹 TAGS (SKILLS)
    if (field.type === "tags") {
        return (
            <div className="w-full md:col-span-2">
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50 min-h-[50px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    {(Array.isArray(value) ? value : []).map((tag) => (
                        <span key={tag} className="bg-slate-800 text-white px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-2 shadow-sm">
                            {tag}
                            <button
                                type="button"
                                onClick={() => onChange(field.name, tag, itemIndex, "removeTag")}
                                className="text-slate-300 hover:text-white transition"
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                    <input
                        placeholder={value?.length > 0 ? "Add another..." : "Type & press Enter"}
                        className="bg-transparent text-black outline-none text-sm flex-1 min-w-[120px] py-1"
                        enterKeyHint="done"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                const input = e.currentTarget;
                                const tagValue = e.target.value.trim()
                                if (tagValue) {
                                    onChange(field.name, tagValue, itemIndex, "addTag");
                                    input.value = "";
                                    requestAnimationFrame(() => {
                                        input.focus();
                                    });
                                }
                            }
                        }}
                    />
                </div>
            </div>
        );
    }

    // 🔹 AUTOCOMPLETE (COMPANY)
    if (field.type === "autocomplete") {
        return (
            <div className="relative w-full" ref={wrapperRef}>
                {field.label && <label className={labelStyle}>{field.label}</label>}
                <div className="relative">
                    <input
                        value={value || ""}
                        placeholder={field.placeholder || "Search company..."}
                        onChange={(e) => handleAuto(e.target.value)}
                        className={baseInput}
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-2 max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                onClick={() => handleSelect(s)}
                                className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                            >
                                <img
                                    src={s.logo || `https://img.logo.dev/${s.domain}?token=pk_BxQc27sjQO-zNmnI6_yF7Q`}
                                    alt={s.name}
                                    className="w-8 h-8 rounded-lg bg-slate-100 object-contain p-1 border border-slate-200"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.domain}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return null;
}