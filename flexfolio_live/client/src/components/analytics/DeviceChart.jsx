"use client";

const DEVICE_CONFIG = {
  desktop: { color: "#3b82f6", label: "Desktop" },
  mobile: { color: "#10b981", label: "Mobile" },
  tablet: { color: "#8b5cf6", label: "Tablet" },
  smarttv: { color: "#f59e0b", label: "Smart TV" },
  console: { color: "#ec4899", label: "Console" },
  wearable: { color: "#06b6d4", label: "Wearable" },
  embedded: { color: "#64748b", label: "Embedded" },
};

const getDeviceIcon = (type, color) => {
  const normType = type.toLowerCase();
  
  switch (normType) {
    case "desktop":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "mobile":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case "tablet":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(90 12 12)" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case "smarttv":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="13" rx="2" ry="2" />
          <polyline points="7 20 12 17 17 20" />
        </svg>
      );
    case "console":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" />
          <rect x="2" y="6" width="20" height="12" rx="3" />
        </svg>
      );
    case "wearable":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="12" height="12" rx="3" />
          <path d="M9 6V2h6v4M9 18v4h6v4" />
        </svg>
      );
    case "embedded":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

export default function DeviceChart({ data = [] }) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const totalCount = sortedData.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      {/* 1. Inject custom scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb; /* Light grey */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db; /* Slightly darker grey on hover */
        }
      `}</style>

      {/* 2. Add the className to the wrapper div */}
      <div 
        className="custom-scrollbar"
        style={{
          width: "100%",
          maxHeight: "260px",
          overflowY: "auto",
          paddingRight: "8px", // Added a bit more padding so the scrollbar doesn't hug the content too tightly
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {sortedData.map((item) => {
            const typeKey = item._id ? item._id.toLowerCase() : "unknown";
            const config = DEVICE_CONFIG[typeKey] || { color: "#94a3b8", label: item._id || "Unknown" };
            const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;

            return (
              <div key={item._id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      backgroundColor: `${config.color}15`
                    }}>
                      {getDeviceIcon(typeKey, config.color)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                      {config.label}
                    </span>
                  </div>
                  
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>
                    {item.count.toLocaleString()}
                  </span>
                </div>

                <div style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: config.color,
                    borderRadius: "9999px",
                    transition: "width 0.8s ease-out"
                  }} />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}