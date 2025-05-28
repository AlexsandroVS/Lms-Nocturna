import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { testData } from "../../data/testData";
import { chartColors } from "../../utils/chartColors";

const ActivityComplianceChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

 
  useEffect(() => {
    setData(testData.activityCompliance);
  }, []);

 return (
    <div className="chart-container">
      <h3 className="chart-title">Cumplimiento por Actividad</h3>
      <p className="chart-subtitle">Comparación de entregas vs pendientes por actividad</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data.slice(0, 10)} 
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.gray.medium} />
          <XAxis 
            dataKey="Title" 
            tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
            axisLine={{ stroke: chartColors.gray.medium }}
            tickLine={{ stroke: chartColors.gray.medium }}
            height={60}
            interval={0}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            tick={{ fill: chartColors.gray.dark, fontSize: 12 }}
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
              color: chartColors.teal.dark,
              marginBottom: '5px'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '13px'
            }}
            iconType="circle"
            iconSize={10}
          />
          <Bar 
            dataKey="Entregas" 
            stackId="a" 
            fill={chartColors.teal.primary}
            name="Entregas"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="Faltantes" 
            stackId="a" 
            fill={chartColors.pink.primary}
            name="Pendientes"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityComplianceChart;
