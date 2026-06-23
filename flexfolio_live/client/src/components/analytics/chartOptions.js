import {
  ArcElement,
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
    ArcElement,
    Tooltip,
    Legend,
    BarElement
  );

  registered = true;
}

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },

    y: {
      grid: {
        color: "#f3f4f6",
      },
    },
  },
};

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "bottom",
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