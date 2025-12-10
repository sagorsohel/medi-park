"use client";

import { useGetTransformingHealthcareActiveQuery } from "@/services/aboutPageApi";
import { Loader2 } from "lucide-react";

export function TransformingHealthcareSection() {
  const { data, isLoading, error } = useGetTransformingHealthcareActiveQuery();

  if (isLoading) {
    return (
      <div className="w-full bg-secondary/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return null;
  }

  const section = data.data;
  const images = [section.image_1, section.image_2, section.image_3, section.image_4].filter(
    (img) => img,
  ) as string[];

  return (
    <div className="w-full bg-secondary/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            {section.title}
          </h2>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
            {images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={image}
                  alt={`${section.title} ${index + 1}`}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Descriptive Paragraph */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-primary leading-relaxed text-justify">
            {section.paragraph}
          </p>
        </div>
      </div>
    </div>
  );
}

