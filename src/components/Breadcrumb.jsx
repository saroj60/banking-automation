import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-text py-4 overflow-x-auto whitespace-nowrap scrollbar-thin">
      <Link
        to="/"
        className="flex items-center text-muted-text hover:text-primary-navy transition-colors duration-200"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 flex-shrink-0 text-muted-text/60" />
            {isLast ? (
              <span className="font-medium text-dark-navy truncate max-w-[200px] md:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-primary-navy transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
