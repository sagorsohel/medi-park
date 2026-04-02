"use client";

import { NavLink, Link } from "react-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Facebook, Linkedin, Youtube, Phone, MessageCircle, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useState, useEffect, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetFacilitiesPublicQuery, useGetSpecializedFacilitiesPublicQuery } from "@/services/homepageApi";
import { useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";
import { useGetDirectorsQuery, type Director } from "@/services/directorApi";
import { useGetFooterContactQuery, useGetSocialLinksQuery } from "@/services/contactPageApi";
import { DynamicIcon } from "@/components/dynamic-icon";

export function WebsiteNavbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const { data: footerContactData } = useGetFooterContactQuery();
  const { data: socialLinksData } = useGetSocialLinksQuery(1);

  // Get active social links
  const activeSocialLinks = useMemo(() => {
    if (!socialLinksData?.data) return [];
    return socialLinksData.data.filter((link) => link.status === "active");
  }, [socialLinksData]);

  const footerContact = footerContactData?.data;
  const firstPhone = footerContact?.phone && footerContact.phone.length > 0 ? footerContact.phone[0] : "10633";

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [departmentsOpen, setDepartmentsOpen] = useState<boolean>(false);
  const [specializedDepartmentsOpen, setSpecializedDepartmentsOpen] = useState<boolean>(false);
  const [futureVenturesOpen, setFutureVenturesOpen] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [newsOpen, setNewsOpen] = useState<boolean>(false);
  const [visitorsOpen, setVisitorsOpen] = useState<boolean>(false);

  const { data: facilitiesData } = useGetFacilitiesPublicQuery();
  const { data: specializedFacilitiesData } = useGetSpecializedFacilitiesPublicQuery();
  const { data: futureVenturesData } = useGetFutureVenturesPublicQuery(1);
  const { data: directorsData } = useGetDirectorsQuery({ limit: 100 });

  const activeFacilities = facilitiesData?.data?.filter(f => f.status === 'active') || [];
  const activeSpecializedFacilities = specializedFacilitiesData?.data?.filter(f => f.status === 'active') || [];
  const activeFutureVentures = futureVenturesData?.data?.filter(f => f.status === 'active') || [];

  const directors = directorsData?.data || [];
  const keyDesignations = ["Chairman", "Managing Director", "Vice Chairman", "Deputy Managing Director"];
  const importantDirectors = directors.filter(d => keyDesignations.some(k => d.designation.includes(k) || k.includes(d.designation)));

  const sortedDirectors = [...importantDirectors].sort((a, b) => {
    const order = { "Chairman": 1, "Vice Chairman": 2, "Managing Director": 3, "Deputy Managing Director": 4 };
    const rankA = order[a.designation as keyof typeof order] || 99;
    const rankB = order[b.designation as keyof typeof order] || 99;
    return rankA - rankB;
  });

  const handleLogout = (): void => {
    dispatch(logout());
  };

  const getDirectorLink = (director: Director) => {
    const des = director.designation.toLowerCase();
    if (des.includes('chairman') && !des.includes('vice')) return "/about/message-of-chairman";
    if (des.includes('managing director') && !des.includes('deputy')) return "/about/message-of-managing-director";
    return `/about/board-of-directors/${director.id}`;
  };

  const getDirectorLabel = (director: Director) => {
    return `Message of ${director.designation}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-lg font-sans">
      {/* Top Black Bar */}
      <div className="bg-[#0B1B3D] text-white py-1.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center text-[13px] w-full border-b border-gray-700">
        <div className="flex items-center gap-5 mb-2 sm:mb-0">
          <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('facebook'))?.link || '#'} className="hover:text-primary transition-colors"><Facebook className="w-[14px] h-[14px] fill-current" /></a>
          <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('twitter') || l.name.toLowerCase().includes('x'))?.link || '#'} className="hover:text-primary transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3174 10.7749L21.1143 1.76465H19.2687L12.5025 9.58434L7.10098 1.76465H0.880859L9.05711 13.627L0.880859 23.1316H2.72661L9.89437 14.8466L15.5861 23.1316H21.8062L13.317 10.7749H13.3174ZM10.8252 13.7712L9.99849 12.585L3.39169 3.0983H6.22359L11.5546 10.7423L12.3813 11.9285L19.3364 21.9161H16.5045L10.8252 13.7716V13.7712Z" fill="currentColor" />
            </svg>
          </a>
          <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('instagram'))?.link || '#'} className="hover:text-primary transition-colors"><Instagram className="w-[14px] h-[14px]" /></a>
          <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('linkedin'))?.link || '#'} className="hover:text-primary transition-colors"><Linkedin className="w-[14px] h-[14px] fill-current" /></a>
          <a href={activeSocialLinks.find(l => l.name.toLowerCase().includes('youtube'))?.link || '#'} className="hover:text-primary transition-colors"><Youtube className="w-[14px] h-[14px] fill-current" /></a>
        </div>
        <div className="font-bold tracking-[0.1em] flex items-center gap-2 uppercase">
          [ Hotline - {firstPhone} ]
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-primary border-b-none sm:border-b-6 sm:border-primary flex items-stretch h-[65px] md:h-[75px] relative">
        {/* Logo Section Desktop */}
        <div
          className="bg-white items-center justify-center  relative z-10 hidden sm:flex"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)', width: '240px' }}
        >
          <Link to="/" className="flex items-center -ml-10">
            <img
              src="/navbar-logo.png"
              alt="MediPark Logo"
              className="h-10 md:h-[42px] w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
          </Link>
        </div>

        {/* Logo Section Mobile */}
        <div className="bg-white flex items-center px-4 sm:hidden z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] py-2">
          <Link to="/" className="flex items-center">
            <img
              src="/navbar-logo.png"
              alt="MediPark Logo"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 hidden lg:flex items-center justify-center xl:pl-3 pr-3 text-white text-[13px] font-bold tracking-wide h-full">
          <div className="flex items-stretch h-full gap-1 xl:gap-2 static">

            <NavLink
              to="/"
              className="h-full flex items-center px-1  whitespace-nowrap uppercase group/link"
            >
              {({ isActive }) => (
                <span className={`px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover/link:bg-black/10'}`}>
                  HOME
                </span>
              )}
            </NavLink>

            <div className="group flex items-stretch cursor-pointer relative">
              <NavLink
                to="/about"
                className="h-full flex items-center px-1 whitespace-nowrap uppercase"
              >
                {({ isActive }) => (
                  <span className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover:bg-black/10'}`}>
                    ABOUT US <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </span>
                )}
              </NavLink>
              <div className="absolute top-full left-0 w-[250px] bg-[#0B1B3D] text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-primary z-50">
                {/* About MSH with Submenu */}
                <div className="group/sub relative">
                  <Link 
                    to="/about" 
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-primary/10 hover:text-primary border-b border-gray-700/50 uppercase text-xs font-semibold transition-all"
                  >
                    About MSH
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 group-hover/sub:text-primary" />
                  </Link>
                  
                  {/* Nested Flyout for Messages */}
                  <div className="absolute left-[100%] top-0 w-[250px] bg-[#0B1B3D] border-l border-primary shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300">
                    {sortedDirectors.map(director => (
                      <Link 
                        key={director.id} 
                        to={getDirectorLink(director)} 
                        className="block px-5 py-3.5 hover:bg-primary/10 hover:text-primary border-b border-gray-700/50 uppercase text-xs font-semibold transition-all last:border-b-0"
                      >
                        {getDirectorLabel(director)}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/mission" className="block px-5 py-3.5 hover:bg-primary/10 hover:text-primary border-b border-gray-700/50 uppercase text-xs font-semibold transition-all">Mission</Link>
                <Link to="/vision" className="block px-5 py-3.5 hover:bg-primary/10 hover:text-primary border-b border-gray-700/50 uppercase text-xs font-semibold transition-all">Vision</Link>
                <Link to="/about" className="block px-5 py-3.5 hover:bg-primary/10 hover:text-primary uppercase text-xs font-semibold transition-all">Board of Directors</Link>
              </div>
            </div>

            {/* FIND DOCTORS */}
            {/* <Link to="/doctors" className="h-full flex items-center hover:text-white/80 transition-colors uppercase">
              FIND DOCTORS
            </Link> */}

            {/* DEPARTMENTS - FULL WIDTH MEGA MENU */}
            <div className="group static flex items-stretch cursor-pointer">
              <div className="h-full flex items-center px-1  whitespace-nowrap uppercase">
                <span className="flex items-center gap-1 px-3 py-2 rounded-md transition-all group-hover:bg-black/10">
                  DEPARTMENTS <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </span>
              </div>
              <div className="absolute top-full left-0 w-full bg-[#234687] text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-[3px] border-primary p-8 z-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-primary uppercase tracking-wide">Our Speciality Departments</h3>
                    <Link to="/facilities" className="text-[13px] font-bold text-white hover:text-primary hover:underline uppercase transition-colors">View All Departments</Link>
                  </div>
                  {activeFacilities.length > 0 ? (
                    <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                      {activeFacilities.map((facility) => (
                        <Link
                          key={facility.id}
                          to={`/facilities/${facility.id}`}
                          className="text-[13px] font-semibold text-white hover:text-[#00A884] transition-colors py-1.5 flex items-center gap-3 group/item"
                        >
                          {facility.icon ? (
                            <DynamicIcon
                              name={facility.icon}
                              className="w-6 h-6 text-gray-400 group-hover/item:text-primary transition-colors shrink-0"
                            />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-primary transition-colors shrink-0"></span>
                          )}
                          <span className="truncate">{facility.title}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No departments available at the moment.</p>
                  )}


                </div>
              </div>
            </div>

            {/* VISITORS AND PATIENTS */}
            <div className="group flex items-stretch cursor-pointer relative">
              <NavLink
                to="/services"
                className="h-full flex items-center px-1  whitespace-nowrap uppercase"
              >
                {({ isActive }) => (
                  <span className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover:bg-black/10'}`}>
                    VISITORS AND PATIENTS <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </span>
                )}
              </NavLink>
              <div className="absolute top-full left-0 w-[260px] bg-[#234687] text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-primary z-50">
                <Link to="/services" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Services</Link>
                <Link to="/facilities" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Facilities</Link>
                <Link to="/health-checkup" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Check Up</Link>
                <Link to="/packages" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Packages</Link>
                <Link to="/room-rent" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Room Rent</Link>
                <Link to="/equipments" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Equipments</Link>
                <Link to="/health-tips" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Tips</Link>
                <Link to="/visitors-policy" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Visitors Policy</Link>
                <Link to="/feedback" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary uppercase text-xs font-semibold transition-colors">Feedback</Link>
              </div>
            </div>

            {/* NEWS & MEDIA */}
            <div className="group flex items-stretch cursor-pointer relative">
              <NavLink
                to="/news"
                className="h-full flex items-center px-1  whitespace-nowrap uppercase"
              >
                {({ isActive }) => (
                  <span className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover:bg-black/10'}`}>
                    NEWS & MEDIA <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </span>
                )}
              </NavLink>
              <div className="absolute top-full left-0 w-[200px] bg-[#234687] text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-primary z-50">
                <Link to="/news" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">News</Link>
                <Link to="/gellery" className="block px-5 py-3.5 hover:bg-primary/5 hover:text-primary border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Gallery</Link>
                {/* <Link to="/health-insight" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Insight</Link> */}
              </div>
            </div>

            {/* CAREER */}
            <NavLink
              to="/health-insight"
              className="h-full flex items-center px-1  whitespace-nowrap uppercase group/link"
            >
              {({ isActive }) => (
                <span className={`px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover/link:bg-black/10'}`}>
                  Health Insight
                </span>
              )}
            </NavLink>
            <NavLink
              to="/careers"
              className="h-full flex items-center px-1  whitespace-nowrap uppercase group/link"
            >
              {({ isActive }) => (
                <span className={`px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover/link:bg-black/10'}`}>
                  CAREER
                </span>
              )}
            </NavLink>

            {/* CONTACT */}
            <NavLink
              to="/contacts"
              className="h-full flex items-center px-1  whitespace-nowrap uppercase group/link"
            >
              {({ isActive }) => (
                <span className={`px-3 py-2 rounded-md transition-all ${isActive ? 'bg-black/20' : 'group-hover/link:bg-black/10'}`}>
                  CONTACT
                </span>
              )}
            </NavLink>

          </div>
        </nav>

        {/* Live Chat Section Desktop */}
        <div
          className="bg-white items-center justify-center pl-10 pr-4 relative z-10 hidden lg:flex"
          style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)', width: '240px' }}
        >
          <a
            href="https://wa.me/8801805032998"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-all"
          >

            <div className="flex flex-col">
              <Button className="text-[10px] font-bold  uppercase leading-none">Live Chat</Button>

            </div>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex-1 lg:hidden flex justify-end items-center pr-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white rounded-md">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-white border-l-0 overflow-hidden flex flex-col">
              <div className="p-4 bg-primary text-white flex items-center justify-between shrink-0">
                <span className="font-bold tracking-wide uppercase">Menu</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                  HOME
                </Link>

                <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                    <span>ABOUT US</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-gray-50 border-b border-gray-100">
                    <div className="py-2 pl-4 flex flex-col">
                      <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">About MSH</Link>
                      <Link to="/mission" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Mission</Link>
                      <Link to="/vision" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Vision</Link>
                      {sortedDirectors.map(director => (
                        <Link key={director.id} to={getDirectorLink(director)} onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">
                          {getDirectorLabel(director)}
                        </Link>
                      ))}
                      <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Board of Directors</Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                  FIND DOCTORS
                </Link>

                <Collapsible open={departmentsOpen} onOpenChange={setDepartmentsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                    <span>DEPARTMENTS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${departmentsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-gray-50 border-b border-gray-100">
                    <div className="py-2 pl-4 flex flex-col max-h-[40vh] overflow-y-auto">
                      {activeFacilities.map((facility) => (
                        <Link
                          key={facility.id}
                          to={`/facilities/${facility.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2.5 text-sm font-semibold text-gray-600 flex items-center gap-3"
                        >
                          {facility.icon && (
                            <DynamicIcon name={facility.icon} className="w-6 h-6 text-gray-400" />
                          )}
                          {facility.title}
                        </Link>
                      ))}
                      <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-bold text-primary uppercase">View All Departments</Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={visitorsOpen} onOpenChange={setVisitorsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                    <span>VISITORS AND PATIENTS</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${visitorsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-gray-50 border-b border-gray-100">
                    <div className="py-2 pl-4 flex flex-col">
                      <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Services</Link>
                      <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Facilities</Link>
                      <Link to="/health-checkup" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Health Check Up</Link>
                      <Link to="/packages" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Packages</Link>
                      <Link to="/room-rent" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Room Rent</Link>
                      <Link to="/equipments" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Equipments</Link>
                      <Link to="/health-tips" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Health Tips</Link>
                      <Link to="/visitors-policy" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Visitors Policy</Link>
                      <Link to="/feedback" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Feedback</Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={newsOpen} onOpenChange={setNewsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                    <span>NEWS & MEDIA</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${newsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-gray-50 border-b border-gray-100">
                    <div className="py-2 pl-4 flex flex-col">
                      <Link to="/news" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">News</Link>
                      <Link to="/gellery" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Gallery</Link>
                      <Link to="/health-insight" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600 uppercase">Health Insight</Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Link to="/health-insight" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                  HEALTH INSIGHT
                </Link>

                <Link to="/careers" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[15px] font-bold text-gray-800 border-b border-gray-100 uppercase">
                  CAREER
                </Link>

                <Link to="/contacts" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[15px] font-bold text-gray-800 pb-8 uppercase">
                  CONTACT
                </Link>

                {isAuthenticated && (
                  <div className="pt-6 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-500 block mb-3">
                      Hi, {user?.name ?? "Guest"}
                    </span>
                    <Button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-md"
                    >
                      LOGOUT
                    </Button>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <a
                    href="https://wa.me/8801805032998"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-[#25D366]/10 rounded-lg hover:bg-[#25D366]/20 transition-all border border-[#25D366]/20"
                  >

                    <div className="flex flex-col">
                      <Button className="text-xs font-bold  uppercase">Live Chat</Button>

                    </div>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
