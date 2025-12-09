"use client";

interface PageHeroSectionProps {
  image: string;
  heading?: string;
  alt?: string;
  overlayOpacity?: number;
}

export function PageHeroSection({ image, heading, alt = "Hero", overlayOpacity = 0.4 }: PageHeroSectionProps) {
  return (
    <div className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-gray-950"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Heading Overlay */}
      {heading && (
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center">
            {heading}
          </h1>
        </div>
      )}
    </div>
  );
}

import { useGetAboutUsBannerQuery } from "@/services/homepageApi";
import { Loader2 } from "lucide-react";

export function AboutUsPageHero() {
  const { data, isLoading } = useGetAboutUsBannerQuery();
  const banner = data?.data;

  if (isLoading) {
    return (
      <div className="w-full h-[250px] sm:h-[calc(100vh-200px)] flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!banner) return null;

  return (
    <PageHeroSection
      image={banner.background_image}
      heading="About Us"
      overlayOpacity={parseFloat(banner.opacity)}
    />
  );
}

