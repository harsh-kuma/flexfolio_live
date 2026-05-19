"use client";

import DynamicField from "@/components/builder/DynamicField";
import RepeatableSection from "@/components/builder/RepeatableSection";
import { createPortfolio, getCurrentUser } from "@/lib/api";
import { verifyTemplate } from "@/lib/verifyTemplate";
import { templates } from "@/utils/templates";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function BuilderForm() {
    const router = useRouter();
    const params = useSearchParams();

    const type = params.get("template");

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const isValidTemplate = verifyTemplate(type);

    const category = isValidTemplate ? type.split("-")[0] : null;

    const template = isValidTemplate
        ? templates[category]
        : null;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getCurrentUser();
                setCheckingAuth(false);
            } catch (err) {
                router.replace("/auth/login");
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (template) {
            setFormData({ ...template.defaultData });
        }
    }, [template]);

    if (checkingAuth) {
        return (
            <div className="p-10 text-center text-slate-500 animate-pulse">
                Checking authentication...
            </div>
        );
    }

    if (!isValidTemplate) {
        return <div>Invalid Template</div>;
    }

    const handleChange = (key, value, index, action) => {
        setFormData((prev) => {
            // Handle adding tags to a top-level array
            if (action === "addTag") {
                const existing = Array.isArray(prev[key]) ? prev[key] : [];

                if (!existing.includes(value)) {
                    return { ...prev, [key]: [...existing, value] };
                }

                return prev;
            }

            // Handle removing tags from a top-level array
            else if (action === "removeTag") {
                const existing = Array.isArray(prev[key]) ? prev[key] : [];

                return {
                    ...prev,
                    [key]: existing.filter((t) => t !== value),
                };
            }

            // Handle normal text/input fields
            else {
                return { ...prev, [key]: value };
            }
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const payload = new FormData();

            if (formData.image instanceof File) {
                payload.append("image", formData.image);
            }

            payload.append("templateKey", type);

            payload.append("data", JSON.stringify(formData));

            const res = await createPortfolio(payload);

            if (res?.success) {
                router.push(`/portfolio/${res.username}`);
            }
        } catch (err) {
            console.error("Submission failed:", err);
            alert("Something went wrong while publishing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full mx-auto space-y-12">
            <div className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Build Your Portfolio
                </h1>

                <p className="text-slate-500 mt-2">
                    Fill in your details to generate your developer portfolio.
                </p>
            </div>

            {template.schema.map((section, i) => (
                <div
                    key={i}
                    className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm"
                >
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        {section.section}
                    </h2>

                    {!section.repeatable && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {section.fields.map((field) => (
                                <DynamicField
                                    key={field.name}
                                    field={field}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    )}

                    {section.repeatable && (
                        <RepeatableSection
                            section={section}
                            data={formData[section.key] || []}
                            setData={(val) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    [section.key]: val,
                                }))
                            }
                        />
                    )}
                </div>
            ))}

            <div className="sticky bottom-6 mt-10 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all disabled:opacity-70 flex justify-center items-center gap-3"
                >
                    {loading && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}

                    {loading
                        ? "Publishing Portfolio..."
                        : "Publish Portfolio"}
                </button>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense
            fallback={
                <div className="p-10 text-center text-slate-500 animate-pulse">
                    Loading Builder...
                </div>
            }
        >
            <BuilderForm />
        </Suspense>
    );
}