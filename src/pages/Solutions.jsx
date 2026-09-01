import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, BadgeCheck, Users, Milestone, Monitor, Settings, Eye, ChevronRight, GraduationCap, Building2, ShoppingBag } from "lucide-react";
import CTASection from "../components/CTASection";

export default function Solutions() {
  const solutionCards = [
    {
      title: "Banking Automation",
      desc: "Comprehensive teller hardware, heavy currency sorting machinery, and bundle-binding systems designed to accelerate cash handling and lower vault processing times.",
      icon: Landmark,
    },
    {
      title: "Cash Management",
      desc: "Highly precise currency validation systems, multi-denomination counters, and magnetic counterfeit sensors ensuring secure desktop transactions.",
      icon: BadgeCheck,
    },
    {
      title: "Queue Management",
      desc: "Dynamic touchscreen ticket dispensers, centralized queue scheduling software, and multi-service teller routing to eliminate lobby congestion.",
      icon: Users,
    },
    {
      title: "Token Management",
      desc: "Simple plug-and-play wireless keypad announcement devices ideal for small clinics, cooperatives, and billing counters with no server setups.",
      icon: Milestone,
    },
    {
      title: "LED Display Solutions",
      desc: "Ultra-bright digit displays, customized scrolling banners, and multi-lingual characters designed for high daytime visibility in large lobbies.",
      icon: Monitor,
    },
    {
      title: "Office & Business Automation",
      desc: "Programmable automated school/college bells, high-speed thermal printers, paper strapping machines, and customized hardware integrations.",
      icon: Settings,
    }
  ];

  const industries = [
    { name: "Retail Banks & Cooperatives", desc: "Speeding teller transactions, sorting vault cash, and managing client queues.", icon: Landmark },
    { name: "Hospitals & Medical Centers", desc: "OPD token routing, clinical queues, and pharmacy billing organizers.", icon: Building2 },
    { name: "Government Administration Offices", desc: "High-volume citizen service queues, ticket printing, and LED notifications.", icon: Building2 },
    { name: "Schools, Colleges & Universities", desc: "Automated period schedules, Bluetooth bell triggers, and office paper binders.", icon: GraduationCap },
    { name: "Supermarkets & Retail Stores", desc: "Fast POS desk counting, cash validation, and counterfeit checks.", icon: ShoppingBag },
    { name: "Corporate Offices & Lobbies", desc: "Lobby welcome directories, message banners, and visitor logs.", icon: Building2 }
  ];

  const processSteps = [
    { step: "01", title: "Understand", desc: "We study your branch footprint, customer traffic patterns, and operational hurdles." },
    { step: "02", title: "Recommend", desc: "We map out certified, modular cash-handling machines or queuing software solutions." },
    { step: "03", title: "Install", desc: "Our field engineers configure hardware wiring, calibrate sensors, and train staff." },
    { step: "04", title: "Support", desc: "We provide SLA checkups, cleaning kits, and on-call troubleshooting across Nepal." }
  ];

  return (
    <div className="space-y-16 py-8 text-left">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-navy to-dark-navy rounded-2xl text-white p-8 md:p-12 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-accent/20 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold text-blue-accent uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Services & Solutions</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 mb-3">
              Banking & Business Automation
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              We engineer specialized technology setups that streamline workflows, authenticate transactions, and organize customer flows for institutions in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-dark-navy">OUR PRODUCTS & CAPABILITIES</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">Certified technology tailored to enhance productivity and security in financial and public enterprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionCards.map((solution, idx) => {
            const Icon = solution.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-100 p-6 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-0.5"
              >
                <div>
                  <div className="h-11 w-11 rounded-lg bg-light-blue text-primary-navy flex items-center justify-center mb-4">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-bold text-dark-navy text-base mb-2">{solution.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">{solution.desc}</p>
                </div>
                <Link
                  to={`/products?category=all`}
                  className="text-xs font-bold text-primary-navy hover:text-blue-accent flex items-center mt-auto"
                >
                  View Related Products <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-light-section py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-dark-navy">INDUSTRIES WE SERVE</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">Delivering specialized, scalable automation systems across multiple B2B sectors in Nepal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start space-x-4 shadow-sm hover:shadow transition-shadow">
                  <div className="p-3 bg-light-blue text-primary-navy rounded-lg flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-navy text-sm leading-snug">{ind.name}</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{ind.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deployment Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-dark-navy">OUR DEPLOYMENT PROCESS</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">How we design, configure, and support your banking automation project from start to finish.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {processSteps.map((step, idx) => (
            <div key={idx} className="relative group text-center md:text-left">
              {/* Number tag */}
              <span className="text-5xl font-black text-slate-100 group-hover:text-light-blue transition-colors duration-300 block mb-2 font-mono">
                {step.step}
              </span>
              <h4 className="font-bold text-dark-navy text-sm mb-1.5">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              
              {/* Horizontal line indicator (desktop only) */}
              {idx < 3 && (
                <div className="hidden lg:block absolute top-6 left-[65%] w-1/2 h-[1px] border-t border-dashed border-slate-200 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <CTASection />

    </div>
  );
}
