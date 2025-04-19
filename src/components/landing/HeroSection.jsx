import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const slides = [
  {
    title: "Un aprendizaje interesante",
    subtitle: "Habilidades para tu presente (y tu futuro). Da tus primeros pasos con nosotros.",
    image: "/img/banner3.jpg"
  },
  {
    title: "Aprende a tu ritmo",
    subtitle: "Cursos flexibles y dinámicos para avanzar a tu propio paso.",
    image: "/img/banner4.jpg"
  },
  {
    title: "Impulsa tu carrera",
    subtitle: "Domina nuevas habilidades con expertos de la industria.",
    image: "/img/banner5.jpg"
  },
];

const HeroSection = () => {
  const [sliderRef] = useKeenSlider({ loop: true });

  return (
    <section className="bg-white border-b border-gray-200">
      <div ref={sliderRef} className="keen-slider max-w-screen-2xl mx-auto">
        {slides.map((slide, i) => (
          <div key={i} className="keen-slider__slide">
            <div className="grid md:grid-cols-2 gap-8 items-center px-6 py-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center md:text-left"
              >
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {slide.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden md:block"
              >
                <img
                  src={slide.image}
                  alt="Hero visual"
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
