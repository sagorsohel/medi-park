"use client";

import { useGetWhoWeAreActiveQuery } from "@/services/aboutPageApi";
import { Loader2 } from "lucide-react";

export function WhoWeAreSection() {
  const { data, isLoading, error } = useGetWhoWeAreActiveQuery();
  const record = data?.data;

  if (isLoading) {
    return (
      <div className="relative w-full bg-primary py-16 md:py-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/80" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="relative w-full bg-primary py-16 md:py-24 flex items-center justify-center">
        <p className="text-white/80">Who We Are section not available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Cards - Above Heading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {[record.image_1, record.image_2, record.image_3].map((img, idx) => (
            <div key={idx} className="relative group flex justify-center">
              <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                {img ? (
                  <img
                    src={img}
                    alt={`Who we are ${idx + 1}`}
                    className="w-full h-auto object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-gray-400 bg-gray-50">
                    No image
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Who We Are Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {record.title || "Who We Are"}
          </h1>
        </div>

        {/* Text Block */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-white leading-relaxed text-center">
            {record.paragraph || ""}
          </p>
        </div>
      </div>
    </div>
  );
}