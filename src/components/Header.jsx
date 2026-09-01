import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X, HelpCircle, ArrowRight } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll handler to add background/shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Solutions", path: "/solutions" },
    { label: "Projects", path: "/projects" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isSticky
            ? "bg-white/95 backdrop-blur shadow-md py-3"
            : "bg-white py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Concept */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            {/* BA Icon Logo */}
            <div className="bg-primary-navy text-white font-black text-sm h-9 w-9 rounded-lg flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
              BA
            </div>
            
            {/* Logo Text and Tagline */}
            <div className="text-left leading-none">
              <span className="font-extrabold text-dark-navy text-base tracking-tight block transition-colors duration-200 group-hover:text-primary-navy">
                BANKING AUTOMATION
              </span>
              <span className="text-[9px] font-bold text-muted-text tracking-widest block uppercase mt-0.5">
                Technology for Next Generation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold tracking-wide uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-primary-navy border-b-2 border-primary-navy pb-0.5"
                      : "text-slate-600 hover:text-primary-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3.5">
            {/* Search Icon Trigger (Desktop & Mobile) */}
            <div className="relative">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-lg w-60 lg:w-72 z-50 transform origin-right animate-in fade-in slide-in-from-right-4 duration-200"
                >
                  <input
                    type="text"
                    placeholder="Search machines, solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow px-2 py-1 text-xs text-slate-800 bg-transparent border-none focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 text-primary-navy hover:bg-slate-50 rounded"
                    aria-label="Submit search"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                    aria-label="Close search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-primary-navy hover:bg-slate-50 rounded-lg transition-colors"
                  aria-label="Open search bar"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* B2B Action Button */}
            <Link
              to="/request-quote"
              className="bg-primary-navy hover:bg-blue-accent text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 tracking-wider uppercase hidden sm:inline-flex items-center"
            >
              Get a Quote
            </Link>

            {/* Mobile Hamburger Menu Icon */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-primary-navy hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sliding mobile drawer menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} activePath={pathname} />
    </>
  );
}
