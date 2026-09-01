import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  
  useEffect(() => {
    api.getProducts().then(data => {
      setProductsList(data);
    }).catch(err => {
      console.error("Failed to load products:", err);
    });

    api.getCategories().then(data => {
      setCategoriesList(data);
    }).catch(err => {
      console.error("Failed to load categories:", err);
    });
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL parameters synchronization
  const searchParamQuery = searchParams.get("search") || "";
  const categoryParamQuery = searchParams.get("category") || "all";

  // Catalog States
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryParamQuery);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSpeed, setSelectedSpeed] = useState("all");
  const [selectedCapacity, setSelectedCapacity] = useState("all");
  const [selectedDisplay, setSelectedDisplay] = useState("all");
  const [uvRequired, setUvRequired] = useState(false);
  const [mgRequired, setMgRequired] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  
  // Mobile Filter Drawer Toggle
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if URL parameters change (e.g. from header search or home categories clicks)
  useEffect(() => {
    setSearchQuery(searchParamQuery);
    setSelectedCategory(categoryParamQuery);
    setCurrentPage(1);
  }, [searchParamQuery, categoryParamQuery]);

  // Unique list of Brands for filtering
  const brands = useMemo(() => {
    const allBrands = productsList.map((p) => p.brand).filter(Boolean);
    return ["all", ...new Set(allBrands)];
  }, [productsList]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand !== "all") {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // Speed
    if (selectedSpeed !== "all") {
      result = result.filter((p) => p.countingSpeed === selectedSpeed);
    }

    // Capacity
    if (selectedCapacity !== "all") {
      result = result.filter((p) => p.hopperCapacity === selectedCapacity);
    }

    // Display
    // Note: handle displayType gracefully if it is undefined
    if (selectedDisplay !== "all") {
      result = result.filter((p) => p.displayType && p.displayType === selectedDisplay);
    }

    // UV counterfeit check
    if (uvRequired) {
      result = result.filter((p) => p.uvDetection);
    }

    // MG counterfeit check
    if (mgRequired) {
      result = result.filter((p) => p.mgDetection);
    }

    // Sorting
    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "brand") {
      result.sort((a, b) => a.brand.localeCompare(b.brand));
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    productsList,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedSpeed,
    selectedCapacity,
    selectedDisplay,
    uvRequired,
    mgRequired,
    sortBy,
  ]);

  // Paginated Products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedSpeed("all");
    setSelectedCapacity("all");
    setSelectedDisplay("all");
    setUvRequired(false);
    setMgRequired(false);
    setSortBy("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    setSearchParams(slug === "all" ? {} : { category: slug });
  };

  // Breadcrumbs items
  const breadcrumbItems = [{ label: "Products", to: "/products" }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left">
      <Breadcrumb items={breadcrumbItems} />

      {/* Catalog Hero Banner */}
      <div className="bg-gradient-to-r from-primary-navy to-dark-navy rounded-2xl text-white p-8 md:p-12 mb-10 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-accent/20 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Banking Automation Products
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Explore our range of reliable banking, cash handling, and business automation solutions. Fully customized for commercial and financial cooperatives in Nepal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ================================================== */}
        {/* DESKTOP SIDEBAR FILTERS */}
        {/* ================================================== */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="font-bold text-dark-navy flex items-center text-sm uppercase tracking-wide">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-primary-navy" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-primary-navy hover:text-blue-accent flex items-center"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </button>
            </div>

            {/* Filter: Category */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Category</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === "all"
                      ? "bg-light-blue text-primary-navy"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All Categories
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all truncate block ${
                      selectedCategory === cat.slug
                        ? "bg-light-blue text-primary-navy"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Brand */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-accent focus:bg-white"
              >
                <option value="all">All Brands</option>
                {brands.filter(b => b !== "all").map((br) => (
                  <option key={br} value={br}>{br}</option>
                ))}
              </select>
            </div>

            {/* Filter: Counting Speed */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Counting Speed</label>
              <select
                value={selectedSpeed}
                onChange={(e) => { setSelectedSpeed(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-accent focus:bg-white"
              >
                <option value="all">Any Speed</option>
                <option value="Below 1000">Below 1000 notes/min</option>
                <option value="1000-1200">1000 - 1200 notes/min</option>
                <option value="Above 1200">Above 1200 notes/min</option>
              </select>
            </div>

            {/* Filter: Hopper Capacity */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hopper Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => { setSelectedCapacity(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-accent focus:bg-white"
              >
                <option value="all">Any Capacity</option>
                <option value="Below 200">Below 200 notes</option>
                <option value="300">300 notes</option>
                <option value="Above 300">Above 300 notes</option>
              </select>
            </div>

            {/* Filter: Display Type */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Display Type</label>
              <select
                value={selectedDisplay}
                onChange={(e) => { setSelectedDisplay(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-accent focus:bg-white"
              >
                <option value="all">Any Display</option>
                <option value="LED">LED</option>
                <option value="LCD">LCD</option>
                <option value="TFT Touchscreen">TFT Touchscreen</option>
              </select>
            </div>

            {/* Verification Features */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">B2B Security Specs</label>
              <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uvRequired}
                  onChange={(e) => { setUvRequired(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-primary-navy mr-2 h-4 w-4 border-slate-200 focus:ring-primary-navy"
                />
                UV Counterfeit Sensor
              </label>
              <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mgRequired}
                  onChange={(e) => { setMgRequired(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-primary-navy mr-2 h-4 w-4 border-slate-200 focus:ring-primary-navy"
                />
                MG Magnetic Ink Sensor
              </label>
            </div>

          </div>
        </aside>

        {/* ================================================== */}
        {/* MAIN PRODUCT GRID VIEW */}
        {/* ================================================== */}
        <section className="lg:col-span-3 space-y-6">
          {/* Top Actions: Search and Sorting controls */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by brand, name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full text-xs font-semibold pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-accent focus:bg-white bg-slate-50"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Mobile filter trigger */}
            <div className="flex items-center space-x-3 justify-between md:justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center bg-slate-50 hover:bg-light-blue text-dark-navy hover:text-primary-navy text-xs font-bold px-4 py-3 border border-slate-200 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" /> Filters
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-xs font-semibold hidden sm:inline flex-shrink-0">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="text-xs font-bold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-accent focus:bg-white text-dark-navy"
                >
                  <option value="featured">Featured First</option>
                  <option value="name-asc">Name (A - Z)</option>
                  <option value="name-desc">Name (Z - A)</option>
                  <option value="brand">Brand</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Indicators Row */}
          {(selectedCategory !== "all" || selectedBrand !== "all" || selectedSpeed !== "all" || selectedCapacity !== "all" || selectedDisplay !== "all" || uvRequired || mgRequired) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-text font-bold uppercase tracking-wider mr-1">Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase bg-light-blue text-primary-navy px-2.5 py-1 rounded-md">
                  Cat: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="ml-1 text-slate-400 hover:text-primary-navy"><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedBrand !== "all" && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase bg-light-blue text-primary-navy px-2.5 py-1 rounded-md">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand("all")} className="ml-1 text-slate-400 hover:text-primary-navy"><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedSpeed !== "all" && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase bg-light-blue text-primary-navy px-2.5 py-1 rounded-md">
                  Speed: {selectedSpeed}
                  <button onClick={() => setSelectedSpeed("all")} className="ml-1 text-slate-400 hover:text-primary-navy"><X className="h-3 w-3" /></button>
                </span>
              )}
              {uvRequired && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase bg-light-blue text-primary-navy px-2.5 py-1 rounded-md">
                  UV Sensor
                  <button onClick={() => setUvRequired(false)} className="ml-1 text-slate-400 hover:text-primary-navy"><X className="h-3 w-3" /></button>
                </span>
              )}
              {mgRequired && (
                <span className="inline-flex items-center text-[10px] font-bold uppercase bg-light-blue text-primary-navy px-2.5 py-1 rounded-md">
                  MG Sensor
                  <button onClick={() => setMgRequired(false)} className="ml-1 text-slate-400 hover:text-primary-navy"><X className="h-3 w-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-rose-600 hover:text-rose-700 font-extrabold uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary */}
          <p className="text-xs text-muted-text font-bold">
            SHOWING {filteredProducts.length} PRODUCTS
          </p>

          {/* Catalog Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-xl p-16 text-center shadow-soft">
              <SlidersHorizontal className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-dark-navy text-lg mb-1">No products found</h3>
              <p className="text-xs text-muted-text max-w-sm mx-auto mb-6">
                We couldn't find any products matching your specific combinations. Try resetting filters or using a broader query.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-primary-navy hover:bg-blue-accent text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center text-xs font-bold text-dark-navy hover:text-primary-navy disabled:opacity-40 disabled:pointer-events-none transition-colors border border-slate-200 rounded-lg py-2 px-3.5 bg-white"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </button>

              <div className="flex items-center space-x-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                      page === currentPage
                        ? "bg-primary-navy text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center text-xs font-bold text-dark-navy hover:text-primary-navy disabled:opacity-40 disabled:pointer-events-none transition-colors border border-slate-200 rounded-lg py-2 px-3.5 bg-white"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ================================================== */}
      {/* MOBILE FILTER DRAWER OVERLAY */}
      {/* ================================================== */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-dark-navy/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-[85vw] max-w-[320px] bg-white h-full flex flex-col shadow-2xl p-5 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="font-bold text-dark-navy text-sm uppercase tracking-wider flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-primary-navy" />
                Refine Search
              </span>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow space-y-6">
              {/* Filter: Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Brand */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none"
                >
                  <option value="all">All Brands</option>
                  {brands.filter(b => b !== "all").map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              {/* Filter: Counting Speed */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Counting Speed</label>
                <select
                  value={selectedSpeed}
                  onChange={(e) => { setSelectedSpeed(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none"
                >
                  <option value="all">Any Speed</option>
                  <option value="Below 1000">Below 1000 notes/min</option>
                  <option value="1000-1200">1000 - 1200 notes/min</option>
                  <option value="Above 1200">Above 1200 notes/min</option>
                </select>
              </div>

              {/* Filter: Display Type */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Display Type</label>
                <select
                  value={selectedDisplay}
                  onChange={(e) => { setSelectedDisplay(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none"
                >
                  <option value="all">Any Display</option>
                  <option value="LED">LED</option>
                  <option value="LCD">LCD</option>
                  <option value="TFT Touchscreen">TFT Touchscreen</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Security Sensors</label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uvRequired}
                    onChange={(e) => { setUvRequired(e.target.checked); setCurrentPage(1); }}
                    className="rounded text-primary-navy mr-2.5 h-4.5 w-4.5 border-slate-200"
                  />
                  UV counterfeit sensor
                </label>
                <label className="flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mgRequired}
                    onChange={(e) => { setMgRequired(e.target.checked); setCurrentPage(1); }}
                    className="rounded text-primary-navy mr-2.5 h-4.5 w-4.5 border-slate-200"
                  />
                  MG magnetic sensor
                </label>
              </div>
            </div>

            {/* Bottom drawer buttons */}
            <div className="border-t border-slate-100 pt-4 mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={() => { handleResetFilters(); setIsFilterDrawerOpen(false); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="bg-primary-navy hover:bg-blue-accent text-white text-xs font-bold py-3 rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
