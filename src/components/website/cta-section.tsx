"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <div className="w-full bg-blue-900 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          {/* Left Side - Text */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ask Medipark</h2>
            <p className="text-lg text-blue-200">
              Looking for world class care, we are here to support you.
            </p>
          </div>

          {/* Right Side - Button */}
          <Button
            className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-[40px] whitespace-nowrap"
          >
            Send Query
          </Button>
        </div>
      </div>
    </div>
  );
}

