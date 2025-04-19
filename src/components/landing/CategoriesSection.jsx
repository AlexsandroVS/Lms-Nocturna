import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { name: "Programación", icon: "💻", count: 28 },
  { name: "Diseño UX/UI", icon: "🎨", count: 15 },
  { name: "Marketing Digital", icon: "📈", count: 22 },
  { name: "Negocios", icon: "💼", count: 18 },
  { name: "Data Science", icon: "📊", count: 12 },
  { name: "Idiomas", icon: "🌎", count: 9 },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorías populares</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestros cursos por categoría
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link
                to="/courses"
                className="block bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-3 block">{category.icon}</span>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} cursos</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;