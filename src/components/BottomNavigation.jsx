import { Link, useLocation } from "react-router-dom";
import { Home, Banknote, Lightbulb, Briefcase, Phone } from "lucide-react";

export default function BottomNavigation() {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Products", path: "/products", icon: Banknote },
    { label: "Solutions", path: "/solutions", icon: Lightbulb },
    { label: "Projects", path: "/projects", icon: Briefcase },
    { label: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 shadow-[0_-4px_16px_rgba(7,26,61,0.06)] md:hidden safe-bottom">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-200 ${
                isActive 
                  ? "text-primary-navy" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className={`text-[10px] font-bold tracking-wide uppercase ${
                isActive ? "text-primary-navy font-extrabold" : "text-slate-500"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
