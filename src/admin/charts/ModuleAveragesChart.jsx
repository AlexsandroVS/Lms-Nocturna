/* eslint-disable react/prop-types */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from "recharts";
import { chartColors } from "../../utils/chartColors";

const ModuleAveragesChart = ({ data = [] }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Promedio por Módulo</h3>
      <p className="chart-subtitle">Rendimiento académico por módulo del curso</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.gray.medium} />
          <XAxis 
            dataKey="Modulo" 
            tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          />
          <YAxis 
            tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
            domain={[0, 20]}
          >
            <Label 
              value="Promedio" 
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
            formatter={(value) => [`${value}`, "Promedio"]}
            labelStyle={{ fontWeight: 600, color: chartColors.teal.dark }}
          />
          <Bar 
            dataKey="PromedioNotas" 
            fill={chartColors.teal.primary}
            radius={[4, 4, 0, 0]}
            name="Promedio"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModuleAveragesChart;