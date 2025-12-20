"use client";

import { useMemo, useState } from "react";
import { useGetHeroSectionsPublicQuery } from "@/services/homepageApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, type Variants, AnimatePresence } from "framer-motion";

// Import Swiper styles
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/effect-fade";
// @ts-expect-error - CSS imports don't have type declarations
import "swiper/css/pagination";

export function HeroSection() {
  const { data, isLoading,  } = useGetHeroSectionsPublicQuery();
  console.log("hero section data", data);
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation variants for text content (defined early for use in loading state)
  const textVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      y: -50,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.7,
        ease: "easeOut",
      },
    },
  };

  // Filter and sort active hero sections
  const activeSlides = useMemo(() => {
    if (!data?.data) return [];
    const slidesArray = Array.isArray(data.data) ? data.data : [data.data];
    return slidesArray
      .filter((slide) => slide.status === 'active')
      .sort((a, b) => parseInt(a.serial) - parseInt(b.serial));
  }, [data]);

  // Show skeleton while loading (first time) with relatable content
  if (isLoading && activeSlides.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-900">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-primary">
          <img
            src="/heroloader.webp"
            alt="MediPark Hospital"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Hide image if it doesn't load, gradient background will show
              target.style.display = 'none';
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gray-950" style={{ opacity: 0.5 }} />
        </div>

        {/* Loading Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col h-full pointer-events-none">
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                variants={titleVariants}
              >
                MediPark Specialized Hospital
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl text-white font-normal"
                variants={subtitleVariants}
              >
                Trusted Medical Care for Your Family
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Subtle loading indicator */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  // Only render if we have cached data
  if (activeSlides.length === 0) {
    return null;
  }

  const currentSlide = activeSlides[activeIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={activeSlides.length > 1}
        speed={1000}
        className="h-full w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {activeSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img
                src={slide.background_image}
                alt={slide.title || "Hero"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
              {/* Dynamic overlay with opacity from API */}
              <div
                className="absolute inset-0 bg-gray-950"
                style={{ opacity: `${parseFloat(slide.opacity) * 100}%` }}
              />
          </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content - Animated Text Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col h-full pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="text-center"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textVariants}
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
                variants={titleVariants}
              >
                {currentSlide.title || "Trusted Medical Care"}
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl text-white font-normal"
                variants={subtitleVariants}
              >
                {currentSlide.subtitle || "Personalized Results"}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

      {/* Custom Pagination Styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .swiper-pagination {
            bottom: 96px !important;
          }
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0.5);
            margin: 0 4px;
            border-radius: 50%;
            transition: all 0.3s;
          }
          .swiper-pagination-bullet-active {
            width: 32px;
            border-radius: 4px;
            background: white;
          }
        `
      }} />
    </div>
  );
}

