"use client";

import { Link } from "react-router";
import { useGetFooterContactQuery, useGetSocialLinksQuery } from "@/services/contactPageApi";
import { useMemo } from "react";
import { Facebook, Youtube, Instagram, Linkedin } from "lucide-react";

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
  const firstPhone = footerContact?.phone && footerContact.phone.length > 0 ? footerContact.phone[0] : "10678";
  const email = footerContact?.email || "info@evercarebd.com";

  return (
    <footer className="w-full bg-[#111A2C] text-white py-12 md:py-16 relative overflow-hidden font-sans border-t-[8px] border-[#00A884]">
      {/* Background Graphic Circle Center */}
      <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] sm:w-[1200px] sm:h-[1200px] rounded-full bg-white/[0.04] pointer-events-none z-0"></div>

      {/* Background Huge Text 'Transforming Healthcare' */}
      <div className="absolute bottom-[-10px] sm:bottom-[-20px] left-0 w-full overflow-hidden leading-none pointer-events-none z-0 opacity-[0.03] flex justify-center pb-4">
        <span className="text-[10vw] sm:text-[12vw] font-bold whitespace-nowrap tracking-wider text-white font-sans uppercase">Transforming Healthcare</span>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-12 relative z-10 flex flex-col items-center">

        {/* Top 3 Columns: Contact | Logo Block | Address */}
        <div className="w-full flex gap-10 flex-col lg:flex-row items-center justify-between lg:items-start lg:justify-center lg:gap-[6%] xl:gap-[10%]">

          {/* Left Column: Contact & Social */}
          <div className="flex-1 w-full max-w-sm flex flex-col justify-start items-center lg:items-start text-center lg:text-left space-y-7 z-10 pt-4">
            <h3 className="text-sm sm:text-[15px] font-bold tracking-wide">MediPark Tele Online</h3>

            <div className="space-y-4 text-[13px] sm:text-sm font-bold tracking-wide">
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">{email}</p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V21.1399C22.0001 21.365 21.9079 21.5799 21.7451 21.7317C21.5824 21.8835 21.3653 21.9583 21.1402 21.9398C18.6672 21.6706 16.2991 20.8037 14.2 19.4101C12.2882 18.1557 10.6622 16.5297 9.40788 14.6179C8.00551 12.4996 7.13575 10.1118 6.87184 7.61864C6.85329 7.39423 6.92723 7.17804 7.07804 7.01596C7.22885 6.85387 7.4425 6.76214 7.66649 6.76214H11.8863C12.28 6.76214 12.6105 7.04941 12.6775 7.43906C12.7623 7.94273 12.9152 8.42838 13.1311 8.88094C13.2166 9.05597 13.232 9.25556 13.1738 9.44026C13.1155 9.62496 12.9877 9.78164 12.815 9.88062L11.5165 11.1791C12.7099 13.2759 14.4426 15.0086 16.5393 16.202L17.8378 14.9035C17.9368 14.7308 18.0935 14.603 18.2782 14.5448C18.4629 14.4866 18.6625 14.502 18.8375 14.5875C19.2901 14.8033 19.7757 14.9563 20.2794 15.041C20.6728 15.1091 20.9634 15.4449 20.9634 15.8427V16.92H22Z" fill="white" />
                </svg>
                <span className="text-[17px] font-bold">{firstPhone}</span>
              </div>
            </div>

            <div className="space-y-4 pt-1 lg:pt-3">
              <Link to="/privacy-policy" className="text-[13px] border-b border-white pb-[1px] hover:text-cyan-400 hover:border-cyan-400 transition-all font-semibold inline-block uppercase tracking-wider">Privacy Policy</Link>

              <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('facebook'))?.link || '#'} className="hover:text-cyan-400 transition-colors"><Facebook className="w-5 h-5 fill-current" /></a>
                <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('twitter') || l.name.toLowerCase().includes('x'))?.link || '#'} className="hover:text-cyan-400 transition-colors">
                  {/* X (Twitter) Logo icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3174 10.7749L21.1143 1.76465H19.2687L12.5025 9.58434L7.10098 1.76465H0.880859L9.05711 13.627L0.880859 23.1316H2.72661L9.89437 14.8466L15.5861 23.1316H21.8062L13.317 10.7749H13.3174ZM10.8252 13.7712L9.99849 12.585L3.39169 3.0983H6.22359L11.5546 10.7423L12.3813 11.9285L19.3364 21.9161H16.5045L10.8252 13.7716V13.7712Z" fill="white" />
                  </svg>
                </a>
                <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('youtube'))?.link || '#'} className="hover:text-cyan-400 transition-colors"><Youtube className="w-[22px] h-[22px] fill-current" /></a>
                <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('instagram'))?.link || '#'} className="hover:text-cyan-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('linkedin'))?.link || '#'} className="hover:text-cyan-400 transition-colors"><Linkedin className="w-5 h-5 fill-current" /></a>
              </div>
            </div>
          </div>

          {/* Middle Column: Logo block & Button */}
          <div className="flex-none flex flex-col items-center justify-center text-center space-y-4 z-10 w-[240px]">
            <Link to="/">
              <img
                src="/navbar-logo.png"
                alt="MediPark Hospital"
                className="h-[70px] md:h-[90px] w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                  target.className = "h-[70px] md:h-[90px] w-auto object-contain brightness-0 invert"; // fallback to white logic
                }}
              />
            </Link>
            <p className="text-[13px] font-semibold tracking-wide text-gray-300">Transforming Healthcare</p>
            <div className="pt-3">
              <Link to="/contact" className="inline-flex items-center justify-center bg-[#49C5ED] hover:bg-[#3fb0d4] text-white font-bold text-sm px-8 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(73,197,237,0.4)] tracking-wide">
                Send Query
              </Link>
            </div>
          </div>

          {/* Right Column: Address */}
          <div className="flex-1 w-full max-w-sm flex flex-col justify-start items-center lg:items-start text-center lg:text-left space-y-4 pt-4 lg:pt-4 z-10">
            <h3 className="text-[15px] font-bold tracking-wide">Dhaka</h3>
            <p className="text-[13px] font-semibold text-gray-200 lg:max-w-[280px] leading-relaxed">
              MediPark Hospital Dhaka, Plot # 81, Block-E,<br className="hidden lg:block" />
              Bashundhara R/A, Dhaka 1229, Bangladesh.
            </p>
            <div className="pt-8 lg:pt-14">
              <p className="text-xs font-semibold text-white/80 tracking-wide">
                © Copyright {currentYear} mediparkbd. All rights reserved.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Nav Links */}
        <div className="w-full mt-16 md:mt-24 relative z-20">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[13px] font-bold tracking-wide text-white">
            <Link to="/doctors" className="hover:text-cyan-400 transition-colors py-1">Find a Doctor</Link>
            <Link to="/appointment" className="hover:text-cyan-400 transition-colors py-1">Request an Appointment</Link>
            <Link to="/report" className="hover:text-cyan-400 transition-colors py-1">Online Report</Link>
            <Link to="/careers" className="hover:text-cyan-400 transition-colors py-1">Career</Link>
            <Link to="/contacts" className="hover:text-cyan-400 transition-colors py-1">Contact Us</Link>
            <Link to="/speciality" className="hover:text-cyan-400 transition-colors py-1">Speciality</Link>
            <Link to="/health-package" className="hover:text-cyan-400 transition-colors py-1">Health Package</Link>
            <Link to="/news" className="hover:text-cyan-400 transition-colors py-1">News & Media</Link>
            <Link to="/blogs" className="hover:text-cyan-400 transition-colors py-1">Blogs</Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors py-1">About Us</Link>
          </nav>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[13px] font-bold tracking-wide mt-2 text-white">
            <Link to="/patient-stories" className="hover:text-cyan-400 transition-colors py-1">Patient Stories</Link>
            <Link to="/pulse-magazine" className="hover:text-cyan-400 transition-colors py-1">Pulse Magazine</Link>
            <Link to="/tele-online" className="hover:text-cyan-400 transition-colors py-1">Tele Online</Link>
            <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors py-1">Privacy Policy</Link>
            <Link to="/visitors/guide" className="hover:text-cyan-400 transition-colors py-1">Patient & Visitor Guide</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}
