import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-10">
      {/* Quote Symbol decoration */}
      <div className="absolute top-0 left-0 text-slate-100 dark:text-slate-50 -mt-6 -ml-2 select-none z-0">
        <Quote className="h-24 w-24 opacity-40 text-light-blue" />
      </div>

      {/* Slider content wrapper */}
      <div className="relative z-10 min-h-[220px] md:min-h-[180px] flex items-center justify-center">
        {testimonials.map((testimonial, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={testimonial.id}
              className={`transition-all duration-500 absolute w-full text-center flex flex-col items-center ${
                isActive 
                  ? "opacity-100 translate-x-0 scale-100 relative pointer-events-auto" 
                  : "opacity-0 translate-x-4 scale-95 absolute pointer-events-none"
              }`}
            >
              <p className="text-dark-navy text-base md:text-lg italic leading-relaxed mb-6 font-medium max-w-2xl">
                "{testimonial.message}"
              </p>
              
              {/* Client Profile */}
              <div className="flex items-center space-x-3 text-left">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-dark-navy text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-text">
                    {testimonial.position}, <span className="font-semibold text-primary-navy">{testimonial.organization}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-slate-100 text-dark-navy hover:text-primary-navy hover:bg-light-blue p-2 rounded-full shadow-soft hover:shadow-premium transition-all duration-200 hidden md:block"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-slate-100 text-dark-navy hover:text-primary-navy hover:bg-light-blue p-2 rounded-full shadow-soft hover:shadow-premium transition-all duration-200 hidden md:block"
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? "w-6 bg-primary-navy" 
                : "w-2.5 bg-slate-200 hover:bg-slate-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
