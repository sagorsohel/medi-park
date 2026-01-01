"use client";

import { Link } from "react-router";
import { Clock, Phone, Mouse } from "lucide-react";
import { useGetFooterContactQuery, useGetSocialLinksQuery } from "@/services/contactPageApi";
import { useMemo } from "react";

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
  const firstPhone = footerContact?.phone && footerContact.phone.length > 0 ? footerContact.phone[0] : null;
  const email = footerContact?.email || null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 justify-center items-center mb-8">
          {/* Leftmost Column - Medipark Tele Service */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold">Medipark Tele Service</h3>

            {/* Contact Info Buttons */}
            {(firstPhone || email) && (
              <div className="space-y-3">
                {firstPhone && (
                  <div className="flex  sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 p-1 font-bold border border-primary-foreground rounded-[22px]">
                    <div className="rounded-lg px-3 sm:px-4 py-2 flex items-center gap-2 justify-center sm:justify-start">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="text-xs sm:text-sm">24 hours</span>
                    </div>
                    <div className="rounded-[22px] px-3 sm:px-4 py-2 bg-primary-foreground text-primary flex justify-center sm:justify-end items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="text-xs sm:text-sm break-all">{firstPhone}</span>
                    </div>
                  </div>
                )}
                {email && (
                  <p className="text-xs sm:text-sm break-all">{email}</p>
                )}
              </div>
            )}

            {/* Logo - Mobile */}
            <div className="md:hidden">
              <img
                src="/footer-logo-1.png"
                alt="MediPark Specialized Hospital"
                className="h-10 sm:h-12 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-2">
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3">
              <Link to="/services" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Services
              </Link>
              <Link to="/about" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                About Us
              </Link>
              <Link to="/solution" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Solution
              </Link>
              <Link to="/gallery" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Gallery
              </Link>
              <Link to="/contacts" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Contact Us
              </Link>
              <Link to="/blogs" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Blogs
              </Link>
              <Link to="/careers" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Careers
              </Link>
              <Link to="/team" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Team
              </Link>
              <Link to="/faqs" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                FAQs
              </Link>
              <Link to="/benefits" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Benefits
              </Link>
              <Link to="/privacy" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Privacy & Policy
              </Link>
              <Link to="/terms" className="text-xs sm:text-sm hover:text-blue-300 transition-colors">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Rightmost Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Logo and Tagline - Desktop */}
            <div className="hidden md:block">
              <img
                src="/footer-logo-1.png"
                alt="MediPark Specialized Hospital"
                className="h-10 sm:h-12 w-auto mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </div>

            {/* Location */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Dhaka</h4>
              <p className="text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
              </p>
            </div>

            {/* Social Media Icons */}
            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {activeSocialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-blue-300 transition-colors"
                    aria-label={link.name}
                  >
                    {link.image ? (
                      <img
                        src={link.image}
                        alt={link.name}
                        className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs sm:text-sm">{link.name}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Copyright and Back to Top */}


        <div className="border-t border-primary-foreground/20 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="border border-primary-foreground/10 p-1.5 sm:p-2 rounded-full inline-block order-2 sm:order-1">
              <div className="bg-white p-2 sm:p-3 rounded-full w-[140px] sm:w-[175px] mx-auto flex justify-center">
                <img
                  src="/footer-logo-2.png"
                  alt="MediPark Logo"
                  className="h-6 sm:h-8 w-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/logo.png";
                  }}
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-foreground/80 text-center order-1 sm:order-2">
              © {currentYear} softinglobal. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:text-blue-300 transition-colors order-3"
            >
              <span className="hidden sm:inline">Back to top</span>
              <span className="sm:hidden">Top</span>
              <div className="w-12 sm:w-16 h-0.5 bg-primary-foreground"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border bg-primary-foreground border-primary-foreground text-primary flex items-center justify-center shrink-0">
                <Mouse className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
