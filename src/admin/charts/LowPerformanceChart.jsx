import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData";
import { chartColors } from "../../utils/chartColors";

const LowPerformanceChart = ({ isMobile }) => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    setData(testData.lowPerformanceStudents);
  }, []);

  const margin = {
    top: 20,
    right: isMobile ? 10 : 20,
    left: isMobile ? 80 : 100,
    bottom: 30
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Estudiantes con Bajo Rendimiento</h3>
      <p className="chart-subtitle">Estudiantes con promedio menor a 11</p>

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
            domain={[0, 20]}
            tick={{ fill: chartColors.gray.dark, fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          >
            <Label
              value="Promedio"
              position="bottom"
              offset={-10}
              fill={chartColors.gray.dark}
              fontSize={12}
            />
          </XAxis>
          <YAxis
            type="category"
            dataKey="Name"
            tick={{
              fill: chartColors.gray.dark,
              fontSize: isMobile ? 10 : 12,
            }}
            width={isMobile ? 80 : 120}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: `1px solid ${chartColors.gray.medium}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value}`, "Promedio"]}
            labelStyle={{
              fontWeight: 600,
              color: chartColors.pink.dark,
              marginBottom: "5px",
            }}
          />
          <Bar dataKey="Promedio" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index % 2 === 0
                    ? chartColors.pink.primary
                    : chartColors.pink.light
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LowPerformanceChart;