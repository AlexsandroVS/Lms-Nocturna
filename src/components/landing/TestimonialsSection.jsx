import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Este LMS ha transformado completamente la forma en que enseñamos y aprendemos. Su plataforma intuitiva permite que nuestros estudiantes avancen a su propio ritmo, lo que ha mejorado notablemente los resultados académicos.",
    name: "Carla Ríos",
    role: "Docente de Tecnología Educativa",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    linkLabel: "Ver cursos recomendados",
    link: "/courses",
  },
  {
    quote:
      "Gracias al LMS pude capacitarme desde casa y acceder a contenidos actualizados por expertos. ¡Una experiencia totalmente recomendable!",
    name: "Luis Mendoza",
    role: "Estudiante de Ingeniería de Sistemas",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    linkLabel: "Explorar especialidades",
    link: "/courses",
  },
  {
    quote:
      "Como coordinador académico, valoro la facilidad de seguimiento del progreso de los estudiantes. Este LMS nos permite tomar decisiones con base en datos reales.",
    name: "Verónica Salazar",
    role: "Coordinadora Académica",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    linkLabel: "Conoce nuestras herramientas",
    link: "/about",
  },
  {
    quote:
      "Lo mejor de esta plataforma es la variedad de cursos disponibles. Siempre encuentro algo nuevo para seguir aprendiendo y mejorando mis habilidades.",
    name: "Daniel Castro",
    role: "Desarrollador Frontend Junior",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    linkLabel: "Ver catálogo completo",
    link: "/courses",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-24 border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-16">
          Lo que dicen nuestros usuarios
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md text-left flex flex-col justify-between h-full"
            >
              <div>
                <p className="text-sm text-gray-700 mb-4 relative before:content-['“'] before:text-4xl before:text-purple-500 before:mr-2">
                  {t.quote}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <a
                href={t.link}
                className="text-sm text-purple-700 font-medium mt-4 inline-block hover:underline"
              >
                {t.linkLabel} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;