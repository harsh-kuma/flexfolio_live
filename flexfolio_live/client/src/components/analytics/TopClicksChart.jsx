"use client";

import { Bar } from "react-chartjs-2";
import { horizontalBarOptions } from "./chartOptions";

export default function TopClicksChart({
  topClicks = [],
}) {
  const chartData = {
    labels: topClicks.map((item) => {
      if (!item?._id) return "Unknown";

      if (item._id.startsWith("project_")) {
        const name = item._id.replace("project_", "");

        return name.length > 20
          ? `${name.slice(0, 20)}...`
          : name;
      }

      return (
        item._id.charAt(0).toUpperCase() +
        item._id.slice(1)
      );
    }),

    datasets: [
      {
        label: "Clicks",

        data: topClicks.map(
          (item) => item?.count || 0
        ),

        backgroundColor: "#7c3aed",
        borderRadius: 8,
        barThickness: 18,
      },
    ],
  };

  const options = {
    ...horizontalBarOptions,

    plugins: {
      ...horizontalBarOptions.plugins,

      tooltip: {
        callbacks: {
          title: (items) => {
            const index = items?.[0]?.dataIndex;

            if (
              index === undefined ||
              !topClicks[index]
            ) {
              return "";
            }

            return topClicks[index]._id.replace(
              "project_code:",
              ""
            );
          },
        },
      },
    },
  };

  return (
    <Bar
      data={chartData}
      options={options}
    />
  );
}