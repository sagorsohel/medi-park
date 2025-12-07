"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface AwardCertificate {
  id: number;
  title: string;
  recipient: string;
  description: string;
  date: string;
  image?: string;
}

interface AwardCarouselSectionProps {
  title: string;
  text: string;
  certificates: AwardCertificate[];
}

export function AwardCarouselSection({ title, text, certificates }: AwardCarouselSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-slide functionality
  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {title}
          </h2>
        </div>

        {/* Text */}
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
            {text}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {certificates.map((certificate, index) => (
                <CarouselItem key={certificate.id} className="pl-2 md:pl-4 basis-3/5">
                  <Card
                    className={cn(
                      "!P-0 border-0   transition-all duration-500",
                      {
                        "opacity-30": index !== current - 1,
                      }
                    )}
                  >
                    <CardContent className="p-0">
                      {/* Certificate Image */}
                      {certificate.image ? (
                        <img
                          src={certificate.image}
                          alt={certificate.title || `Certificate ${index + 1}`}
                          className="w-full h-auto object-contain rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      ) : (
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-lg">
                          {/* Fallback Certificate Content */}
                          <div className="text-center">
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 uppercase tracking-wide">
                                Certificate of
                              </p>
                              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Achievement
                              </h3>
                            </div>

                            <div className="my-6">
                              <p className="text-sm text-gray-500 mb-2">
                                This is proudly presented to
                              </p>
                              <h4 className="text-2xl md:text-3xl font-bold text-amber-700">
                                {certificate.recipient}
                              </h4>
                            </div>

                            <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                              {certificate.description}
                            </p>

                            <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-200">
                              <div className="text-left">
                                <p className="text-sm text-gray-500 italic mb-1">Signature</p>
                                <p className="text-xs text-gray-700">MANAGER, CTO</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Presented on</p>
                                <p className="text-sm font-bold text-gray-900">{certificate.date}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {certificates.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === current - 1
                    ? "bg-blue-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

