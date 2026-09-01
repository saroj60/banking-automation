import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, HelpCircle } from "lucide-react";

export default function ProductCard({ product }) {
  const { name, slug, shortDescription, priceType, images, brand, availability } = product;
  const imageSrc = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="group bg-white rounded-xl border border-slate-100 hover:border-blue-accent/20 overflow-hidden shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        <img
          src={imageSrc}
          alt={name}
          className="object-contain max-h-full max-w-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase tracking-wider">
            {brand}
          </span>
        </div>
        
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase tracking-wider shadow-sm ${
            availability === "In Stock" 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
              : "bg-rose-50 text-rose-700 border border-rose-100"
          }`}>
            {availability}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow text-left">
        <h3 className="font-bold text-dark-navy text-xs sm:text-base leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 sm:mb-2 group-hover:text-primary-navy transition-colors duration-200">
          <Link to={`/products/${slug}`}>{name}</Link>
        </h3>
        
        <p className="text-muted-text text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4 flex-grow">
          {shortDescription}
        </p>
        
        {/* Pricing Area */}
        <div className="mb-2 sm:mb-4 pt-2 sm:pt-3 border-t border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-1">
          <span className="text-slate-400 text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider">Price</span>
          <span className="text-primary-navy font-bold text-[10px] sm:text-sm tracking-tight bg-light-blue px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-center truncate">
            {priceType || "Price on Request"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
          <Link
            to={`/products/${slug}`}
            className="flex items-center justify-center bg-slate-50 hover:bg-light-blue text-dark-navy hover:text-primary-navy text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200 border border-slate-200/60 hover:border-blue-accent/20"
          >
            Details
          </Link>
          
          <Link
            to={`/request-quote?product=${slug}`}
            className="flex items-center justify-center bg-primary-navy hover:bg-blue-accent text-white text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow group"
          >
            <span className="hidden xs:inline mr-1">Get</span> Quote
            <ArrowRight className="ml-0.5 sm:ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
