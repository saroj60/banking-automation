import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

export default function ProjectCard({ project }) {
  const { title, slug, location, industry, description, images } = project;
  const imageSrc = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Project Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
        <img
          src={imageSrc}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Industry Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-primary-navy/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase">
            {industry}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Location Info */}
        <div className="flex items-center text-muted-text text-[11px] font-semibold uppercase tracking-wider mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-blue-accent/80" />
          {location}, Nepal
        </div>

        <h3 className="font-bold text-dark-navy text-base leading-snug mb-2 group-hover:text-primary-navy transition-colors duration-200">
          <Link to={`/projects/${slug}`}>{title}</Link>
        </h3>

        <p className="text-muted-text text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
          {description}
        </p>

        {/* View project action */}
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <Link
            to={`/projects/${slug}`}
            className="inline-flex items-center text-primary-navy hover:text-blue-accent text-xs font-bold transition-all duration-200 group/btn"
          >
            View Project
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
