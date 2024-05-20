import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,

  Tooltip,
  Legend
);
import { Line } from "react-chartjs-2";

const LineChart = ({ registrations }) => {
  const options = {
    scales: {
      y: {
        type: "linear" as const,
        ticks: {
          beginAtZero: true,
          min: 2,
          max: 50,
          stepSize: 1,
        },
      },
    },
  };

  const data = {
    labels: Object.keys(registrations),
    datasets: [
      {
        label: "Number of registrations per day",
        data: Object.values(registrations),
        fill: false,
        backgroundColor: "#b51423",
        borderColor: "#ffc331",
        lineTension: 0.3,
      },
    ],
  };

  return (
    <div className="sm:px-28 sm:py-12">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
