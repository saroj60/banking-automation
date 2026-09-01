import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Solutions from "./pages/Solutions";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import RequestQuote from "./pages/RequestQuote";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
      <Routes>
        {/* Main Wrapper Layout containing sticky header, bottom menu & footer */}
        <Route path="/" element={<MainLayout />}>
          {/* Sub-Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="categories/:slug" element={<Category />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="request-quote" element={<RequestQuote />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/login" element={<AdminLogin />} />
          
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-dark-navy mb-4">404 - Page Not Found</h2>
                <p className="text-slate-500 mb-8">The page you requested does not exist.</p>
                <a href="/" className="bg-primary-navy text-white px-6 py-3 rounded-lg font-bold">
                  Go back Home
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </SettingsProvider>
);
}
