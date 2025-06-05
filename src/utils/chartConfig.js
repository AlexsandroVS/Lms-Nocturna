// utils/chartConfig.js
import { Chart, registerables } from "chart.js";
import {
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
} from "chart.js";

Chart.register(
  ...registerables,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend
);

export default Chart;
