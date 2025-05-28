import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { chartColors } from "../../utils/chartColors";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData.js";

const StudentSubmissionChart = ({ isMobile }) => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    setData(testData.submissionsByStudent);
  }, []);

  const margin = {
    top: 20,
    right: isMobile ? 10 : 20,
    left: isMobile ? 80 : 100,
    bottom: 30
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Entregas por Estudiante</h3>
      <p className="chart-subtitle">Top 10 estudiantes con mayor cantidad de entregas</p>

      <ResponsiveContainer width="100%" height={isMobile ? 500 : 450}>
        <BarChart
          data={data.slice(0, 10)}
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
            tick={{
              fill: chartColors.gray.dark,
              fontSize: isMobile ? 10 : 12,
            }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          >
            <Label
              value="N° de Entregas"
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
            axisLine={false}
            tickLine={false}
            width={isMobile ? 80 : 120}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: `1px solid ${chartColors.gray.medium}`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value}`, "Entregas"]}
            labelStyle={{
              fontWeight: 600,
              color: chartColors.purple.dark,
              marginBottom: "5px",
            }}
          />
          <Bar
            dataKey="Entregas"
            radius={[0, 4, 4, 0]}
            animationDuration={1200}
          >
            {data.slice(0, 10).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index % 2 === 0
                    ? chartColors.purple.primary
                    : chartColors.purple.light
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentSubmissionChart;