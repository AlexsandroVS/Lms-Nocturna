import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer, faChartBar, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const benefits = [
  {
    title: "Formación práctica",
    description:
      "Desarrolla eficazmente tus habilidades con ejercicios de codificación basados en IA, exámenes de prueba, cuestionarios y espacios de trabajo.",
    icon: faHammer,
    highlight: true,
  },
  {
    title: "Preparación para certificaciones",
    description:
      "Prepárate para obtener certificaciones reconocidas en el sector resolviendo desafíos reales y consigue insignias durante el proceso.",
    icon: faGraduationCap,
    link: {
      label: "Explora cursos",
      to: "/courses",
    },
  },
  {
    title: "Datos y análisis",
    description:
      "Acelera la consecución de objetivos con datos avanzados y un equipo dedicado de éxito del cliente para fomentar un aprendizaje eficaz.",
    icon: faChartBar,
    badge: "Plan Enterprise",
    link: {
      label: "Obtener más información",
      to: "/about",
    },
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row items-start gap-16">
        {/* Columna de beneficios */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Aprendizaje orientado a tus objetivos
          </h2>
          <div className="space-y-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-start gap-6 p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition ${
                  b.highlight ? "border-purple-600" : "border-gray-200"
                }`}
              >
                <div className="text-purple-700 text-3xl min-w-[2.5rem]">
                  <FontAwesomeIcon icon={b.icon} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{b.description}</p>
                  {b.badge && (
                    <span className="inline-block text-xs text-white bg-purple-600 px-2 py-0.5 rounded-full mr-2">
                      {b.badge}
                    </span>
                  )}
                  {b.link && (
                    <Link
                      to={b.link.to}
                      className="text-sm text-purple-700 font-medium hover:underline"
                    >
                      {b.link.label} →
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Imagen ilustrativa */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block md:w-1/2"
        >
          <img
            src="/img/banner5.jpg"
            alt="Ejemplo de curso"
            className="w-full rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;