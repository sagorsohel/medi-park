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
    {
      icon: Stethoscope,
      label: "FIND A DOCTOR",
      href: "/doctors",
      bgClass: "bg-blue-50/60 hover:bg-blue-100/80",
      textClass: "text-[#1e3a5f] group-hover:text-blue-700",
      iconClass: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
    },
    {
      icon: CalendarDays,
      label: "REQUEST AN APPOINTMENT",
      href: "/appointment",
      bgClass: "bg-emerald-50/60 hover:bg-emerald-100/80",
      textClass: "text-[#1e3a5f] group-hover:text-emerald-700",
      iconClass: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
    },
    {
      icon: FileText,
      label: "ONLINE REPORT",
      href: "/reports",
      bgClass: "bg-purple-50/60 hover:bg-purple-100/80",
      textClass: "text-[#1e3a5f] group-hover:text-purple-700",
      iconClass: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
    },
    {
      icon: Headset,
      label: "TELE-ONLINE",
      href: "/telemedicine",
      bgClass: "bg-amber-50/60 hover:bg-amber-100/80",
      textClass: "text-[#1e3a5f] group-hover:text-amber-700",
      iconClass: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
    },
    {
      icon: Users,
      label: "PATIENT & VISITORS GUIDE",
      href: "/guide",
      bgClass: "bg-rose-50/60 hover:bg-rose-100/80",
      textClass: "text-[#1e3a5f] group-hover:text-rose-700",
      iconClass: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
    },
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
        <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-3">
          <div className="bg-white/60 backdrop-blur-xl bg-linear-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 shadow-[0_-10px_40px_rgb(0,0,0,0.08)] md:rounded-t-2xl overflow-hidden border-t md:border-t md:border-x border-white/60">
            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/40 border-b border-white/40 md:border-none">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`
                     group flex items-center justify-between p-4 md:p-6 
                     ${link.bgClass} transition-all duration-300
                     ${index === quickLinks.length - 1 ? 'col-span-2 md:col-span-1 border-t border-white/40 md:border-t-0' : ''}
                   `}
                >
                  <span className={`text-xs md:text-sm font-bold uppercase tracking-wide transition-colors ${link.textClass}`}>
                    {link.label}
                  </span>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex shrink-0 items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm border border-white/50 ${link.iconClass}`}>
                    <link.icon className="w-5 h-5 md:w-6 md:h-6" />
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

