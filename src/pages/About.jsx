import React from "react";
import { Link } from "react-router-dom";
import { Award, Compass, Eye, ShieldAlert, AwardIcon, Users } from "lucide-react";
import CTASection from "../components/CTASection";

export default function About() {
  const stats = [
    { label: "Products Offered", val: "50+" },
    { label: "Clients Served", val: "1,200+" },
    { label: "Projects Completed", val: "450+" },
    { label: "Years of Experience", val: "12+" }
  ];

  const coreValues = [
    {
      title: "Our Mission",
      desc: "To deliver reliable, high-speed, and secure banking automation hardware and software products that empower teller desks and corporate hubs across Nepal.",
      icon: Compass,
      color: "bg-blue-50 text-primary-navy"
    },
    {
      title: "Our Vision",
      desc: "To be the ultimate B2B partner for financial institutions in Nepal, spearheading branch efficiency through certified machinery and after-sales service level contracts.",
      icon: Eye,
      color: "bg-emerald-50 text-emerald-800"
    },
    {
      title: "Our Core Values",
      desc: "Absolute integrity, certified calibration precision, customer-centric response, and lifetime technical support form the bedrock of our business.",
      icon: Award,
      color: "bg-amber-50 text-amber-800"
    }
  ];

  const teamMembers = [
    { name: "Sanjay Bajracharya", pos: "Managing Director", desc: "Over 15 years in currency sorting solutions and strategic B2B distribution networks." },
    { name: "Pukar Shrestha", pos: "Chief Technical Engineer", desc: "Specializes in multi-channel queue system programming and sensor calibrations." },
    { name: "Anish Adhikari", pos: "Head of Client Services", desc: "Coordinates technical SLAs and field engineers across Kathmandu, Pokhara, and Chitwan." }
  ];

  const certifications = [
    "ISO 9001:2015 Certified",
    "EC Machinery Directive Compliant",
    "Authorized Suzuco Distributor",
    "Glory Premium Partner",
    "Kisan Co. Service Agent"
  ];

  return (
    <div className="space-y-16 py-8 text-left">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-navy to-dark-navy rounded-2xl text-white p-8 md:p-12 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-accent/20 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl text-left">
            <span className="text-xs font-extrabold text-blue-accent uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Who We Are</span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 mb-3">
              About Banking Automation
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Serving the Nepalese financial sector for over a decade with high-performance cash handlers, queue managers, and custom automation equipment.
            </p>
          </div>
        </div>
      </section>

      {/* Main Info Split layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Description Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-dark-navy leading-tight">
              PIONEERING COMMERCIAL CASH AND BRANCH AUTOMATION IN NEPAL
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Established in Kathmandu, **Banking Automation** has grown to become the trusted provider of cash handling machines, counterfeit note validators, customer queue setups, and automated school timers.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our core strength lies in bridging international technology with local branch operations. From supplying simple counter calculators to designing multi-channel outpatient token software in Pokhara, our systems are calibrated to withstand high-volume operations while running silently.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              With a dedicated field team, we provide technical installation, staff training, and proactive SLA checkups across Nepal, ensuring zero downtime at teller counters.
            </p>
          </div>

          {/* Image visual */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-primary-navy/5 rounded-2xl blur-xl transform rotate-2"></div>
            <div className="relative border border-slate-100 rounded-2xl overflow-hidden shadow-soft aspect-[4/3] bg-slate-50">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop"
                alt="Corporate consulting meeting"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Statistics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-navy rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#808080_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 relative z-10">
              <span className="text-4xl md:text-5xl font-black tracking-tight block">{stat.val}</span>
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-4 ${val.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-dark-navy text-base mb-2.5">{val.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Team Management */}
      <section className="bg-light-section py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-dark-navy">OUR TEAM</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">Meet the management and technical engineers driving business automation forwards in Nepal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center group hover:shadow-premium transition-all duration-300">
                <div className="h-14 w-14 rounded-full bg-light-blue text-primary-navy flex items-center justify-center mb-4 group-hover:bg-primary-navy group-hover:text-white transition-colors duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-dark-navy text-sm md:text-base">{member.name}</h4>
                <span className="text-primary-navy text-[11px] font-extrabold uppercase tracking-wider block mt-0.5 mb-3">{member.pos}</span>
                <p className="text-slate-500 text-xs leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners and certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-dark-navy">PARTNERS & COMPLIANCE</h2>
          <div className="h-1.5 w-14 bg-primary-navy mx-auto mt-3 rounded-full"></div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4.5 pt-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="border border-slate-200/60 rounded-xl px-5 py-3 bg-white text-xs font-extrabold text-slate-600 hover:text-primary-navy hover:border-blue-accent/20 transition-all duration-200 shadow-sm"
            >
              {cert}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <CTASection />

    </div>
  );
}
