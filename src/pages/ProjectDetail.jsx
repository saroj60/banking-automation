import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Building, PackageOpen, ArrowLeft } from "lucide-react";
import { api } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProject(slug)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProject(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-navy rounded-full animate-spin"></div>
        <span className="text-slate-500 font-bold text-sm">Loading project information...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark-navy mb-4">Project Case Study Not Found</h2>
        <p className="text-slate-500 mb-8">The case study you are looking for does not exist or may have been archived.</p>
        <Link to="/projects" className="bg-primary-navy text-white px-6 py-3 rounded-lg font-bold">
          Back to Projects
        </Link>
      </div>
    );
  }

  const { title, location, industry, description, images, client, date, scope } = project;
  const mainImage = images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?q=80&w=800&auto=format&fit=crop";

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Projects", to: "/projects" },
    { label: title }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-4">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center text-xs font-bold text-primary-navy hover:text-blue-accent transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Case Studies
        </Link>

        {/* Project Title Banner */}
        <div className="mb-8">
          <span className="bg-light-blue text-primary-navy text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase inline-block mb-3">
            {industry} Deploys
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-dark-navy tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        {/* Project Visual Cover */}
        <div className="aspect-video max-h-[480px] w-full overflow-hidden rounded-2xl border border-slate-100 shadow-soft mb-12 bg-slate-50">
          <img
            src={mainImage}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Detail Split Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Left: Case Study Writeup */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-dark-navy mb-3">Project Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Scope / Deliverables List */}
            {scope && scope.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-dark-navy mb-4">Equipment & System Deliverables</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700 font-medium">
                  {scope.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-5 w-5 bg-light-blue text-primary-navy flex items-center justify-center rounded-md mr-3 mt-0.5 flex-shrink-0">
                        <span className="font-bold text-[10px]">{idx + 1}</span>
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Project Parameters Card */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-5 shadow-soft">
              <h3 className="font-extrabold text-dark-navy text-xs uppercase tracking-wider pb-3.5 border-b border-slate-200">
                Project Parameters
              </h3>

              {/* Client */}
              <div className="flex items-start space-x-3.5 text-xs">
                <Building className="h-5 w-5 text-primary-navy/80 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Client</span>
                  <span className="font-bold text-dark-navy mt-0.5 block">{client}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3.5 text-xs">
                <MapPin className="h-5 w-5 text-primary-navy/80 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Location</span>
                  <span className="font-bold text-dark-navy mt-0.5 block">{location}, Nepal</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start space-x-3.5 text-xs">
                <Calendar className="h-5 w-5 text-primary-navy/80 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Deployment Date</span>
                  <span className="font-bold text-dark-navy mt-0.5 block">{date}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start space-x-3.5 text-xs">
                <PackageOpen className="h-5 w-5 text-primary-navy/80 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Operational Status</span>
                  <span className="inline-flex items-center text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded mt-1">
                    Live / Operational
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Link
                  to="/request-quote"
                  className="bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-xs py-3 w-full rounded-xl shadow-sm hover:shadow text-center block transition-colors uppercase tracking-wide"
                >
                  Request Similar Solution
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
