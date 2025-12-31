"use client";

import { NavLink, Link } from "react-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Menu,  ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
 
} from "@/components/ui/dropdown-menu";
import { useGetFacilitiesPublicQuery } from "@/services/homepageApi";
import { useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About us" },
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
  const { data: facilitiesData } = useGetFacilitiesPublicQuery();
  const { data: futureVenturesData } = useGetFutureVenturesPublicQuery(1);
  
  const activeFacilities = facilitiesData?.data?.filter(f => f.status === 'active') || [];
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
          {navLinks.map((link) => (
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
          ))}
          
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
                <div className="flex items-center justify-between mb-4">
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
              align="end" 
              className="max-h-[600px] overflow-y-auto w-[600px] max-w-none mt-5 p-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
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
                <div className="flex items-center justify-between mb-6">
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
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
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
                  ))}
                  
                  {/* Facilities in Mobile Menu */}
                  <div className="pl-4">
                    <Link
                      to="/facilities"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium transition-colors text-muted-foreground hover:text-primary"
                    >
                      Departments
                    </Link>
                    {activeFacilities.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2">
                        {activeFacilities.slice(0, 10).map((facility) => (
                          <Link
                            key={facility.id}
                            to={`/facilities/${facility.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {facility.title}
                          </Link>
                        ))}
                        {activeFacilities.length > 10 && (
                          <Link
                            to="/facilities"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-primary font-semibold"
                          >
                            View All ({activeFacilities.length})
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Future Ventures in Mobile Menu */}
                  <div className="pl-4 pt-4 border-t">
                    <Link
                      to="/future-ventures"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium transition-colors text-muted-foreground hover:text-primary"
                    >
                      Future Ventures
                    </Link>
                    {activeFutureVentures.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2">
                        {activeFutureVentures.slice(0, 10).map((venture) => (
                          <Link
                            key={venture.id}
                            to={`/future-ventures/${venture.id}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {venture.title}
                          </Link>
                        ))}
                        {activeFutureVentures.length > 10 && (
                          <Link
                            to="/future-ventures"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm text-primary font-semibold"
                          >
                            View All ({activeFutureVentures.length})
                          </Link>
                        )}
                      </div>
                    )}
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

