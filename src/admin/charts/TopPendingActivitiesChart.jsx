import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData";
import { chartColors } from "../../utils/chartColors";

const TopPendingActivitiesChart = ({ isMobile }) => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    setData(testData.topPendingActivities);
  }, []);

  const margin = {
    top: 20,
    right: isMobile ? 10 : 20,
    left: isMobile ? 100 : 150,
    bottom: 30
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Actividades con Más Pendientes</h3>
      <p className="chart-subtitle">Top 5 actividades con mayor cantidad de entregas pendientes</p>

      <ResponsiveContainer width="100%" height={isMobile ? 500 : 450}>
        <BarChart
          data={data}
          layout="vertical"
          margin={margin}
          barSize={isMobile ? 20 : 28}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke={chartColors.gray.medium}
          />
          <XAxis
            type="number"
            tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          />
          <YAxis
            type="category"
            dataKey="Title"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: chartColors.gray.dark,
              fontSize: isMobile ? 10 : 12,
            }}
            width={isMobile ? 100 : 140}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: `1px solid ${chartColors.gray.medium}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            labelStyle={{
              fontWeight: 600,
              color: chartColors.teal.dark,
              marginBottom: "5px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "13px",
            }}
            iconType="circle"
            iconSize={10}
          />
          <Bar
            dataKey="Entregas"
            stackId="a"
            fill={chartColors.teal.primary}
            name="Entregas"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Pendientes"
            stackId="a"
            fill={chartColors.pink.primary}
            name="Pendientes"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPendingActivitiesChart;