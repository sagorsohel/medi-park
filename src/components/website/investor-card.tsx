"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface InvestorCardProps {
  image: string;
  name: string;
  designation?: string;
  description?: string;
  district?: string;
  category?: string;
}

export function InvestorCard({ image, name, designation, district, category }: InvestorCardProps) {
  return (
    <div className="group relative border-2 border-primary/40 hover:border-primary rounded-[24px] overflow-hidden w-full h-[260px] cursor-default transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1.5 bg-white">
      {/* Front Face - Full Card Image */}
      <div className="w-full h-full p-1 rounded-[24px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Category Pill Tag on Top */}
      {category && (
        <div className="absolute top-3 left-3 z-10 bg-[#0B1B3D]/90 backdrop-blur-sm text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest shadow-md">
          {category}
        </div>
      )}

      {/* Hover Overlay - Shows Name, Designation, Category, District ONLY on Hover */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#0B1B3D]/95 via-[#0B1B3D]/85 to-black/30 text-white p-5 flex flex-col items-center justify-end rounded-[22px] opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-base font-extrabold uppercase text-center text-amber-300 leading-tight tracking-wide mb-1 drop-shadow">
          {name}
        </h3>
        {designation && (
          <p className="text-xs text-slate-200 text-center font-medium line-clamp-1 mb-1.5">
            {designation}
          </p>
        )}
        {category && (
          <span className="text-[10px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-white/90 uppercase tracking-wider mb-1.5 shadow-sm">
            {category}
          </span>
        )}
        {district && (
          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider text-center">
            📍 {district}
          </p>
        )}
      </div>
    </div>
  );
}

export function InvestorSkeleton() {
  return (
    <div className="border-2 border-gray-100 rounded-[24px] overflow-hidden w-full h-[260px]">
      <div className="w-full h-full p-1">
        <Skeleton className="w-full h-full rounded-[20px]" />
      </div>
    </div>
  );
}
