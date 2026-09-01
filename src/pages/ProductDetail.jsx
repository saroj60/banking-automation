import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, MessageCircle, FileText, ChevronRight, Check, Play, Shield, Globe2, HelpCircle } from "lucide-react";
import { api } from "../services/api";
import { categories } from "../data/categories";
import { SETTINGS } from "../config/settings";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [allProductsList, setAllProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProduct(slug)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
        setLoading(false);
      });

    api.getProducts()
      .then((data) => {
        setAllProductsList(data);
      })
      .catch((err) => console.error(err));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-navy rounded-full animate-spin"></div>
        <span className="text-slate-500 font-bold text-sm">Loading product specifications...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark-navy mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-8">The product you are looking for does not exist or may have been moved.</p>
        <Link to="/products" className="bg-primary-navy text-white px-6 py-3 rounded-lg font-bold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const {
    name,
    brand,
    description,
    shortDescription,
    priceType,
    availability,
    images,
    features,
    specifications,
    applications,
    category: categorySlug
  } = product;

  // Active Main Image State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Active Detail Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Resolve Category
  const categoryInfo = useMemo(() => {
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug]);

  // Related Products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProductsList
      .filter((p) => p.category === categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [allProductsList, categorySlug, product?.id]);

  // Generate pre-filled WhatsApp message
  const whatsappUrl = useMemo(() => {
    const text = SETTINGS.whatsappMessageTemplate(name);
    return `https://wa.me/${SETTINGS.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [name]);

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Products", to: "/products" },
    { label: categoryInfo ? categoryInfo.name : "Category", to: `/products?category=${categorySlug}` },
    { label: name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <Breadcrumb items={breadcrumbItems} />

      {/* Main product presentation block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-16 mt-4">
        
        {/* Left: Product Images (Gallery) */}
        <div className="md:col-span-6 space-y-4">
          {/* Active Image Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center aspect-square relative overflow-hidden group">
            <img
              src={images[activeImageIndex]}
              alt={`${name} preview`}
              className="object-contain max-h-full max-w-full rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1.5 no-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square w-20 rounded-xl bg-slate-50 border p-2 flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
                    index === activeImageIndex
                      ? "border-primary-navy ring-2 ring-primary-navy/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={img} alt={`${name} thumbnail ${index + 1}`} className="object-contain max-h-full max-w-full rounded" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Core B2B Details */}
        <div className="md:col-span-6 flex flex-col justify-between py-2 text-left">
          <div>
            {/* Meta Tags */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded">
                Brand: {brand}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded ${
                availability === "In Stock" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              }`}>
                {availability}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-dark-navy tracking-tight leading-tight mb-3">
              {name}
            </h1>

            <p className="text-muted-text text-sm leading-relaxed mb-6">
              {shortDescription}
            </p>

            {/* B2B Price Callout */}
            <div className="bg-light-blue/70 border border-light-blue rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">Price Category</span>
                  <span className="text-primary-navy text-2xl font-black tracking-tight block mt-0.5">
                    {priceType || "Price on Request"}
                  </span>
                </div>
                <div className="bg-white border border-light-blue rounded-lg p-2.5 text-center hidden sm:block">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Response Speed</span>
                  <span className="text-[11px] font-extrabold text-slate-700 block mt-0.5">Within 2 Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3.5">
            {/* Primary Action: Get Quote Form */}
            <Link
              to={`/request-quote?product=${slug}`}
              className="flex items-center justify-center w-full bg-primary-navy hover:bg-blue-accent text-white font-extrabold text-sm py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 tracking-wider uppercase"
            >
              <FileText className="h-5 w-5 mr-2" /> Request a Quote
            </Link>

            <div className="grid grid-cols-2 gap-3">
              {/* WhatsApp Enquiry */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs py-3.5 px-4 rounded-xl transition-all duration-200"
              >
                <MessageCircle className="h-4.5 w-4.5 mr-2" /> WhatsApp Us
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${SETTINGS.contact.phoneMobile}`}
                className="flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-dark-navy hover:text-primary-navy border border-slate-200 font-bold text-xs py-3.5 px-4 rounded-xl transition-all duration-200"
              >
                <Phone className="h-4.5 w-4.5 mr-2" /> Call Now
              </a>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold text-center italic mt-2">
              * Quotes are provided with no obligations. Support includes free branch delivery within Kathmandu valley.
            </p>
          </div>

        </div>
      </div>

      {/* ================================================== */}
      {/* DETAILED INFORMATION TABS */}
      {/* ================================================== */}
      <section className="mb-16">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar mb-8">
          {[
            { id: "overview", label: "Product Overview" },
            { id: "features", label: "Key Features" },
            { id: "specifications", label: "Specifications" },
            { id: "applications", label: "Applications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-navy text-primary-navy font-black"
                  : "border-transparent text-slate-500 hover:text-primary-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="bg-white rounded-2xl border border-slate-50 shadow-soft p-6 md:p-8">
          
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-dark-navy">Detailed Product Overview</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-primary-navy mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-dark-navy">1 Year Warranty</h4>
                      <p className="text-[10px] text-slate-400">Genuine parts covered</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Globe2 className="h-5 w-5 text-primary-navy mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-dark-navy">Pan Nepal Delivery</h4>
                      <p className="text-[10px] text-slate-400">Doorstep setup & service</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product video graphic mock */}
              <div className="lg:col-span-5 bg-slate-900 aspect-video rounded-2xl flex items-center justify-center p-6 text-center relative overflow-hidden group border border-slate-800 shadow-md">
                {/* Visual placeholder background */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-xs" style={{ backgroundImage: `url(${images[0]})` }}></div>
                <div className="relative z-10 space-y-4 flex flex-col items-center">
                  <button className="h-14 w-14 rounded-full bg-white text-dark-navy hover:scale-105 flex items-center justify-center shadow-lg transition-transform duration-200">
                    <Play className="h-6 w-6 ml-1 text-primary-navy fill-current" />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider block">Watch Product Demo</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Runtime: 2m 45s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Key Features */}
          {activeTab === "features" && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-dark-navy">Key Highlights & Functionality</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="h-5 w-5 rounded-full bg-light-blue text-primary-navy flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Technical Specifications */}
          {activeTab === "specifications" && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-dark-navy">Technical Specifications Sheet</h3>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-slate-700">
                  <tbody>
                    {Object.entries(specifications).map(([key, val], idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/50"
                      >
                        <td className="bg-slate-50 font-bold text-dark-navy w-1/3 p-4 border-r border-slate-100">
                          {key}
                        </td>
                        <td className="p-4 font-semibold text-slate-600">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Applications */}
          {activeTab === "applications" && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold text-dark-navy">Applications & Environments</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                This automation solution is engineered and thoroughly calibrated to perform reliably in these recommended settings:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {applications.map((app, idx) => (
                  <div key={idx} className="border border-slate-200/60 rounded-xl p-4 text-center hover:border-blue-accent/20 transition-all duration-300">
                    <span className="font-extrabold text-dark-navy text-xs tracking-wide block uppercase">
                      {app}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================================================== */}
      {/* RELATED PRODUCTS */}
      {/* ================================================== */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-100 pt-16 mb-6">
          <h2 className="text-2xl font-black text-dark-navy mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
