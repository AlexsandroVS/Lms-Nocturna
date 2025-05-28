import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData.js";
import { chartColors } from "../../utils/chartColors.js";

const ParticipationChart = ({ isMobile }) => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    setData(testData.participationByCourse);
  }, []);

  const margin = {
    top: 20,
    right: isMobile ? 10 : 30,
    left: isMobile ? 10 : 20,
    bottom: 30
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Participación por Curso</h3>
      <p className="chart-subtitle">Porcentaje de estudiantes que han participado en cada curso</p>

      <ResponsiveContainer width="100%" height={isMobile ? 500 : 450}>
        <BarChart
          data={data}
          margin={margin}
          barSize={isMobile ? 30 : 40}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={chartColors.gray.medium}
          />
          <XAxis
            dataKey="Curso"
            tick={{ fill: chartColors.gray.dark, fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          />
          <YAxis
            tick={{ fill: chartColors.gray.dark, fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
            domain={[0, 100]}
          >
            <Label
              value="(%)"
              position="insideTopLeft"
              offset={-15}
              fill={chartColors.gray.dark}
              fontSize={12}
            />
          </YAxis>
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: `1px solid ${chartColors.gray.medium}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value}%`, "Participación"]}
            labelStyle={{
              fontWeight: 600,
              color: chartColors.teal.dark,
              marginBottom: "5px",
            }}
          />
          <Bar
            dataKey="ParticipacionPorcentaje"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index % 2 === 0
                    ? chartColors.teal.primary
                    : chartColors.teal.light
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipationChart;