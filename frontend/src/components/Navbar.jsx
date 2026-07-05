import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Menu } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 font-bold text-2xl"
        >
          <CalendarDays size={32} />
          EventPilot
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>

          <a href="#about" className="hover:text-blue-600 transition">
            About
          </a>

          <Link
            to="/login"
            className="hover:text-blue-600 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4">
          <a href="#features" className="block">
            Features
          </a>

          <a href="#about" className="block">
            About
          </a>

          <Link to="/login" className="block">
            Login
          </Link>

          <Link to="/register" className="block text-blue-600 font-semibold">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;