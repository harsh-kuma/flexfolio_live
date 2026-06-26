"use client";

// 1. Helper function to turn raw seconds into a readable format (e.g., "5m 20s")
const formatSeconds = (totalSeconds) => {
  if (!totalSeconds) return "0s";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// 2. Simple SVG Icons for visual polish
const ClockIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrendingUpIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const ActivityIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);


export default function EngagementChart({ engagement = {} }) {
  // Extract data safely, defaulting to 0
  const avg = engagement?.averageVisitTime || 0;
  const longest = engagement?.longestVisit || 0;
  const total = engagement?.totalVisitTime || 0;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>

      {/* Average Visit Card */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px", backgroundColor: "#fbfbfe", border: "1px solid #f3f4f6", borderRadius: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(124,58,237,0.15)", marginRight: "16px" }}>
          <ClockIcon color="#7c3aed" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Average Visit</p>
          <p style={{ margin: 0, fontSize: "20px", color: "#111827", fontWeight: 600 }}>{formatSeconds(avg)}</p>
        </div>
      </div>

      {/* Longest Visit Card */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px", backgroundColor: "#f4f9ff", border: "1px solid #f3f4f6", borderRadius: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(59,130,246,0.15)", marginRight: "16px" }}>
          <TrendingUpIcon color="#3b82f6" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Longest Visit</p>
          <p style={{ margin: 0, fontSize: "20px", color: "#111827", fontWeight: 600 }}>{formatSeconds(longest)}</p>
        </div>
      </div>

      {/* Total Visit Card */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px", backgroundColor: "#f2fcf7", border: "1px solid #f3f4f6", borderRadius: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(16,185,129,0.15)", marginRight: "16px" }}>
          <ActivityIcon color="#10b981" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Total Visit Time</p>
          <p style={{ margin: 0, fontSize: "20px", color: "#111827", fontWeight: 600 }}>{formatSeconds(total)}</p>
        </div>
      </div>

    </div>
  );
}