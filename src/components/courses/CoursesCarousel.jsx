import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CoursesCard from "./CoursesCard";

const CoursesCarousel = ({ courses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);

  // Configuración del carrusel
  const visibleCards = 3;
  const cardWidth = 320;
  const cardGap = 24;
  const animationDuration = 0.5;

  useEffect(() => {
    let interval;
    if (autoPlay && courses.length > visibleCards) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, courses.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => 
      prev >= courses.length - visibleCards ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev <= 0 ? courses.length - visibleCards : prev - 1
    );
  };

  // Calcular el rango de cursos visibles
  const getVisibleCourses = () => {
    let endIndex = currentIndex + visibleCards;
    if (endIndex > courses.length) {
      return [
        ...courses.slice(currentIndex),
        ...courses.slice(0, endIndex - courses.length)
      ];
    }
    return courses.slice(currentIndex, endIndex);
  };

  return (
    <div 
      className="relative w-full overflow-hidden py-8"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Cursos Destacados
        </h2>
        
        <div className="relative">
          {/* Controles de navegación */}
          {courses.length > visibleCards && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Anterior"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Siguiente"
              >
                <FaChevronRight className="text-gray-700" />
              </button>
            </>
          )}

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: -currentIndex * (cardWidth + cardGap),
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="flex-shrink-0"
                  style={{ width: `${cardWidth}px` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    zIndex: index === currentIndex ? 10 : 1
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: animationDuration }}
                >
                  <CoursesCard 
                    course={course} 
                    isFeatured={index === currentIndex}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Indicadores de posición */}
        {courses.length > visibleCards && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(courses.length / visibleCards) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * visibleCards)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex >= i * visibleCards && 
                  currentIndex < (i + 1) * visibleCards
                    ? "bg-indigo-600 w-6"
                    : "bg-gray-300"
                }`}
                aria-label={`Ir al grupo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesCarousel;