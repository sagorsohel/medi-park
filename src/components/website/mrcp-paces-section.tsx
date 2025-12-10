"use client";

import { useGetMRCPPACESActiveQuery } from "@/services/aboutPageApi";
import { Loader2 } from "lucide-react";

export function MRCPPACESSection() {
  const { data, isLoading, error } = useGetMRCPPACESActiveQuery();

  if (isLoading) {
    return (
      <div className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-0">
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

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-start">
          {/* Right Side - Large Image */}
          <div className="flex justify-center gap-5">
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 w-full max-w-lg">
              <img
                src={section.image}
                alt={section.title || "MRCP PACES"}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </div>
          {/* Left Side - Title and Text */}
          <div>
            {/* Subtitle */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 text-left">
              {section.title}
            </h2>

            {/* Descriptive Paragraph */}
            <div className="max-w-full">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                {section.paragraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

