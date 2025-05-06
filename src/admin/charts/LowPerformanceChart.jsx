import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";

const COLORS = ['#D33F49', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];

const LowPerformanceChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/bajo-rendimiento").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm ">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Estudiantes con Bajo Rendimiento</h3>
      <p className="text-sm text-gray-500 mb-6">Top 5 estudiantes con promedio menor a 11</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
          <XAxis 
            type="number" 
            domain={[0, 20]}
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="Name" 
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip 
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}
            formatter={(value) => [value, 'Promedio']}
          />
          <Bar dataKey="Promedio" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                strokeWidth={index === 1 ? 1 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LowPerformanceChart;