import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNavigation from "../components/BottomNavigation";
import ScrollToTop from "../components/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Scroll to top component on route changes */}
      <ScrollToTop />

      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      {/* pb-16 added on mobile screens to prevent bottom mobile nav from overlapping content */}
      <main className="flex-grow pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* B2B Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
