import { Link } from "react-router-dom";
import { X, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { SETTINGS } from "../config/settings";

export default function MobileMenu({ isOpen, onClose, activePath }) {
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Solutions", path: "/solutions" },
    { label: "Projects", path: "/projects" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-dark-navy/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header inside drawer */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-navy text-white text-xs font-black h-8 w-8 rounded-md flex items-center justify-center shadow-md">
              BA
            </div>
            <div>
              <span className="font-bold text-dark-navy text-sm tracking-tight block">
                Banking Automation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex-grow p-5 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-light-blue text-primary-navy"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-6 border-t border-slate-100 mt-4">
            <Link
              to="/request-quote"
              onClick={onClose}
              className="flex items-center justify-center w-full bg-primary-navy hover:bg-blue-accent text-white font-bold py-3 px-4 rounded-lg shadow transition-colors duration-200"
            >
              Get a Quote
            </Link>
          </div>
        </nav>

        {/* Footer inside drawer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Contact</p>
          <div className="flex items-center text-xs text-slate-600">
            <Phone className="h-3.5 w-3.5 mr-2 text-primary-navy/80" />
            <span>{SETTINGS.contact.phone}</span>
          </div>
          <div className="flex items-center text-xs text-slate-600">
            <Mail className="h-3.5 w-3.5 mr-2 text-primary-navy/80" />
            <span className="truncate">{SETTINGS.contact.email}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 mr-2 text-slate-400" />
            <span>9:30 AM - 5:30 PM (Sun-Fri)</span>
          </div>
        </div>
      </div>
    </>
  );
}
