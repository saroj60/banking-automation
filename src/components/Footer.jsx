import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings: SETTINGS } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-navy text-slate-300 pt-16 pb-8 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top footer grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-left">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white text-dark-navy font-black text-xs h-8 w-8 rounded-md flex items-center justify-center shadow-md">
                BA
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {SETTINGS.companyName.toUpperCase()}
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nepal's leading provider of professional banking automation, cash handling machinery, and interactive customer queue systems. Empowering next-generation operations with reliable and certified technology.
            </p>
            {/* Social media icons */}
            <div className="flex space-x-3 pt-2">
              <a
                href={SETTINGS.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-primary-navy text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200"
                aria-label="Facebook Link"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SETTINGS.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-primary-navy text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200"
                aria-label="LinkedIn Link"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={SETTINGS.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-primary-navy text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200"
                aria-label="Twitter Link"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={SETTINGS.socials.whatsappDirect}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200"
                aria-label="WhatsApp Link"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider border-l-2 border-primary-navy pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Products Catalog</Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition-colors">Solutions & Industries</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">Client Projects</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Company</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Details</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Category Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider border-l-2 border-primary-navy pl-2.5">
              Key Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/categories/currency-counters" className="hover:text-white transition-colors">Currency Counters</Link>
              </li>
              <li>
                <Link to="/categories/currency-sorters" className="hover:text-white transition-colors">Currency Sorters</Link>
              </li>
              <li>
                <Link to="/categories/fake-note-detectors" className="hover:text-white transition-colors">Fake Note Detectors</Link>
              </li>
              <li>
                <Link to="/categories/queue-systems" className="hover:text-white transition-colors">Queue Management Systems</Link>
              </li>
              <li>
                <Link to="/categories/token-systems" className="hover:text-white transition-colors">Token Systems</Link>
              </li>
              <li>
                <Link to="/categories/led-displays" className="hover:text-white transition-colors">LED Display Boards</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider border-l-2 border-primary-navy pl-2.5">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2.5 text-primary-navy flex-shrink-0 mt-0.5" />
                <span>{SETTINGS.contact.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2.5 text-primary-navy flex-shrink-0" />
                <span>{SETTINGS.contact.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2.5 text-primary-navy flex-shrink-0" />
                <span>{SETTINGS.contact.email}</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-4 w-4 mr-2.5 text-primary-navy flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white">Business Hours:</span>
                  <span>{SETTINGS.contact.businessHours}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p className="mb-4 md:mb-0">
            Copyright &copy; {currentYear} {SETTINGS.companyName}. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <span>Kathmandu, Nepal</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
