/* eslint-disable react/prop-types */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { chartColors } from "../../utils/chartColors";

const LowCompletionActivitiesChart = ({ data = [] }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Actividades con Baja Participación</h3>
      <p className="chart-subtitle">Actividades con mayor número de entregas pendientes</p>

      <div className="chart-responsive-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
           margin={{ top: 20, right: 20, left: 40, bottom: 30 }}
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
              tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
              axisLine={{ stroke: chartColors.gray.medium }}
              tickLine={{ stroke: chartColors.gray.medium }}
            />
            <YAxis
              type="category"
              dataKey="Actividad"
              tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                borderRadius: "8px",
                border: `1px solid ${chartColors.gray.medium}`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
              formatter={(value, name) => [`${value}`, name === "Entregas" ? "Entregas" : "Pendientes"]}
              labelStyle={{ fontWeight: 600, color: chartColors.purple.dark }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px", fontSize: "13px" }}
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
    </div>
  );
};

export default LowCompletionActivitiesChart;
