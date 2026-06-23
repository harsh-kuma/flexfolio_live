"use client";

import { Line } from "react-chartjs-2";
import { lineChartOptions } from "./chartOptions";

export default function ViewsChart({
  data = [],
  label = "Views",
}) {
  const chartData = {
    labels: data.map((item) => item?._id?.day || "Unknown"),

    datasets: [
      {
        label,
        data: data.map((item) => item?.views || 0),

        borderColor: "#7c3aed",
        backgroundColor: "rgba(124,58,237,.10)",

        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={lineChartOptions}
    />
  );
}