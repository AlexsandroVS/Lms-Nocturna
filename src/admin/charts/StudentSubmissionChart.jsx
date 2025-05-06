import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from "recharts";
import { useAuth } from "../../context/AuthContext";

const StudentSubmissionChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/entregas-por-estudiante").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm ">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Entregas por Estudiante</h3>
      <p className="text-sm text-gray-500 mb-6">Top 10 estudiantes con mayor cantidad de entregas</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data.slice(0, 10)} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
          <XAxis 
            type="number" 
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
            formatter={(value) => [value, 'Entregas']}
          />
          <Bar 
            dataKey="Entregas" 
            fill="#3D405B" 
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentSubmissionChart;