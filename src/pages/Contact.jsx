import React, { useState } from "react";
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, Check } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import Breadcrumb from "../components/Breadcrumb";

export default function Contact() {
  const { settings: SETTINGS } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Your name is required";
    if (!formData.phone.trim()) nextErrors.phone = "Your phone number is required";
    if (!formData.subject.trim()) nextErrors.subject = "Please enter a subject";
    if (!formData.message.trim()) nextErrors.message = "Message text cannot be empty";

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      console.log("Contact Form Message Sent:", {
        ...formData,
        sentAt: new Date().toISOString()
      });
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      company: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });
    setShowSuccess(false);
  };

  const breadcrumbItems = [{ label: "Contact Us", to: "/contact" }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left relative">
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-navy to-dark-navy rounded-2xl text-white p-8 md:p-12 mb-10 shadow-md relative overflow-hidden mt-4">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-accent/20 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl text-left">
          <span className="text-xs font-extrabold text-blue-accent uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Get In Touch</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 mb-3">
            Contact Banking Automation
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Have questions about a product catalog, or need a technical service onsite? Write to our office or call our Kathmandu desk directly.
          </p>
        </div>
      </section>

      {/* Info Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Phone */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="h-10 w-10 rounded-lg bg-light-blue text-primary-navy flex items-center justify-center mb-4">
            <Phone className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-dark-navy text-sm mb-1.5">Phone Desk</h3>
          <p className="text-xs font-semibold text-slate-700">{SETTINGS.contact.phone}</p>
          <p className="text-xs font-semibold text-slate-700">{SETTINGS.contact.phoneMobile}</p>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="h-10 w-10 rounded-lg bg-light-blue text-primary-navy flex items-center justify-center mb-4">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-dark-navy text-sm mb-1.5">Email Support</h3>
          <p className="text-xs font-semibold text-slate-700 truncate">{SETTINGS.contact.email}</p>
          <p className="text-xs font-semibold text-slate-700 truncate">{SETTINGS.contact.salesEmail}</p>
        </div>

        {/* Card 3: WhatsApp */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-dark-navy text-sm mb-1.5">WhatsApp Chat</h3>
          <p className="text-xs font-semibold text-slate-700">Chat with support desk</p>
          <a
            href={SETTINGS.socials.whatsappDirect}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 block mt-1"
          >
            Start Chat &rarr;
          </a>
        </div>

        {/* Card 4: Hours */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-dark-navy text-sm mb-1.5">Business Hours</h3>
          <p className="text-xs font-semibold text-slate-700">9:30 AM - 5:30 PM</p>
          <p className="text-xs text-slate-500 font-medium">Sunday - Friday (Closed Saturday)</p>
        </div>
      </section>

      {/* Split layout: Form and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Contact Form */}
        <section className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-bold text-dark-navy mb-4">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.name ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                  placeholder="e.g. Ram Prasad"
                />
                {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Company / Cooperative</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent"
                  placeholder="e.g. Kumari Bank Ltd. (Optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.phone ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                  placeholder="e.g. 98510XXXXX"
                />
                {errors.phone && <p className="text-[10px] font-bold text-rose-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                    errors.email ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                  }`}
                  placeholder="ram@domain.com"
                />
                {errors.email && <p className="text-[10px] font-bold text-rose-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                  errors.subject ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                }`}
                placeholder="How can we assist you?"
              />
              {errors.subject && <p className="text-[10px] font-bold text-rose-500">{errors.subject}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className={`w-full text-xs font-semibold border rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:border-blue-accent ${
                  errors.message ? "border-rose-400 focus:border-rose-400" : "border-slate-200"
                }`}
                placeholder="Type your message here..."
              ></textarea>
              {errors.message && <p className="text-[10px] font-bold text-rose-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-navy hover:bg-blue-accent disabled:bg-slate-400 text-white font-extrabold text-xs py-3.5 rounded-lg shadow transition-colors flex items-center justify-center uppercase tracking-wider"
            >
              {isSubmitting ? (
                "Sending message..."
              ) : (
                <>
                  <Send className="h-4.5 w-4.5 mr-2" /> Send Message
                </>
              )}
            </button>
          </form>
        </section>

        {/* Google Maps Section */}
        <section className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-soft flex-grow overflow-hidden aspect-square lg:aspect-auto flex flex-col h-full">
            <h3 className="font-bold text-dark-navy text-sm mb-3 flex items-center">
              <MapPin className="h-4.5 w-4.5 text-primary-navy mr-2" /> Our Office Location
            </h3>
            <div className="flex-grow rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative min-h-[250px]">
              <iframe
                title="Banking Automation Location Map"
                src={SETTINGS.contact.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="mt-3.5 text-xs text-slate-500 leading-normal flex items-start">
              <MapPin className="h-4.5 w-4.5 text-slate-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>{SETTINGS.contact.address}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-dark-navy/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            
            <h3 className="text-xl font-black text-dark-navy mb-2">Message Sent!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Thank you for contacting Banking Automation. Your message has been routed to our support desk. We will respond to your email at <span className="font-bold text-slate-700">{formData.email}</span> shortly.
            </p>

            <button
              onClick={handleReset}
              className="w-full bg-primary-navy hover:bg-blue-accent text-white font-bold text-xs py-3.5 rounded-lg transition-colors uppercase tracking-wider"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
