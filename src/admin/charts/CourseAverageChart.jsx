import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../../context/AuthContext";

const CourseAverageChart = () => {
  const [data, setData] = useState([]);
  const { api } = useAuth();

  useEffect(() => {
    api.get("/stats/promedio-por-curso").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Promedio de notas por curso</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Curso" />
          <YAxis domain={[0, 20]} />
          <Tooltip />
          <Line type="monotone" dataKey="PromedioNotas" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseAverageChart;
