import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

let registered = false;

if (!registered) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    BarElement
  );

  registered = true;
}

//old chart

// export const lineChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,

//   plugins: {
//     legend: {
//       display: false,
//     },
//   },

//   scales: {
//     x: {
//       grid: {
//         display: false,
//       },
//     },

//     y: {
//       grid: {
//         color: "#f3f4f6",
//       },
//     },
//   },
// };

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      callbacks: {
        title(items) {
          const date = new Date(items[0].label);

          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        },
      },
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },

      ticks: {
        maxTicksLimit: 8,

        callback(value) {
          const label = this.getLabelForValue(value);

          const date = new Date(label);

          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        },
      },
    },

    y: {
      beginAtZero: true,

      ticks: {
        precision: 0,
      },

      grid: {
        color: "#f3f4f6",
      },
    },
  },
};

export const horizontalBarOptions = {
  indexAxis: "y",

  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    x: {
      beginAtZero: true,

      ticks: {
        precision: 0,
        stepSize: 1,
      },

      grid: {
        color: "#f3f4f6",
      },
    },

    y: {
      grid: {
        display: false,
      },
    },
  },
};