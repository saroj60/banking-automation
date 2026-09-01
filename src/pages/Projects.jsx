import React, { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { api } from "../services/api";
import ProjectCard from "../components/ProjectCard";
import Breadcrumb from "../components/Breadcrumb";

export default function Projects() {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  useEffect(() => {
    setLoading(true);
    api.getProjects()
      .then((data) => {
        setProjectsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const industries = ["All", "Banking", "Healthcare", "Government", "Education", "Corporate", "Retail"];

  const filteredProjects = useMemo(() => {
    if (selectedIndustry === "All") {
      return projectsList;
    }
    return projectsList.filter((p) => p.industry === selectedIndustry);
  }, [projectsList, selectedIndustry]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-navy rounded-full animate-spin"></div>
        <span className="text-slate-500 font-bold text-sm">Loading project references...</span>
      </div>
    );
  }

  // Breadcrumbs items
  const breadcrumbItems = [{ label: "Projects", to: "/projects" }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <Breadcrumb items={breadcrumbItems} />

      {/* Projects Banner */}
      <div className="bg-gradient-to-r from-primary-navy to-dark-navy rounded-2xl text-white p-8 md:p-12 mb-10 shadow-md relative overflow-hidden mt-4">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-accent/20 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Our Client Implementations
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Discover how Banking Automation is empowering branches, hospitals, government hubs, and schools across Nepal with our hardware installations and customized software integrations.
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <SlidersHorizontal className="h-4 w-4 mr-2 text-primary-navy" />
          Filter by Sector
        </div>
        <div className="flex flex-wrap gap-2.5">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                selectedIndustry === ind
                  ? "bg-primary-navy text-white shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-primary-navy"
              }`}
            >
              {ind === "All" ? "All Sectors" : ind}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Count */}
      <p className="text-xs text-muted-text font-bold mb-6">
        SHOWING {filteredProjects.length} PROJECT DEPLOYMENTS
      </p>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl p-16 text-center shadow-soft">
          <h3 className="font-bold text-dark-navy text-lg mb-1">No projects registered</h3>
          <p className="text-xs text-muted-text max-w-sm mx-auto mb-6">
            We haven't uploaded case studies for this specific sector yet. Check back soon or contact us to receive references.
          </p>
        </div>
      )}
      
    </div>
  );
}
