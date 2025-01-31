import Header from "../components/layout/Header";
import AcademicProgress from "../components/dashboard/AcademicProgress";
import ContinueCourse from "../components/dashboard/ContinueCourse";
import CriticalDeadlines from "../components/dashboard/CriticalDeadlines";
import FeaturedResource from "../components/dashboard/FeaturedResource";
import { motion } from "framer-motion";

export default function Dashboard() {
  function WelcomeCard() {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-[#d62828]"
      >
        <h1 className="text-3xl font-bold mb-2 text-[#003049]">
          ¡Buenas noches, Darkness!
        </h1>
        <p className="text-gray-600 text-xl">
          ¡Bienvenido a nuestra plataforma de aprendizaje! Nos alegra mucho
          tenerte aquí y esperamos que disfrutes esta experiencia!
        </p>
      </motion.div>
    );
  }
  return (
    <div className="flex-1 p-8 ">
      <Header />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WelcomeCard />
          <AcademicProgress
            courses={[
              { name: "Energias Renovables", progress: 75, color: "#48CAE4" },
              { name: "Robótica Básica", progress: 65, color: "#8AC926" },
              { name: "Programación de PLC", progress: 25, color: "#FFBA08" },
              {
                name: "Mantenimiento Industrial",
                progress: 95,
                color: "#d00000",
              },
            ]}
          />
        </div>

        <ContinueCourse />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CriticalDeadlines />
          <FeaturedResource />
        </div>
      </div>
    </div>
  );
}
