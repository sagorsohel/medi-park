"use client";

import { Link } from "react-router";
import { useGetFooterContactQuery, useGetSocialLinksQuery } from "@/services/contactPageApi";
import { useMemo } from "react";
import { Facebook, Youtube, Instagram, Linkedin, MapPin, Phone, Mail, ChevronRight, ChevronUp } from "lucide-react";

export function WebsiteFooter() {
  const currentYear = new Date().getFullYear();
  const { data: footerContactData } = useGetFooterContactQuery();
  const { data: socialLinksData } = useGetSocialLinksQuery(1);

  // Get active social links
  const activeSocialLinks = useMemo(() => {
    if (!socialLinksData?.data) return [];
    return socialLinksData.data.filter((link) => link.status === "active");
  }, [socialLinksData]);

  const footerContact = footerContactData?.data;
  const firstPhone = footerContact?.phone && footerContact.phone.length > 0 ? footerContact.phone[0] : "10633";
  const email = footerContact?.email || "info@mediparkhospital.com";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0B1B3D] text-blue-100/80 font-sans mt-auto border-t-4 border-primary">
      {/* Main Footer Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">

          {/* Column 1: Logo and Info */}
          <div className="flex flex-col space-y-6">
            <Link to="/">
              <img
                src="/navbar-logo.png"
                alt="MediPark Hospital"
                className="h-[60px] md:h-[80px] w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                  target.className = "h-[60px] md:h-[80px] w-auto object-contain brightness-0 invert";
                }}
              />
            </Link>
            <p className="text-[14px] leading-relaxed text-blue-100/80">
              MediPark Hospital has all the characteristics of a world-class hospital with wide range of services and specialists, equipments and technology, ambience and service quality.
            </p>
            <div className="font-bold tracking-[0.1em] flex items-center gap-2 text-white uppercase mt-4">
              [ Hotline - {firstPhone} ]
            </div>
          </div>

          {/* Column 2: Quick Links 1 */}
          <div className="flex flex-col">
            <h3 className="text-white text-lg font-bold mb-5 pt-2 uppercase">QUICK LINKS</h3>
            <ul className="space-y-0">
              {[
                { name: 'Services', to: '/services' },
                { name: 'Feedback', to: '/feedback' },
                { name: 'Make Appointment', to: '/appointment' },
                { name: 'Contact', to: '/contacts' },
                { name: 'Health Package', to: '/health-package' },
              ].map((link, i) => (
                <li key={i} className="border-b border-white/10 transition-colors hover:border-white/30">
                  <Link to={link.to} className="flex items-center block py-3 group hover:text-white transition-colors text-[14px]">
                    <ChevronRight className="w-4 h-4 mr-2.5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links 2 */}
          <div className="flex flex-col">
            <h3 className="text-white text-lg font-bold mb-5 pt-2 uppercase">QUICK LINKS</h3>
            <ul className="space-y-0">
              {[
                { name: 'News & Media', to: '/news' },
                { name: 'Career', to: '/careers' },
                { name: 'Facilities', to: '/facilities' },
                { name: 'Patient Stories', to: '/patient-stories' },
                { name: 'About Us', to: '/about' },
              ].map((link, i) => (
                <li key={i} className="border-b border-white/10 transition-colors hover:border-white/30">
                  <Link to={link.to} className="flex items-center block py-3 group hover:text-white transition-colors text-[14px]">
                    <ChevronRight className="w-4 h-4 mr-2.5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get Us */}
          <div className="flex flex-col">
            <h3 className="text-white text-lg font-bold mb-6 pt-2 uppercase">GET US</h3>

            <div className="space-y-4 mb-8 text-[14px] leading-relaxed">
              <div className="flex items-start">
                <MapPin className="w-[18px] h-[18px] mr-3 text-white shrink-0 mt-0.5" />
                <span>
                  MediPark Hospital Dhaka, Plot # 81, Block-E,<br />
                  Bashundhara R/A, Dhaka 1229, Bangladesh
                </span>
              </div>

              <div className="flex items-start border-t border-white/10 pt-4">
                <Phone className="w-[18px] h-[18px] mr-3 text-white shrink-0 mt-0.5" />
                <span className="break-all whitespace-pre-wrap">
                  {footerContact?.phone?.join(', ') || firstPhone}
                </span>
              </div>

              <div className="flex items-center border-t border-white/10 pt-4">
                <Mail className="w-[18px] h-[18px] mr-3 text-white shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Social Icons - Squares as per design */}
            <div className="flex items-center gap-2 mt-auto">
              <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('facebook'))?.link || '#'}
                className="bg-primary hover:bg-[#1a8078] text-white w-9 h-9 flex items-center justify-center transition-colors">
                <Facebook className="w-[18px] h-[18px] fill-current" />
              </a>
              <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('linkedin'))?.link || '#'}
                className="bg-primary hover:bg-[#1a8078] text-white w-9 h-9 flex items-center justify-center transition-colors">
                <Linkedin className="w-[18px] h-[18px] fill-current" />
              </a>
              <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('youtube'))?.link || '#'}
                className="bg-primary hover:bg-[#1a8078] text-white w-9 h-9 flex items-center justify-center transition-colors">
                <Youtube className="w-[18px] h-[18px] fill-current" />
              </a>
              <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('twitter') || l.name.toLowerCase().includes('x'))?.link || '#'}
                className="bg-primary hover:bg-[#1a8078] text-white w-9 h-9 flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3174 10.7749L21.1143 1.76465H19.2687L12.5025 9.58434L7.10098 1.76465H0.880859L9.05711 13.627L0.880859 23.1316H2.72661L9.89437 14.8466L15.5861 23.1316H21.8062L13.317 10.7749H13.3174ZM10.8252 13.7712L9.99849 12.585L3.39169 3.0983H6.22359L11.5546 10.7423L12.3813 11.9285L19.3364 21.9161H16.5045L10.8252 13.7716V13.7712Z" fill="currentColor" />
                </svg>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Bar Area */}
      <div className="bg-[#061024] py-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 relative pr-16 md:pr-0">

          <div className="text-[13px] text-blue-100/50 font-medium text-center md:text-left flex flex-col space-y-2">
            <p className="text-blue-100/60">Copyright © {currentYear}. All Rights Reserved. MediPark Hospital PLC.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-primary">
              <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              <span className="text-blue-100/20">|</span>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Condition</Link>
              <span className="text-blue-100/20">|</span>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-white md:mr-16">
            <span className="text-blue-100/50">Developed By</span>
            <a href="https://softinglobal.com" className="font-semibold tracking-wide text-blue-100/80">Softin-global</a>
            <span className="text-blue-100/50">| ICT Division.</span>
          </div>

          {/* Scroll To Top Button (positioned globally relative to the bottom bar) */}
          <button
            onClick={scrollToTop}
            className="absolute -top-[52px] right-4 md:right-8 bg-primary hover:bg-[#1a8078] w-12 h-12 flex items-center justify-center text-white transition-colors cursor-pointer shadow-lg z-10"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6 outline-none" />
          </button>

        </div>
      </div>
    </footer>
  );
}
