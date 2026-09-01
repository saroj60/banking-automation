import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-dark-navy py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative background grid/accents */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-navy/40 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-accent/30 blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          NEED A SOLUTION FOR YOUR BUSINESS?
        </h2>
        <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
          Our experts are ready to help you analyze, implement, and support your banking or retail operations.
        </p>
        <div>
          <Link
            to="/request-quote"
            className="inline-flex items-center justify-center bg-white text-dark-navy hover:bg-light-blue font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-0.5"
          >
            REQUEST A QUOTE
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
