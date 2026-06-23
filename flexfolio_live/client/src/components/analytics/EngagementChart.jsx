"use client";

import { Doughnut } from "react-chartjs-2";
import { doughnutChartOptions } from "./chartOptions";

export default function EngagementChart({
  engagement = {},
}) {
  const chartData = {
    labels: [
      "Average Visit",
      "Longest Visit",
      "Total Visit",
    ],

    datasets: [
      {
        data: [
          engagement?.averageVisitTime || 0,
          engagement?.longestVisit || 0,
          engagement?.totalVisitTime || 0,
        ],

        backgroundColor: [
          "rgba(124,58,237,.85)",
          "rgba(59,130,246,.85)",
          "rgba(16,185,129,.85)",
        ],

        borderWidth: 0,
      },
    ],
  };

  return (
    <Doughnut
      data={chartData}
      options={doughnutChartOptions}
    />
  );
}