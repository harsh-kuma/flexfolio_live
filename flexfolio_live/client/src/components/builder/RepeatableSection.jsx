"use client";

import DynamicField from "./DynamicField";

export default function RepeatableSection({ section, data, setData }) {
  const today = new Date().toISOString().split("T")[0];

  const validateDates = (item) => {
    if (item.startDate && item.startDate > today) return "Start date cannot be in the future";
    if (item.endDate && item.endDate > today) return "End date cannot be in the future";
    if (item.endDate && item.startDate && item.endDate < item.startDate) return "End date cannot be before start date";
    return null;
  };

  const updateItem = (key, value, index, action) => {
    const updated = [...data];

    if (action === "addTag") {
      const existing = updated[index][key] || [];
      if (!existing.includes(value)) {
        updated[index][key] = [...existing, value];
      }
    } else if (action === "removeTag") {
      updated[index][key] = (updated[index][key] || []).filter((t) => t !== value);
    } else {
      updated[index][key] = value;
      // ✅ Handle "currently working" logic dynamically
      if (key === "current" && value) {
        updated[index].endDate = "";
      }
    }

    const err = validateDates(updated[index]);
    if (err) console.warn(err); // Handled silently for UX; you can attach this to state to show an error message

    setData(updated);
  };

  const handleAdd = () => {
    const newItem = {};
    section.fields.forEach((f) => {
      if (f.type === "tags") newItem[f.name] = [];
      else if (f.type === "checkbox") newItem[f.name] = false;
      else if (f.type !== "hidden") newItem[f.name] = "";
    });
    setData([...data, newItem]);
  };

  const handleRemove = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500">
          <p className="mb-3 text-sm">No {section.section.toLowerCase()} added yet.</p>
        </div>
      )}

      {data.map((item, i) => (
        <div key={i} className="relative p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-5 group hover:border-slate-300 transition-all">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
              {item.title || item.company || `${section.section.slice(0, -1)} ${i + 1}`}
            </h4>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg transition"
              title="Remove Item"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={item[field.name]}
                itemIndex={i}
                onChange={updateItem}
                currentData={item} // Passthrough for conditional logic
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full border-2 border-dashed border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
      >
        <span>+</span> Add {section.section}
      </button>
    </div>
  );
}