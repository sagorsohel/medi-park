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
    <footer className="w-full overflow-hidden bg-primary text-primary-foreground ">
      <div className=" mx-auto w-full max-w-7xl  py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 justify-center items-center mb-8">
          {/* Leftmost Column - Medipark Tele Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Medipark Tele Service</h3>

            {/* Contact Info Buttons */}
            {(firstPhone || email) && (
              <div className="space-y-3 ">
                {firstPhone && (
                  <div className="flex items-center justify-between gap-3 p-1 font-bold border border-primary-foreground rounded-[22px] ">
                    <div className=" rounded-lg px-4 py-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">24 hours</span>
                    </div>
                    <div className=" rounded-[22px] px-4 py-2 bg-primary-foreground text-primary flex justify-end items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{firstPhone}</span>
                    </div>
                  </div>
                )}
                {email && <p className="text-sm">{email}</p>}
              </div>
            )}

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
                src="/footer-logo-1.png"
                alt="MediPark Specialized Hospital"
                className="h-12 w-auto mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />

            </div>

            {/* Location */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Dhaka</h4>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
              </p>
            </div>

            {/* Social Media Icons */}
            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-4">
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
                        className="h-5 w-5 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-sm">{link.name}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Copyright and Back to Top */}


        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="border border-primary-foreground/10  p-2 rounded-full inline-block">
            <div className="bg-white p-3 rounded-full w-[175px] mx-auto flex justify-center">
              <img
                src="/footer-logo-2.png"
                alt="MediPark Logo"
                className="h-8 w-auto "
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </div>
          </div>
          <p className="text-sm text-primary-foreground/80">
            © {currentYear} softinglobal. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors"
          >
            <span>Back to top</span>
            <div className="w-16 h-0.5  bg-primary-foreground"></div>
            <div className="w-8 h-8 rounded-full border bg-primary-foreground border-primary-foreground text-primary flex items-center justify-center">
              <Mouse className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
