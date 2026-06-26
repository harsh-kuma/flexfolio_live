"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 1. Custom Tick to render the Flag SVG
const CustomXAxisTick = ({ x, y, payload }) => {
  // Convert standard country codes (like 'IN') to lowercase for the flag API
  const countryCode = payload.value ? payload.value.toLowerCase() : "";
  const flagUrl = `https://flagcdn.com/w20/${countryCode}.png`;

  return (
    <g transform={`translate(${x},${y})`}>
      {/* Renders the flag image */}
      <image href={flagUrl} x={-10} y={8} width="20" height="15" />
      {/* Renders the country code text below the flag */}
      <text x={0} y={38} textAnchor="middle" fill="#6b7280" fontSize={12} fontFamily="system-ui, sans-serif">
        {payload.value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const countryCode = label ? label.toLowerCase() : "";
    return (
      <div style={{
        backgroundColor: "#ffffff", padding: "12px 16px", border: "1px solid #f3f4f6",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", borderRadius: "8px", display: "flex", gap: "10px", alignItems: "center", fontFamily: "system-ui, sans-serif"
      }}>
        <img src={`https://flagcdn.com/w20/${countryCode}.png`} alt={label} width="20" />
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: "#374151", fontSize: "14px" }}>{label}</p>
          <p style={{ margin: 0, marginTop: "2px", color: "#6366f1", fontWeight: 500, fontSize: "14px" }}>Count: {payload[0].value}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function CountryChart({ data = [] }) {
  const chartData = data.map((item) => ({
    country: item._id,
    count: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        
        {/* 2. Apply the Custom Tick here */}
        <XAxis 
          dataKey="country" 
          axisLine={false} 
          tickLine={false} 
          tick={<CustomXAxisTick />} 
        />
        
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} animationDuration={1000} />
      </BarChart>
    </ResponsiveContainer>
  );
}