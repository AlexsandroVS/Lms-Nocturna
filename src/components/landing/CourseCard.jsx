import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const CourseCard = ({ course }) => {
  const placeholderImage = "https://source.unsplash.com/480x270/?learning,technology";
  const rating = course.rating || 4.5;
  const ratingCount = course.reviews || Math.floor(Math.random() * 300 + 50);
  const price = course.price || "Gratis";

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Imagen */}
      <img
        src={placeholderImage}
        alt="course visual"
        className="w-full h-44 object-cover"
      />

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 leading-tight line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
          Por Instructor destacado
        </p>

        {/* Rating y precio */}
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="text-yellow-500 flex items-center gap-0.5">
            <Star size={14} fill="#facc15" stroke="none" />
            {rating.toFixed(1)}
          </span>
          <span className="text-gray-500">({ratingCount})</span>
        </div>

        <p className="text-md font-bold text-gray-900 mt-2">{price} S/</p>

        {/* Etiqueta */}
        <span className="inline-block mt-3 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded">
          Lo más vendido
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
