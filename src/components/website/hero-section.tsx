"use client";

import { useState, useEffect } from "react";
import { User, Calendar, FileText, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImages = [
  "/hero1.png",
  "/hero2.png",
  "/hero3.png",
  "/hero4.png",
];

const ctaButtons = [
  {
    label: "Find a doctor",
    icon: User,
    link: "#",
  },
  {
    label: "Request an appointment",
    icon: Calendar,
    link: "#",
  },
  {
    label: "Online report",
    icon: FileText,
    link: "#",
  },
  {
    label: "Online consult",
    icon: Phone,
    link: "#",
  },
  {
    label: "Patient & visitors guide",
    icon: Users,
    link: "#",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images with Auto-Slider */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover "
            />
            {/* Blue gradient overlay */}
            <div className="absolute inset-0 bg-gray-950/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Hero Text - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
              Trusted Medical Care
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-normal">
              Personalized Results
            </p>
          </div>
        </div>

        {/* Call-to-Action Buttons - Bottom */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {ctaButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <Button
                  key={index}
                  asChild
                  className="bg-[#FAFAFA4D] hover:bg-[#FAFAFA4D] text-white border border-[#FAFAFA4D] rounded-[38.34px] px-4 py-3 md:px-8 md:py-6 backdrop-blur-sm transition-all"
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
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

