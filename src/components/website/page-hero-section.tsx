"use client";

interface PageHeroSectionProps {
  image: string;
  alt?: string;
}

export function PageHeroSection({ image, alt = "Hero" }: PageHeroSectionProps) {
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
    </div>
  );
}

