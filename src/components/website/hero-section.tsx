"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useGetHeroSectionsPublicQuery } from "@/services/homepageApi";
import { Loader2 } from "lucide-react";

export function HeroSection() {
  const { data, isLoading, error } = useGetHeroSectionsPublicQuery({}, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5000,
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const slidesLengthRef = useRef<number>(0);
  // console.log(data); // Debugging output removed

  // Filter and sort active hero sections
  const activeSlides = useMemo(() => {
    if (!data?.data) return [];
    const slidesArray = Array.isArray(data.data) ? data.data : [data.data];
    return slidesArray
      .filter((slide) => slide.status === 'active')
      .sort((a, b) => parseInt(a.serial) - parseInt(b.serial));
  }, [data]);

  // Update ref when slides change
  useEffect(() => {
    slidesLengthRef.current = activeSlides.length;
  }, [activeSlides.length]);

  // Auto-slide effect
  useEffect(() => {
    const slidesLength = activeSlides.length;

    // Don't auto-slide if less than 2 slides
    if (slidesLength <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const length = slidesLengthRef.current;
        if (length === 0) return 0;
        // Ensure index is valid before incrementing
        const safeIndex = prevIndex >= length ? 0 : prevIndex;
        return (safeIndex + 1) % length;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  // Ensure currentIndex is valid
  const validIndex = activeSlides.length > 0
    ? Math.min(currentIndex, activeSlides.length - 1)
    : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error state or no slides
  if (error || activeSlides.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500">No hero sections available</p>
        </div>
      </div>
    );
  }

  const currentSlide = activeSlides[validIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images with Auto-Slider */}
      <div className="absolute inset-0">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === validIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={slide.background_image}
              alt={slide.title || `Hero ${index + 1}`}
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
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Hero Text - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
              {currentSlide.title || "Trusted Medical Care"}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-normal">
              {currentSlide.subtitle || "Personalized Results"}
            </p>
          </div>
        </div>

        {/* Call-to-Action Buttons - Bottom */}
        {/* <div className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {ctaButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <Button
                  key={index}
                  asChild
                  className="bg-primary-foreground/30 hover:bg-primary-foreground/30 text-white border border-primary-foreground/30 rounded-[38.34px] px-4 py-3 md:px-8 md:py-6 backdrop-blur-sm transition-all"
                >
                  <a href={button.link} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-sm md:text-base font-medium whitespace-nowrap">
                      {button.label}
                    </span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div> */}
      </div>

      {/* Slider Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === validIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

