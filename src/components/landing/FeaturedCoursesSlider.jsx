import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import CourseCard from "./CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const FeaturedCoursesSlider = ({ courses }) => {
  const sliderRef = useRef(null);
  const [sliderInstanceRef, slider] = useKeenSlider({
    loop: false,
    slides: {
      perView: 1.1,
      spacing: 24,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.2, spacing: 28 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.2, spacing: 32 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4.2, spacing: 36 },
      },
    },
  });

  return (
    <section className="py-16 relative">
      <div className="max-w-[1440px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Cursos populares
        </h2>

        {/* Botones prev / next */}
        <button
          onClick={() => slider.current?.prev()}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-white border shadow p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => slider.current?.next()}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-white border shadow p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slider */}
        <div ref={(el) => {
          sliderRef.current = el;
          sliderInstanceRef(el);
        }} className="keen-slider">
          {courses.map((course) => (
            <div key={course.courseID} className="keen-slider__slide">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSlider;
