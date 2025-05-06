import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useAuth } from "../../context/AuthContext";

const TopPendingActivitiesChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/top-pending-activities")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error al cargar top pendientes:", err));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm  border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Actividades con Más Pendientes</h3>
      <p className="text-sm text-gray-500 mb-6">Top 5 actividades con mayor cantidad de entregas pendientes</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          stackOffset="expand"
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
          <XAxis 
            type="number" 
            allowDecimals={false}
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="Title" 
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={140}
          />
          <Tooltip 
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Bar 
            dataKey="Entregas" 
            stackId="a" 
            fill="#81B29A" 
            name="Entregas"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="Pendientes" 
            stackId="a" 
            fill="#D33F49" 
            name="Pendientes"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopPendingActivitiesChart;