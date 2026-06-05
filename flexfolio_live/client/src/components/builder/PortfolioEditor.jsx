"use client";

import DynamicField from "@/components/builder/DynamicField";
import RepeatableSection from "@/components/builder/RepeatableSection";
import { createPortfolio, updatePortfolio } from "@/lib/api";
import { templates } from "@/utils/templates";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PortfolioEditor({ templateKey, initialData, mode = "create", portfolioId = null }) {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const category = templateKey.split("~")[0];
  const template = templates[category];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image: initialData.image?.url || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value, index, action) => {
    setFormData((prev) => {
      if (action === "addTag") {
        const existing = Array.isArray(
          prev[key]
        )
          ? prev[key]
          : [];

        if (
          !existing.includes(value)
        ) {
          return {
            ...prev,
            [key]: [
              ...existing,
              value,
            ],
          };
        }

        return prev;
      }

      else if (
        action === "removeTag"
      ) {
        const existing = Array.isArray(
          prev[key]
        )
          ? prev[key]
          : [];

        return {
          ...prev,
          [key]:
            existing.filter(
              (t) => t !== value
            ),
        };
      }

      else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // CREATE
      if (mode === "create") {
        const payload =
          new FormData();

        if (
          formData.image instanceof
          File
        ) {
          payload.append(
            "image",
            formData.image
          );
        }

        payload.append(
          "templateKey",
          templateKey
        );

        payload.append(
          "data",
          JSON.stringify(formData)
        );

        const res =
          await createPortfolio(
            payload
          );

        if (res?.success) {
          router.push(
            `/portfolio/${res.username}`
          );
        }
      }

      // EDIT
      else {
        const payload = new FormData();

        if (formData.image instanceof File) {
          payload.append("image", formData.image);
        }

        payload.append(
          "data",
          JSON.stringify(formData)
        );

        await updatePortfolio(
          portfolioId,
          payload
        );

        toast(
          "Portfolio updated successfully"
        );
      }
    } catch (err) {
      console.error(err);

      toast(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-12">

      {/* HEADER */}
      <div className="mb-8 border-b pb-6">

        <h1 className="text-3xl font-extrabold text-slate-900">
          {mode === "create"
            ? "Build Your Portfolio"
            : "Edit Portfolio"}
        </h1>

        <p className="text-slate-500 mt-2">
          {mode === "create"
            ? "Fill in your details to generate your developer portfolio."
            : "Update your portfolio information."}
        </p>
      </div>

      {/* SECTIONS */}
      {template.schema.map(
        (section, i) => (
          <div
            key={i}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm"
          >

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {section.section}
            </h2>

            {!section.repeatable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {section.fields.map(
                  (field) => (
                    <DynamicField
                      key={
                        field.name
                      }
                      field={field}
                      value={
                        formData[
                        field.name
                        ]
                      }
                      onChange={
                        handleChange
                      }
                    />
                  )
                )}
              </div>
            )}

            {section.repeatable && (
              <RepeatableSection
                section={section}
                data={
                  formData[
                  section.key
                  ] || []
                }
                setData={(val) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      [section.key]:
                        val,
                    })
                  )
                }
              />
            )}

          </div>
        )
      )}

      {/* BUTTON */}
      <div className="sticky bottom-6 mt-10 z-40">

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all disabled:opacity-70 flex justify-center items-center gap-3"
        >

          {loading && (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}

          {loading
            ? mode === "create"
              ? "Publishing Portfolio..."
              : "Saving Changes..."
            : mode === "create"
              ? "Publish Portfolio"
              : "Save Changes"}

        </button>
      </div>
    </div>
  );
}