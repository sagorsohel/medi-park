"use client";

import { Skeleton } from "@/components/ui/skeleton";


interface InvestorCardProps {
  image: string;
  name: string;
  designation: string;
  description: string;
  district?: string;
}

export function InvestorCard({ image, name, district }: InvestorCardProps) {
  return (
    <div className="group relative border-2 border-primary rounded-[22px] overflow-hidden min-w-[240px] lg:min-w-0 h-[240px] cursor-default transition-all duration-300 hover:shadow-xl">
      {/* Front Face - Image */}
      <div className="w-full h-full p-0.5 rounded-[22px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[20px]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Hover Overlay - Name and District */}
      <div className="absolute inset-0 w-full h-full bg-primary/80 text-white p-4 flex flex-col items-center justify-center rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold uppercase text-center leading-tight tracking-wide">
          {name}
        </h3>
        {district && (
          <p className="text-sm font-medium mt-2 text-blue-100 uppercase tracking-wider text-center">
            {district}
          </p>
        )}
      </div>
    </div>
  );
}



export function InvestorSkeleton() {
  return (
    <div className="group relative border-2 border-gray-100 rounded-[22px] overflow-hidden min-w-[240px] lg:min-w-0 h-[240px] cursor-default">
      <div className="w-full h-full p-0.5 rounded-[22px]">
        <Skeleton className="w-full h-full rounded-[20px]" />
      </div>
    </div>
  );
}

