import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Headphones, Layers, Zap } from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import ProjectCard from "../components/ProjectCard";
import TestimonialSlider from "../components/TestimonialSlider";
import CTASection from "../components/CTASection";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);

  useEffect(() => {
    api.getProducts().then((allProducts) => {
      setFeaturedProducts(allProducts.filter((p) => p.featured).slice(0, 6));
    });
    api.getCategories().then((allCats) => {
      setMainCategories(allCats.slice(0, 8));
    });
    api.getProjects().then((allProjs) => {
      setFeaturedProjects(allProjs.filter((p) => p.featured).slice(0, 4));
    });
  }, []);

  // Scroll references for mobile carousels
  const productScrollRef = useRef(null);
  const projectScrollRef = useRef(null);

  // States to track active indicator for mobile carousels
  const [productActiveIndicator, setProductActiveIndicator] = useState(0);
  const [projectActiveIndicator, setProjectActiveIndicator] = useState(0);

  const handleScroll = (ref, setIndicator) => {
    if (ref.current) {
      const scrollPosition = ref.current.scrollLeft;
      const cardWidth = ref.current.offsetWidth * 0.8; // Approximate card width ratio
      const activeIndex = Math.round(scrollPosition / cardWidth);
      setIndicator(activeIndex);
    }
  };

  const trustItems = [
    {
      title: "Quality Products",
      desc: "High quality & trusted brands",
      icon: ShieldCheck,
      color: "text-blue-accent bg-blue-50"
    },
    {
      title: "Professional Support",
      desc: "Expert support when you need it",
      icon: Headphones,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "Reliable Solutions",
      desc: "Solutions designed for performance",
      icon: Layers,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Fast Service",
      desc: "Quick response & on-time delivery",
      icon: Zap,
      color: "text-rose-600 bg-rose-50"
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-16">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-light-blue/20 pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-light-blue to-blue-50 border border-blue-200/60 px-3 py-1.5 rounded-full shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-navy"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-black text-primary-navy tracking-wider uppercase">
                #1 Banking Tech in Nepal
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black text-dark-navy tracking-tight leading-[1.15] sm:leading-[1.1]">
              Smart Banking & <br className="hidden xs:inline" />
              <span className="text-primary-navy bg-gradient-to-r from-primary-navy to-blue-accent bg-clip-text text-transparent">
                Automation Solutions
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-lg">
              Certified cash handling machinery, queue management systems, and electronic automation hardware tailored for commercial banks, cooperatives, and financial institutions in Nepal.
            </p>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <Link
                to="/products"
                className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-4 sm:px-7 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider text-center flex items-center justify-center group"
              >
                <span>Explore</span>
                <ArrowRight className="ml-1 sm:ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/request-quote"
                className="bg-white border border-slate-200 hover:border-blue-accent/30 text-dark-navy hover:text-primary-navy font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-4 sm:px-7 rounded-xl shadow-sm hover:shadow transition-all duration-200 uppercase tracking-wider text-center flex items-center justify-center"
              >
                Get a Quote
              </Link>
            </div>

            {/* Quick Micro-Trust Chips */}
            <div className="grid grid-cols-3 gap-2 pt-3 sm:pt-4 border-t border-slate-200/60 max-w-lg">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-slate-700">100% Genuine</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-slate-700">NRB Certified</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-slate-700">Nepal Support</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0 pb-4 sm:pb-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-navy/10 via-blue-accent/10 to-transparent rounded-3xl blur-2xl transform scale-95"></div>
            
            <div className="relative bg-white/90 backdrop-blur-xs border border-slate-200/70 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-soft hover:shadow-premium transition-all duration-300">
              <img
                src="/images/hero-composite.png"
                alt="Banking Automation Product Collage featuring Suzuco cash counter, queue system, and fake note detector"
                className="w-full h-auto object-contain transform transition-transform duration-300 hover:scale-[1.01]"
              />

              {/* Floating Mobile Feature Tags */}
              <div className="mt-3 sm:mt-4 bg-dark-navy text-white text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between sm:justify-start sm:space-x-3 border border-white/10">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Ready For Branch Deployment
                </span>
                <span className="text-slate-400 hidden xs:inline">•</span>
                <span className="text-slate-300 text-[9px] sm:text-xs font-medium">500+ Machines Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / BENEFITS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-100 p-3 sm:p-5 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left transform hover:-translate-y-0.5"
              >
                <div className={`p-2 sm:p-3 rounded-lg mb-2 sm:mb-3.5 inline-flex ${item.color}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="font-bold text-dark-navy text-xs sm:text-sm mb-0.5 sm:mb-1">{item.title}</h3>
                <p className="text-muted-text text-[10px] sm:text-xs leading-snug">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="text-left">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">Top Cash Handling Machinery</span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mt-1">FEATURED PRODUCTS</h2>
          </div>
          <Link
            to="/products"
            className="text-primary-navy hover:text-blue-accent text-xs sm:text-sm font-bold flex items-center transition-colors duration-200"
          >
            View All <ArrowRight className="ml-1 sm:ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {/* 2x2 Grid on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES */}
      <section className="bg-light-section py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">Browse by Categories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mt-1">PRODUCT CATEGORIES</h2>
            <div className="h-1.5 w-14 bg-primary-navy mx-auto mt-4 rounded-full"></div>
          </div>

          {/* 2-column grid on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {mainCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Checklist content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">Unrivaled Expertise</span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy">WHY CHOOSE BANKING AUTOMATION?</h2>
            
            <div className="space-y-4 pt-2">
              {[
                { title: "Wide range of high quality products", text: "Directly imported certified cash counting machinery and custom LED components." },
                { title: "Competitive pricing and best value", text: "Strategic distribution network offering Nepalese institutions the absolute best B2B value." },
                { title: "Expert installation and training", text: "Comprehensive on-site commissioning and cashier instruction by veteran technical engineers." },
                { title: "Reliable after-sales support", text: "Dedicated maintenance service level agreements and genuine spare parts catalog." },
                { title: "Pan Nepal service network", text: "Active maintenance support extending across major hubs from Mechi to Mahakali." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3.5">
                  <CheckCircle2 className="h-5.5 w-5.5 text-primary-navy flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-dark-navy text-sm leading-snug">{item.title}</h4>
                    <p className="text-muted-text text-xs mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual section */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-blue-accent/5 rounded-2xl blur-xl transform -rotate-2"></div>
            <div className="relative border border-slate-100 rounded-2xl overflow-hidden shadow-soft aspect-[4/3] bg-slate-50">
              <img
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop"
                alt="Representative banking branch service counter"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR PROJECTS / APPLICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">Proven Case Studies</span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mt-1">OUR PROJECTS / APPLICATIONS</h2>
          </div>
          <Link
            to="/projects"
            className="text-primary-navy hover:text-blue-accent text-sm font-bold flex items-center transition-colors duration-200"
          >
            View All Projects <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        {/* Desktop grid & Mobile Snap Scroll Carousel */}
        <div className="relative">
          {/* Mobile Snap Scroll */}
          <div
            ref={projectScrollRef}
            onScroll={() => handleScroll(projectScrollRef, setProjectActiveIndicator)}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory scroll-smooth pb-4"
          >
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="min-w-[280px] w-[80vw] sm:w-[50vw] md:w-auto snap-center flex-shrink-0"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* Carousel Indicators for Mobile */}
          <div className="flex justify-center space-x-1.5 mt-4 md:hidden">
            {featuredProjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (projectScrollRef.current) {
                    const cardWidth = projectScrollRef.current.offsetWidth * 0.8;
                    projectScrollRef.current.scrollLeft = idx * cardWidth;
                    setProjectActiveIndicator(idx);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === projectActiveIndicator 
                    ? "w-5 bg-primary-navy" 
                    : "w-2 bg-slate-200"
                }`}
                aria-label={`Featured project slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="bg-light-section py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">Customer Experience</span>
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy mt-1">WHAT OUR CLIENTS SAY</h2>
            <div className="h-1.5 w-14 bg-primary-navy mx-auto mt-4 rounded-full"></div>
          </div>
          
          {/* Testimonial slider component */}
          <TestimonialSlider />
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <CTASection />
      
    </div>
  );
}
