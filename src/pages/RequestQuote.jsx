import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Clock, Headphones, BadgeAlert, AlertCircle, FileUp, Send, Check } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { api } from "../services/api";
import Breadcrumb from "../components/Breadcrumb";

export default function RequestQuote() {
  const [productsList, setProductsList] = useState([]);
  const { settings: SETTINGS } = useSettings();

  useEffect(() => {
    api.getProducts()
      .then(data => setProductsList(data))
      .catch(err => console.error("Failed to load quote product choices:", err));
  }, []);
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get("product") || "";

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    emailAddress: "",
    selectedProductSlug: productParam,
    quantity: "1",
    location: "",
    message: "",
  });

  // File Upload State
  const [requirementFile, setRequirementFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Validation / Error States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync with URL query parameter
  useEffect(() => {
    if (productParam) {
      setFormData((prev) => ({ ...prev, selectedProductSlug: productParam }));
    }
  }, [productParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRequirementFile(file);
      setFileName(file.name);
    }
  };

  // Form validation checks
  const validateForm = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!formData.companyName.trim()) nextErrors.companyName = "Company/cooperative name is required";
    if (!formData.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required";
    
    // Email regex
    if (!formData.emailAddress.trim()) {
      nextErrors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      nextErrors.emailAddress = "Please enter a valid email address";
    }

    if (!formData.selectedProductSlug) nextErrors.selectedProductSlug = "Please select a product model";
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      nextErrors.quantity = "Please enter a valid quantity (min 1)";
    }
    if (!formData.location.trim()) nextErrors.location = "Delivery location/district is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API Submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Structure the submit payload (console logged for developer inspect)
      console.log("Quotation Request Submitted Successfully:", {
        ...formData,
        attachedFileName: fileName,
        submittedAt: new Date().toISOString()
      });

      // Prepare function so backend/email integration can be added later
      // fetch('/api/quotations', { method: 'POST', body: JSON.stringify(formData) })
    }, 1500);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      companyName: "",
      phoneNumber: "",
      emailAddress: "",
      selectedProductSlug: "",
      quantity: "1",
      location: "",
      message: "",
    });
    setRequirementFile(null);
    setFileName("");
    setShowSuccess(false);
  };

  // Breadcrumbs items
  const breadcrumbItems = [{ label: "Request a Quote", to: "/request-quote" }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left relative">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
        
        {/* ================================================== */}
        {/* LEFT COLUMN: THE FORM */}
        {/* ================================================== */}
        <section className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-soft">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-dark-navy tracking-tight">
              Request a B2B Quote
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit your branch requirements below, and our corporate sales team will send a custom invoice quotation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Row 1: Full Name & Company Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Contact Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ram Bahadur Shrestha"
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.fullName ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.fullName && <p className="text-[10px] font-bold text-rose-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Company / Cooperative Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Prime Cooperative Ltd."
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.companyName ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.companyName && <p className="text-[10px] font-bold text-rose-500">{errors.companyName}</p>}
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. +977 98511XXXXX"
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.phoneNumber ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.phoneNumber && <p className="text-[10px] font-bold text-rose-500">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Email Address *</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="ram@primecoop.com.np"
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.emailAddress ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.emailAddress && <p className="text-[10px] font-bold text-rose-500">{errors.emailAddress}</p>}
              </div>
            </div>

            {/* Row 3: Product Select & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Select Product Model *</label>
                <select
                  name="selectedProductSlug"
                  value={formData.selectedProductSlug}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.selectedProductSlug ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Choose a Product model --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.slug}>
                      [{p.brand}] {p.name}
                    </option>
                  ))}
                </select>
                {errors.selectedProductSlug && <p className="text-[10px] font-bold text-rose-500">{errors.selectedProductSlug}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.quantity ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.quantity && <p className="text-[10px] font-bold text-rose-500">{errors.quantity}</p>}
              </div>

            </div>

            {/* Row 4: Delivery Location */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Delivery Location / City *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Putalisadak, Kathmandu or Chipledhunga, Pokhara"
                className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                  errors.location ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                }`}
              />
              {errors.location && <p className="text-[10px] font-bold text-rose-500">{errors.location}</p>}
            </div>

            {/* Row 5: Specification / Message details */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Specifications & Requirements Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Detail any custom counting chimes, LED characters, network setup requirements, or specific requests..."
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent"
              ></textarea>
            </div>

            {/* Row 6: File attachment */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Upload Requirement File (.pdf, .docx, .png)</label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-3 px-4 border border-slate-200 rounded-lg cursor-pointer transition-colors">
                  <FileUp className="h-4.5 w-4.5 mr-2 text-primary-navy" />
                  Select Document
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {fileName ? (
                  <span className="text-xs font-semibold text-slate-600 truncate max-w-xs">{fileName}</span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium italic">No document selected (Optional)</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-navy hover:bg-blue-accent disabled:bg-slate-400 text-white font-extrabold text-sm py-4 rounded-xl shadow hover:shadow-lg transition-colors flex items-center justify-center tracking-wider uppercase"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Request...
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5 mr-2" /> Submit Quote Request
                  </>
                )}
              </button>
            </div>

          </form>
        </section>

        {/* ================================================== */}
        {/* RIGHT COLUMN: BENEFITS & CONTACT */}
        {/* ================================================== */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Trust Benefits box */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-5 shadow-soft">
            <h3 className="font-extrabold text-dark-navy text-xs uppercase tracking-wider pb-3 border-b border-slate-200">
              Why Request from Us?
            </h3>
            
            <div className="space-y-4">
              {[
                { title: "Quick B2B Response", desc: "Our product specialists respond with details and specifications within 2 business hours.", icon: Clock },
                { title: "Professional Support", desc: "On-site teller software configuration and training across Nepal branches.", icon: Headphones },
                { title: "Genuine Products Only", desc: "All cash processing machines are imported directly and carry manufacturer warranties.", icon: ShieldCheck }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-3 text-xs">
                    <Icon className="h-5 w-5 text-primary-navy/80 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-dark-navy">{item.title}</h4>
                      <p className="text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Contact Card */}
          <div className="bg-gradient-to-br from-primary-navy to-dark-navy text-white rounded-2xl p-6 space-y-4 shadow-soft">
            <h3 className="font-bold text-sm tracking-wide uppercase">Direct Sales Assistance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you prefer direct discussion or have bulk government tender requirements, feel free to reach out to our desk:
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <p className="flex items-center">
                <span className="font-bold mr-2">Phone:</span> {SETTINGS.contact.phone}
              </p>
              <p className="flex items-center">
                <span className="font-bold mr-2">Email:</span> {SETTINGS.contact.salesEmail}
              </p>
              <p className="flex items-center">
                <span className="font-bold mr-2">Hours:</span> 9:30 AM - 5:30 PM (Sun-Fri)
              </p>
            </div>
            <div className="pt-2">
              <a
                href={`tel:${SETTINGS.contact.phoneMobile}`}
                className="bg-white text-dark-navy hover:bg-light-blue font-extrabold text-xs py-3 w-full rounded-xl text-center block transition-colors uppercase tracking-wider shadow"
              >
                Call Support Desk
              </a>
            </div>
          </div>
        </aside>

      </div>

      {/* ================================================== */}
      {/* SUCCESS MODAL DIALOG OVERLAY */}
      {/* ================================================== */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-dark-navy/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-black text-dark-navy mb-2">Quote Request Received!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Thank you, <span className="font-bold text-slate-700">{formData.fullName}</span>. We have logged your request for <span className="font-bold text-slate-700">{formData.quantity}x</span> units. A product specialist will email or call you at <span className="font-bold text-slate-700">{formData.phoneNumber}</span> with pricing options.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleResetForm}
                className="w-full bg-primary-navy hover:bg-blue-accent text-white font-bold text-xs py-3.5 rounded-lg transition-colors uppercase tracking-wider"
              >
                Done / Back to Form
              </button>
              <Link
                to="/products"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-3.5 rounded-lg transition-colors uppercase tracking-wider block"
              >
                Continue Browsing Catalog
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
