import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from "recharts";
import { useAuth } from "../../context/AuthContext";

const ParticipationChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/participacion-por-curso").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm  border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Participación por Curso</h3>
      <p className="text-sm text-gray-500 mb-6">Porcentaje de estudiantes que han participado en cada curso</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="Curso" 
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          >
            <Label 
              value="(%)" 
              position="insideTopLeft" 
              offset={-15} 
              fill="#6B7280"
              fontSize={12}
            />
          </YAxis>
          <Tooltip 
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #eee',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.95)'
            }}
            formatter={(value) => [`${value}%`, 'Participación']}
          />
          <Bar 
            dataKey="ParticipacionPorcentaje" 
            fill="#D33F49" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <animate
                attributeName="height"
                from="0"
                to="100%"
                dur="1s"
                begin={`${index * 0.1}s`}
                fill="freeze"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParticipationChart;