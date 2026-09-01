import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCategory(slug)
      .then((data) => {
        setCategory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCategory(null);
        setLoading(false);
      });

    api.getProducts({ category: slug })
      .then((data) => {
        setCategoryProducts(data);
      })
      .catch((err) => console.error(err));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-navy rounded-full animate-spin"></div>
        <span className="text-slate-500 font-bold text-sm">Loading category info...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-dark-navy mb-2">Category Not Found</h2>
        <p className="text-slate-500 mb-8">The product category you specified does not exist in our system.</p>
        <Link to="/products" className="bg-primary-navy text-white px-6 py-3 rounded-lg font-bold">
          View All Products
        </Link>
      </div>
    );
  }

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "Products", to: "/products" },
    { label: category.name }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <Breadcrumb items={breadcrumbItems} />

      {/* Category Hero / Title block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-light-section rounded-2xl p-6 md:p-10 mb-12 shadow-soft mt-4">
        {/* Category info */}
        <div className="lg:col-span-7 space-y-4">
          <Link
            to="/products"
            className="inline-flex items-center text-xs font-bold text-primary-navy hover:text-blue-accent transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to All Products
          </Link>
          <h1 className="text-3xl font-black text-dark-navy tracking-tight">
            {category.name}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Category Image */}
        <div className="lg:col-span-5 aspect-video overflow-hidden rounded-xl border border-slate-200/60 shadow-sm bg-white">
          <img
            src={category.image}
            alt={category.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Category Benefits checklist */}
      {category.benefits && category.benefits.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-soft mb-12">
          <h3 className="text-sm font-extrabold text-primary-navy uppercase tracking-wider mb-4">
            Why Invest in Our {category.name}?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-left">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Listing Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xl font-bold text-dark-navy">
            Products in {category.name}
          </h2>
          <span className="text-xs font-bold text-muted-text bg-slate-100 px-3 py-1 rounded-md">
            {categoryProducts.length} Items Available
          </span>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm text-slate-500 font-semibold mb-4">
              We currently don't have catalog models registered under this category.
            </p>
            <Link
              to="/request-quote"
              className="bg-primary-navy hover:bg-blue-accent text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-colors"
            >
              Enquire Custom Specifications
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
