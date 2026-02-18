"use client";

import { useMemo, useState } from "react";
import { useGetHeroSectionsPublicQuery } from "@/services/homepageApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  Stethoscope,
  CalendarDays,
  FileText,
  Headset,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router";

// Import Swiper styles
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/pagination";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/navigation";

export function HeroSection() {
  const { data, isLoading } = useGetHeroSectionsPublicQuery();
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter and sort active hero sections
  const activeSlides = useMemo(() => {
    if (!data?.data) return [];
    const slidesArray = Array.isArray(data.data) ? data.data : [data.data];
    return slidesArray
      .filter((slide) => slide.status === 'active')
      .sort((a, b) => parseInt(a.serial) - parseInt(b.serial));
  }, [data]);

  // Loading state
  if (isLoading && activeSlides.length === 0) {
    return (
      <div className="relative w-full h-[600px] md:h-[calc(100vh-80px)] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    );
  }

  // Only render if we have cached data
  if (activeSlides.length === 0) {
    return null;
  }

  const quickLinks = [
    { icon: Stethoscope, label: "FIND A DOCTOR", href: "/doctors" },
    { icon: CalendarDays, label: "REQUEST AN APPOINTMENT", href: "/appointment" },
    { icon: FileText, label: "ONLINE REPORT", href: "/reports" },
    { icon: Headset, label: "TELE-ONLINE", href: "/telemedicine" },
    { icon: Users, label: "PATIENT & VISITORS GUIDE", href: "/guide" },
  ];

  return (
    <div className="relative w-full h-[500px] md:h-[calc(100vh-80px)] overflow-hidden bg-white">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".hero-slide-next",
          prevEl: ".hero-slide-prev",
        }}
        loop={activeSlides.length > 1}
        speed={1000}
        className="h-full w-full group"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {activeSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img
                src={slide.background_image}
                alt={slide.title || "Hero Banner"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
              {/* Dynamic overlay with opacity from API */}
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: slide.opacity ? parseFloat(slide.opacity) : 0 }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="hero-slide-prev absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-white/40 bg-white/40 hover:bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all text-gray-800 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100">
        <ChevronLeft className="w-6 h-6" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button className="hero-slide-next absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 border-white/40 bg-white/40 hover:bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all text-gray-800 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100">
        <ChevronRight className="w-6 h-6" />
        <span className="sr-only">Next slide</span>
      </button>

      {/* Quick Access Bar - Overlapping bottom */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm shadow-xl md:rounded-t-lg overflow-hidden border-t md:border-t-0">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100 border-b border-gray-100 md:border-none">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`
                     group flex items-center justify-between p-4 md:p-6 
                     hover:bg-blue-50 transition-all duration-300
                     ${index === quickLinks.length - 1 ? 'col-span-2 md:col-span-1 border-t md:border-t-0' : ''}
                   `}
                >
                  <span className="text-xs md:text-sm font-bold text-[#1e3a5f] uppercase tracking-wide group-hover:text-primary">
                    {link.label}
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <link.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

