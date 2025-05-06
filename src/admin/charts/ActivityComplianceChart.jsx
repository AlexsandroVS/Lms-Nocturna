import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../../context/AuthContext";

const ActivityComplianceChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/cumplimiento-por-actividad").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Cumplimiento por actividad</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.slice(0, 10)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Entregas" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Faltantes" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityComplianceChart;
