import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white text-purple-600 p-4 rounded-full shadow-md">
              <GraduationCap size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Comienza tu viaje de aprendizaje hoy
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
            Únete a nuestra comunidad de estudiantes y accede a cientos de cursos diseñados para impulsar tu futuro profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/courses"
              className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition"
            >
              Explorar cursos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;