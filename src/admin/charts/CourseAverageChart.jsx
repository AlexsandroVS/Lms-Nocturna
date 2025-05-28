import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData";
import { chartColors } from "../../utils/chartColors";

const CourseAverageChart = ({ isMobile }) => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    setData(testData.averageByCourse);
  }, []);

  const margin = {
    top: 20,
    right: isMobile ? 10 : 30,
    left: isMobile ? 10 : 20,
    bottom: 30
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Promedio de Notas por Curso</h3>
      <p className="chart-subtitle">Comparación del rendimiento académico entre cursos</p>
      
      <ResponsiveContainer width="100%" height={isMobile ? 500 : 450}>
        <LineChart 
          data={data} 
          margin={margin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gray.medium} />
          <XAxis 
            dataKey="Curso" 
            tick={{ fill: chartColors.gray.dark, fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          />
          <YAxis 
            domain={[0, 20]}
            tick={{ fill: chartColors.gray.dark, fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
          />
          <Tooltip 
            contentStyle={{
              background: 'white',
              borderRadius: '8px',
              border: `1px solid ${chartColors.gray.medium}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
            labelStyle={{
              fontWeight: 600,
              color: chartColors.purple.dark,
              marginBottom: '5px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="PromedioNotas" 
            stroke={chartColors.purple.primary} 
            strokeWidth={3} 
            dot={{ 
              fill: chartColors.purple.dark,
              stroke: chartColors.purple.primary,
              strokeWidth: 2,
              r: 5 
            }}
            activeDot={{
              fill: chartColors.purple.dark,
              stroke: chartColors.purple.light,
              strokeWidth: 2,
              r: 7
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseAverageChart;