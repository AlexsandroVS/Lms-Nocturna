import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <nav className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-purple-700 text-2xl font-bold">
          LMS
        </Link>

        {/* Searchbar */}
        <div className="hidden lg:flex flex-1 mx-8">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
          </div>
        </div>

        {/* Right links */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link to="/courses" className="text-gray-700 hover:text-purple-700">Cursos</Link>
          <Link to="/categories" className="text-gray-700 hover:text-purple-700">Categorías</Link>
          <Link to="/login" className="text-gray-700 hover:text-purple-700">Iniciar sesión</Link>
          <Link to="/register" className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-800 transition">Registrarse</Link>
          <Link to="/cart">
            <ShoppingCart className="text-gray-600 hover:text-purple-700" size={20} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="text-gray-700" /> : <Menu className="text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden px-6 pb-6 space-y-2">
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <Link to="/courses" className="block text-gray-700 hover:text-purple-700">Cursos</Link>
          <Link to="/categories" className="block text-gray-700 hover:text-purple-700">Categorías</Link>
          <Link to="/login" className="block text-gray-700 hover:text-purple-700">Iniciar sesión</Link>
          <Link to="/register" className="block text-white bg-purple-700 px-4 py-2 text-center rounded hover:bg-purple-800">Registrarse</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;