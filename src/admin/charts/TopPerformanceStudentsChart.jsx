/* eslint-disable react/prop-types */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { chartColors } from "../../utils/chartColors";

const TopPerformanceStudentsChart = ({ data = [] }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Estudiantes Destacados</h3>
      <p className="chart-subtitle">Estudiantes con mejor rendimiento en el curso</p>

      <div className="chart-responsive-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 40, bottom: 30 }} // <-- reducido
            barSize={24}
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
              tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
              axisLine={{ stroke: chartColors.gray.medium }}
              tickLine={{ stroke: chartColors.gray.medium }}
            />
            <YAxis
              type="category"
              dataKey="Name"
              tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60} // <-- reducido de 120
            />
            <Tooltip
              contentStyle={{
                background: "white",
                borderRadius: "8px",
                border: `1px solid ${chartColors.gray.medium}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [
                `${value}`,
                name === "Promedio" ? "Promedio" : "Entregas",
              ]}
              labelStyle={{ fontWeight: 600, color: chartColors.teal.dark }}
            />
            <Bar dataKey="Promedio" radius={[0, 4, 4, 0]}>
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
    </div>
  );
};

export default TopPerformanceStudentsChart;
