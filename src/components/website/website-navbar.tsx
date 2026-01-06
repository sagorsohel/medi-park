"use client";

import { NavLink, Link } from "react-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useGetFacilitiesPublicQuery, useGetSpecializedFacilitiesPublicQuery } from "@/services/homepageApi";
import { useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/mission-vision", label: "Mission & Vision" },
  { to: "/gellery", label: "Gallery" },
  // { to: "/careers", label: "Careers" },
  { to: "/news", label: "News" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contacts", label: "Contacts" },
];

export function WebsiteNavbar() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [departmentsOpen, setDepartmentsOpen] = useState<boolean>(false);
  const [specializedDepartmentsOpen, setSpecializedDepartmentsOpen] = useState<boolean>(false);
  const [futureVenturesOpen, setFutureVenturesOpen] = useState<boolean>(false);
  const { data: facilitiesData } = useGetFacilitiesPublicQuery();
  const { data: specializedFacilitiesData } = useGetSpecializedFacilitiesPublicQuery();
  const { data: futureVenturesData } = useGetFutureVenturesPublicQuery(1);

  const activeFacilities = facilitiesData?.data?.filter(f => f.status === 'active') || [];
  const activeSpecializedFacilities = specializedFacilitiesData?.data?.filter(f => f.status === 'active') || [];
  const activeFutureVentures = futureVenturesData?.data?.filter(f => f.status === 'active') || [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full sm:max-w-8xl px-4 sm:px-6 lg:px-8">
      {/* Main Navbar Container - Pill Shaped with Glassmorphism */}
      <div className={`w-full  sm:px-4 py-3 flex items-center justify-between  transition-all duration-300 ${isScrolled ? 'bg-primary/40 px-3 backdrop-blur-sm border border-primary-foreground/30   rounded-full ' : ''
        }`}>
        {/* Logo Section - Pill Container */}
        <NavLink to="/" className="flex items-center">
          <div className="flex items-center gap-2 border border-primary-foreground/50 rounded-full px-4 py-2 bg-white backdrop-blur-sm">
            <div className="   flex  justify-center md:w-[133px]">
              <img
                src="/navbar-logo.png"
                alt="MediPark Logo"
                className="md:h-[30px] sm:h-6 w-auto px-5 sm:px-0 h-6 object-cover sm:w-auto sm:object-cover flex justify-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </div>
            {/* <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-white leading-tight">
                MediPark
              </span>
              <span className="text-xs text-white/90 leading-tight hidden sm:block">
                Specialized Hospital
              </span>
            </div> */}
          </div>
        </NavLink>

        {/* Desktop Navigation - Center */}
        <nav className={`hidden bg-white backdrop-blur-md border px-4 py-4 border-primary-foreground/30 rounded-full lg:flex items-center gap-4 xl:gap-6 ${isScrolled ? 'bg-blue-500' : 'bg-white'}`}>
          {navLinks.map((link) => {
            if (link.label === "About Us") {
              return (
                <DropdownMenu key={link.to}>
                  <DropdownMenuTrigger className="text-sm font-medium transition-colors whitespace-nowrap text-primary hover:text-primary focus:outline-none flex items-center gap-1">
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px] mt-2">
                    <DropdownMenuItem asChild>
                      <Link to="/about" className="cursor-pointer w-full font-medium">About MSH</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/about/message-of-chairman" className="cursor-pointer w-full font-medium">Message of Chairman</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/about/message-of-managing-director" className="cursor-pointer w-full font-medium">Message of Managing Director</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors whitespace-nowrap ${isActive
                    ? "text-[#D83072] font-semibold"
                    : "text-primary hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}

          {/* Facilities Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium transition-colors whitespace-nowrap text-primary hover:text-primary focus:outline-none flex items-center gap-1">
              Departments
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="max-h-[600px] overflow-y-auto w-[600px] max-w-none mt-5 p-4  -left-[225px]!"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
                  <h3 className="text-lg font-bold text-primary">Our Departments</h3>
                  <Link
                    to="/facilities"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View All Departments
                  </Link>
                </div>
                {activeFacilities.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {activeFacilities.map((facility) => (
                      <DropdownMenuItem key={facility.id} asChild className="p-0">
                        <Link
                          to={`/facilities/${facility.id}`}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded cursor-pointer transition-colors whitespace-normal"
                        >
                          {facility.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-2 text-sm text-gray-500">No facilities available</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Specialized Departments Dropdown */}
          {activeSpecializedFacilities.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors whitespace-nowrap text-primary hover:text-primary focus:outline-none flex items-center gap-1">
                Specialized Departments
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="max-h-[600px] overflow-y-auto w-[600px] max-w-none mt-5 p-4  -left-[225px]!"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
                    <h3 className="text-lg font-bold text-primary">Specialized Departments</h3>
                    <Link
                      to="/facilities?is_specialized=true"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      View All Specialized
                    </Link>
                  </div>
                  {activeSpecializedFacilities.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {activeSpecializedFacilities.map((facility) => (
                        <DropdownMenuItem key={facility.id} asChild className="p-0">
                          <Link
                            to={`/facilities/${facility.id}`}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded cursor-pointer transition-colors whitespace-normal"
                          >
                            {facility.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">No specialized departments available</p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 border border-primary-foreground/50 rounded-full p-1">
          {/* Future Ventures Dropdown - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex text-sm font-medium transition-colors whitespace-nowrap text-primary hover:text-primary focus:outline-none items-center gap-1 border border-primary-foreground/50 bg-white backdrop-blur-sm hover:bg-primary-foreground/20 rounded-full px-6 py-2">
              Future Ventures
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="max-h-[600px] overflow-y-auto w-[600px] max-w-none mt-5 p-4  -left-[225px]!"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
                  <h3 className="text-lg font-bold text-primary">Future Ventures</h3>
                  <Link
                    to="/future-ventures"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>
                {activeFutureVentures.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {activeFutureVentures.map((venture) => (
                      <DropdownMenuItem key={venture.id} asChild className="p-0">
                        <Link
                          to={`/future-ventures/${venture.id}`}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded cursor-pointer transition-colors whitespace-normal"
                        >
                          {venture.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-2 text-sm text-gray-500">No future ventures available</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-primary-foreground border border-primary-foreground/50 rounded-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4 bg-background/95 backdrop-blur-md">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <div className="flex items-center gap-2">
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
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button> */}
                </div>
                <nav className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
                  {navLinks.map((link) => {
                    if (link.label === "About Us") {
                      return (
                        <div key={link.to} className="pl-4">
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium transition-colors text-muted-foreground hover:text-primary py-1">
                              <span>{link.label}</span>
                              <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                              <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-100 pl-4">
                                <Link
                                  to="/about"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                >
                                  About MSH
                                </Link>
                                <Link
                                  to="/about/message-of-chairman"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                >
                                  Message of Chairman
                                </Link>
                                <Link
                                  to="/about/message-of-managing-director"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                >
                                  Message of Managing Director
                                </Link>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      );
                    }

                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-base font-medium transition-colors ${isActive
                            ? "text-primary border-l-4 border-primary pl-4"
                            : "text-muted-foreground hover:text-primary pl-4"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    );
                  })}

                  {/* Future Ventures Direct Link in Mobile Menu */}
                  {activeFutureVentures.length > 0 && (
                    <NavLink
                      to="/future-ventures"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-base font-medium transition-colors ${isActive
                          ? "text-primary border-l-4 border-primary pl-4"
                          : "text-muted-foreground hover:text-primary pl-4"
                        }`
                      }
                    >
                      Future Ventures
                    </NavLink>
                  )}

                  {/* Facilities in Mobile Menu */}
                  <div className="pl-4">
                    <Collapsible open={departmentsOpen} onOpenChange={setDepartmentsOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium transition-colors text-muted-foreground hover:text-primary">
                        <span>Departments</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${departmentsOpen ? 'transform rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        {activeFacilities.length > 0 ? (
                          <div className="mt-2 ml-4 space-y-2 max-h-[300px] overflow-y-auto">
                            {activeFacilities.map((facility) => (
                              <Link
                                key={facility.id}
                                to={`/facilities/${facility.id}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                              >
                                {facility.title}
                              </Link>
                            ))}
                            <Link
                              to="/facilities"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-sm text-primary font-semibold py-1"
                            >
                              View All ({activeFacilities.length})
                            </Link>
                          </div>
                        ) : (
                          <p className="mt-2 ml-4 text-sm text-gray-500">No departments available</p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  {/* Specialized Departments in Mobile Menu */}
                  {activeSpecializedFacilities.length > 0 && (
                    <div className="pl-4 pt-4 border-t">
                      <Collapsible open={specializedDepartmentsOpen} onOpenChange={setSpecializedDepartmentsOpen}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium transition-colors text-muted-foreground hover:text-primary">
                          <span>Specialized Departments</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${specializedDepartmentsOpen ? 'transform rotate-180' : ''}`} />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          {activeSpecializedFacilities.length > 0 ? (
                            <div className="mt-2 ml-4 space-y-2 max-h-[300px] overflow-y-auto">
                              {activeSpecializedFacilities.map((facility) => (
                                <Link
                                  key={facility.id}
                                  to={`/facilities/${facility.id}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                                >
                                  {facility.title}
                                </Link>
                              ))}
                              <Link
                                to="/facilities?is_specialized=true"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm text-primary font-semibold py-1"
                              >
                                View All ({activeSpecializedFacilities.length})
                              </Link>
                            </div>
                          ) : (
                            <p className="mt-2 ml-4 text-sm text-gray-500">No specialized departments available</p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                  {/* Future Ventures in Mobile Menu */}
                  <div className="pl-4 pt-4 border-t">
                    <Collapsible open={futureVenturesOpen} onOpenChange={setFutureVenturesOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-base font-medium transition-colors text-muted-foreground hover:text-primary">
                        <span>Future Ventures</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${futureVenturesOpen ? 'transform rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        {activeFutureVentures.length > 0 ? (
                          <div className="mt-2 ml-4 space-y-2 max-h-[300px] overflow-y-auto">
                            {activeFutureVentures.map((venture) => (
                              <Link
                                key={venture.id}
                                to={`/future-ventures/${venture.id}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                              >
                                {venture.title}
                              </Link>
                            ))}
                            <Link
                              to="/future-ventures"
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-sm text-primary font-semibold py-1"
                            >
                              View All ({activeFutureVentures.length})
                            </Link>
                          </div>
                        ) : (
                          <p className="mt-2 ml-4 text-sm text-gray-500">No future ventures available</p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                  {isAuthenticated && (
                    <div className="pt-4 border-t">
                      <span className="text-sm text-muted-foreground block mb-2">
                        Hi, {user?.name ?? "Guest"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

