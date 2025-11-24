"use client";

import { Link } from "react-router";
import { Clock, Phone, Facebook, Twitter, Instagram, Linkedin, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WebsiteFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-blue-900 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Leftmost Column - Medipark Tele Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Medipark Tele Service</h3>
            
            {/* Contact Info Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="border border-white rounded-lg px-4 py-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">24 hours</span>
                </div>
                <div className="border border-white rounded-lg px-4 py-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">00000</span>
                </div>
              </div>
              <p className="text-sm">info@mediparkbd.com</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              <Link to="/services" className="text-sm hover:text-blue-300 transition-colors">
                Services
              </Link>
              <Link to="/solution" className="text-sm hover:text-blue-300 transition-colors">
                Solution
              </Link>
              <Link to="/contacts" className="text-sm hover:text-blue-300 transition-colors">
                Contact Us
              </Link>
              <Link to="/careers" className="text-sm hover:text-blue-300 transition-colors">
                Careers
              </Link>
            </nav>

            {/* Logo */}
            <div className="border border-white rounded-lg p-3 inline-block">
              <img
                src="/navbar-logo.png"
                alt="MediPark Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </div>
          </div>

          {/* Second Column - Navigation Links */}
          <div className="space-y-4">
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm hover:text-blue-300 transition-colors">
                About Us
              </Link>
              <Link to="/gallery" className="text-sm hover:text-blue-300 transition-colors">
                Gallery
              </Link>
              <Link to="/blogs" className="text-sm hover:text-blue-300 transition-colors">
                Blogs
              </Link>
              <Link to="/team" className="text-sm hover:text-blue-300 transition-colors">
                Team
              </Link>
            </nav>
          </div>

          {/* Third Column - More Links */}
          <div className="space-y-4">
            <nav className="flex flex-col gap-2">
              <Link to="/faqs" className="text-sm hover:text-blue-300 transition-colors">
                FAQs
              </Link>
              <Link to="/benefits" className="text-sm hover:text-blue-300 transition-colors">
                Benefits
              </Link>
              <Link to="/privacy" className="text-sm hover:text-blue-300 transition-colors">
                Privacy & Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-blue-300 transition-colors">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Rightmost Section */}
          <div className="space-y-6">
            {/* Logo and Tagline */}
            <div>
              <img
                src="/navbar-logo.png"
                alt="MediPark Specialized Hospital"
                className="h-12 w-auto mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
              <p className="text-sm text-blue-200 mt-2">
                World Class Healthcare, Right Here In Bangladesh
              </p>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Dhaka</h4>
              <p className="text-sm text-blue-200 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row - Copyright and Back to Top */}
        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-200">
            © {currentYear} softinglobal. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors"
          >
            <span>Back to top</span>
            <div className="w-12 h-0.5 bg-white"></div>
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
              <ChevronUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
