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
import { useGetHeadingsQuery } from "@/services/headingApi";
import { DynamicIcon } from "@/components/dynamic-icon";

// Import Swiper styles
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/pagination";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/navigation";

export function HeroSection() {
  const { data, isLoading } = useGetHeroSectionsPublicQuery();
  const { data: headingsData } = useGetHeadingsQuery();
  const headings = headingsData?.data;

  const [activeIndex, setActiveIndex] = useState(0);

  const quickLinks = useMemo(() => {
    const baseLinks = [
      {
        id: "one",
        icon: Stethoscope,
        label: "FIND A DOCTOR",
        href: "/doctors",
        bgClass: "bg-blue-50 hover:bg-blue-100/80",
        textClass: "text-[#1e3a5f] group-hover:text-blue-700",
        iconClass: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
      },
      {
        id: "two",
        icon: CalendarDays,
        label: "REQUEST AN APPOINTMENT",
        href: "/appointment",
        bgClass: "bg-emerald-50 hover:bg-emerald-100/80",
        textClass: "text-[#1e3a5f] group-hover:text-emerald-700",
        iconClass: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
      },
      {
        id: "three",
        icon: FileText,
        label: "ONLINE REPORT",
        href: "/reports",
        bgClass: "bg-purple-50 hover:bg-purple-100/80",
        textClass: "text-[#1e3a5f] group-hover:text-purple-700",
        iconClass: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
      },
      {
        id: "four",
        icon: Headset,
        label: "TELE-ONLINE",
        href: "/telemedicine",
        bgClass: "bg-amber-50 hover:bg-amber-100/80",
        textClass: "text-[#1e3a5f] group-hover:text-amber-700",
        iconClass: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
      },
      {
        id: "five",
        icon: Users,
        label: "PATIENT & VISITORS GUIDE",
        href: "/guide",
        bgClass: "bg-rose-50 hover:bg-rose-100/80",
        textClass: "text-[#1e3a5f] group-hover:text-rose-700",
        iconClass: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
      },
    ];

    return baseLinks.map(link => {
      const apiTitle = (headings as any)?.[`homepage_hero_section_card_${link.id}_title`];
      const apiIcon = (headings as any)?.[`homepage_hero_section_card_${link.id}_icon`];

      return {
        ...link,
        label: apiTitle || link.label,
        icon: apiIcon || link.icon
      };
    });
  }, [headings]);

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

  return (
    <div className="relative w-full h-auto md:h-[calc(100vh-80px)] overflow-hidden bg-white">
      <div className="h-[400px] md:h-full relative">
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
          {activeSlides.map((slide) => {
            const isVideo = (slide.background_image?.toString() || '').match(/\.(mp4|webm|ogg)$/i);
            return (
              <SwiperSlide key={slide.id} data-swiper-autoplay={isVideo ? 30000 : 5000}>
                <div className="relative w-full h-full">
                  {(slide.background_image?.toString() || '').match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={slide.background_image}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={slide.background_image}
                      alt={slide.title || "Hero Banner"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  )}
                  {/* Dynamic overlay with opacity from API */}
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: slide.opacity ? parseFloat(slide.opacity) : 0 }}
                  />
                </div>
              </SwiperSlide>
            );
          })}
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
      </div>

      {/* Quick Access Bar - Under hero on mobile, Overlapping on desktop */}
      <div className="md:absolute md:bottom-0 md:left-0 w-full z-20 bg-white md:bg-transparent py-6 md:py-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-3">
          <div className="overflow-hidden md:mb-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`
                     group flex items-center rounded-xl justify-between p-5 md:p-6 
                     ${link.bgClass} shadow-sm md:shadow-md border border-white/50 transition-all duration-300 transform md:hover:-translate-y-1
                   `}
                >
                  <span className={`text-[13px] md:text-sm font-bold uppercase tracking-wider transition-colors ${link.textClass}`}>
                    {link.label}
                  </span>
                  <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex shrink-0 items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm border border-white/50 ${link.iconClass}`}>
                    {typeof link.icon === 'string' ? (
                      <DynamicIcon name={link.icon} className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <link.icon className="w-5 h-5 md:w-6 md:h-6" />
                    )}
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

