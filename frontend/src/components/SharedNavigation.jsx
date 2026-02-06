import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";

const SharedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Check if current path matches the nav link
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/workspace-overview", label: "Workspace" },
    { path: "/solutions", label: "Solutions" },
    { path: "/pricing", label: "Pricing" },
    { path: "/intelligence-overview", label: "Intelligence" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#3A4E63] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/innovate-books-logo-new.png"
              alt="Innovate Books"
              className="h-12 w-auto brightness-0 invert"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-2xl text-white">
                Innovate Books
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl font-semibold transition-all text-base ${
                  isActive(link.path)
                    ? "bg-white text-[#3A4E63] shadow-lg"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-8 bg-white/20 mx-2"></div>

            {isAuthenticated ? (
              <>
                <Link to="/commerce">
                  <Button
                    size="lg"
                    className="bg-white text-[#3A4E63] hover:bg-white/90 font-bold rounded-xl shadow-lg transition-all duration-300 px-6 py-2.5 flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  size="lg"
                  className="bg-transparent text-white border-2 border-white/40 hover:bg-white/10 font-bold rounded-xl transition-all duration-300 px-6 py-2.5"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button
                    size="lg"
                    className="bg-white text-[#3A4E63] hover:bg-white/90 font-bold rounded-xl shadow-lg transition-all duration-300 px-6 py-2.5 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-transparent text-white border-2 border-white/40 hover:bg-white/10 font-bold rounded-xl transition-all duration-300 px-6 py-2.5 flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavigation;
