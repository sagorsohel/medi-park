"use client";

interface PageHeroSectionProps {
  image: string;
  heading?: string;
  alt?: string;
}

export function PageHeroSection({ image, heading, alt = "Hero" }: PageHeroSectionProps) {
  return (
    <div className="relative w-full h-[calc(100vh-200px)] overflow-hidden">
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
        <div className="absolute inset-0 bg-gray-950/40" />
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

