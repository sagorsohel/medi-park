"use client";

import { NavLink, Link } from "react-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Facebook, Linkedin, Youtube, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetFacilitiesPublicQuery, useGetSpecializedFacilitiesPublicQuery } from "@/services/homepageApi";
import { useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";
import { useGetDirectorsQuery, type Director } from "@/services/directorApi";

export function WebsiteNavbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
      <div className="bg-[#2D2D2D] text-white py-1.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center text-[13px] w-full border-b border-gray-700">
        <div className="flex items-center gap-5 mb-2 sm:mb-0">
          <a href="#" className="hover:text-[#00A884] transition-colors"><Facebook className="w-[14px] h-[14px] fill-current" /></a>
          <a href="#" className="hover:text-[#00A884] transition-colors"><Linkedin className="w-[14px] h-[14px] fill-current" /></a>
          <a href="#" className="hover:text-[#00A884] transition-colors"><Youtube className="w-[14px] h-[14px] fill-current" /></a>
        </div>
        <div className="font-bold tracking-[0.1em] flex items-center gap-2 uppercase">
          [ Hotline - 10633 ]
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full bg-[#00A884] flex items-stretch h-[65px] md:h-[75px] relative">
        {/* Logo Section Desktop */}
        <div
          className="bg-white flex items-center justify-center pl-4 pr-16 relative z-10 hidden sm:flex"
          style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)', width: '360px' }}
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
        <nav className="flex-1 hidden lg:flex items-center justify-end xl:justify-start xl:pl-6 pr-6 text-white text-[13px] font-bold tracking-wide">
          <div className="flex items-stretch h-full gap-5 xl:gap-8 static">

            <Link to="/" className="h-full flex items-center hover:text-white/80 transition-colors uppercase">
              HOME
            </Link>

            {/* ABOUT US */}
            <div className="group flex items-stretch cursor-pointer relative">
              <div className="h-full flex items-center gap-1 hover:text-white/80 transition-colors uppercase">
                ABOUT US <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full left-0 w-[250px] bg-white text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-[#00A884] z-50">
                <Link to="/about" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">About MSH</Link>
                <Link to="/mission" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Mission</Link>
                <Link to="/vision" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Vision</Link>
                {sortedDirectors.map(director => (
                  <Link key={director.id} to={getDirectorLink(director)} className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">
                    {getDirectorLabel(director)}
                  </Link>
                ))}
                <Link to="/about" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] uppercase text-xs font-semibold transition-colors">Board of Directors</Link>
              </div>
            </div>

            {/* FIND DOCTORS */}
            {/* <Link to="/doctors" className="h-full flex items-center hover:text-white/80 transition-colors uppercase">
              FIND DOCTORS
            </Link> */}

            {/* DEPARTMENTS - FULL WIDTH MEGA MENU */}
            <div className="group static flex items-stretch cursor-pointer">
              <div className="h-full flex items-center gap-1 hover:text-white/80 transition-colors uppercase">
                DEPARTMENTS <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full left-0 w-full bg-white text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t-[3px] border-[#00A884] p-8 z-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#00A884] uppercase tracking-wide">Our Departments</h3>
                    <Link to="/facilities" className="text-[13px] font-bold text-gray-500 hover:text-[#00A884] hover:underline uppercase transition-colors">View All Departments</Link>
                  </div>
                  {activeFacilities.length > 0 ? (
                    <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                      {activeFacilities.map((facility) => (
                        <Link
                          key={facility.id}
                          to={`/facilities/${facility.id}`}
                          className="text-[13px] font-semibold text-gray-600 hover:text-[#00A884] transition-colors py-1.5 flex items-center gap-2 group/item"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-[#00A884] transition-colors shrink-0"></span>
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
              <div className="h-full flex items-center gap-1 hover:text-white/80 transition-colors uppercase">
                VISITORS AND PATIENTS <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full left-0 w-[260px] bg-white text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-[#00A884] z-50">
                <Link to="/services" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Services</Link>
                <Link to="/facilities" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Facilities</Link>
                <Link to="/health-checkup" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Check Up</Link>
                <Link to="/packages" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Packages</Link>
                <Link to="/room-rent" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Room Rent</Link>
                <Link to="/equipments" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Equipments</Link>
                <Link to="/health-tips" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Tips</Link>
                <Link to="/visitors-policy" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Visitors Policy</Link>
                <Link to="/feedback" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] uppercase text-xs font-semibold transition-colors">Feedback</Link>
              </div>
            </div>

            {/* NEWS & MEDIA */}
            <div className="group flex items-stretch cursor-pointer relative">
              <div className="h-full flex items-center gap-1 hover:text-white/80 transition-colors uppercase">
                NEWS & MEDIA <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full left-0 w-[200px] bg-white text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top border-t-[3px] border-[#00A884] z-50">
                <Link to="/news" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">News</Link>
                <Link to="/gellery" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Gallery</Link>
                {/* <Link to="/health-insight" className="block px-5 py-3.5 hover:bg-[#00A884]/5 hover:text-[#00A884] border-b border-gray-100 uppercase text-xs font-semibold transition-colors">Health Insight</Link> */}
              </div>
            </div>

            {/* CAREER */}
            <Link to="/health-insight" className="h-full flex items-center hover:text-white/80 transition-colors uppercase">
              Health Insight
            </Link>
            <Link to="/careers" className="h-full flex items-center hover:text-white/80 transition-colors uppercase">
              CAREER
            </Link>

            {/* CONTACT */}
            <Link to="/contacts" className="h-full flex items-center hover:text-white/80 transition-colors uppercase pr-2">
              CONTACT
            </Link>

          </div>
        </nav>

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
              <div className="p-4 bg-[#00A884] text-white flex items-center justify-between shrink-0">
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
                        <Link key={facility.id} to={`/facilities/${facility.id}`} onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-semibold text-gray-600">
                          {facility.title}
                        </Link>
                      ))}
                      <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-bold text-[#00A884] uppercase">View All Departments</Link>
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
                      className="w-full bg-[#00A884] hover:bg-[#00A884]/90 text-white rounded-md"
                    >
                      LOGOUT
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
