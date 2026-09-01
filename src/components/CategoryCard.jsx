import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

export default function CategoryCard({ category }) {
  const { name, slug, icon, description } = category;
  
  // Dynamically resolve icon from lucide-react name
  const IconComponent = Icons[icon] || Icons.Cpu;

  return (
    <Link
      to={`/categories/${slug}`}
      className="group bg-white rounded-xl border border-slate-100 hover:border-blue-accent/20 p-3.5 sm:p-5 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full transform hover:-translate-y-0.5 text-left"
    >
      <div className="bg-light-blue group-hover:bg-blue-accent text-primary-navy group-hover:text-white h-9 w-9 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center mb-2.5 sm:mb-4 transition-all duration-300">
        <IconComponent className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
      </div>
      
      <h3 className="font-bold text-dark-navy group-hover:text-primary-navy text-xs sm:text-base mb-1 sm:mb-1.5 transition-colors duration-200">
        {name}
      </h3>
      
      <p className="text-muted-text text-[11px] sm:text-xs leading-relaxed line-clamp-2">
        {description}
      </p>
    </Link>
  );
}
