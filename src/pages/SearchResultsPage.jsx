import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../components/courses/CoursesCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {api} = useAuth();
  const [results, setResults] = useState([]);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching results for query:", query); // Agrega este log
        
        const exactResults = await api.get(`/courses?search=${encodeURIComponent(query)}`);
        console.log("Exact results:", exactResults.data); // Agrega este log
        
        setResults(exactResults.data);
        
        if (exactResults.data.length === 0) {
          // Si no hay resultados exactos, buscar términos más generales
          const similar = await api.get(`/courses?search=${encodeURIComponent(query.split(' ')[0])}`);
          console.log("Similar courses:", similar.data); // Agrega este log
          setSimilarCourses(similar.data);
        } else {
          setSimilarCourses([]);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Error al cargar los resultados de búsqueda");
      } finally {
        setLoading(false);
      }
    };

    if (query && query.trim()) {
      fetchResults();
    } else {
      navigate("/courses");
    }
  }, [query, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            Resultados de búsqueda para: "{query}"
          </h1>
          
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Buscar otro curso..."
              className="w-full py-3 px-5 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue={query}
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/search-results?query=${encodeURIComponent(e.target.value)}`);
                }
              }}
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute right-5 top-3.5 text-gray-400"
            />
          </div>
        </div>

        {/* Resultados exactos */}
        {results.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cursos encontrados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-gray-600">No se encontraron cursos exactos para "{query}"</p>
          </div>
        )}

        {/* Cursos similares */}
        {similarCourses.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cursos que podrían interesarte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
