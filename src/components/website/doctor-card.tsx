"use client";

import { Link } from "react-router";
import { Star, Stethoscope, Calendar } from "lucide-react";

interface DoctorCardProps {
  id: number;
  image: string;
  name: string;
  degrees?: string;
  specialization?: string;
  badge?: string;
  specialties?: string;
  rating?: number;
  reviewCount?: number;
  visitCount?: number;
  lastWorked?: string;
  experienceCount?: number;
  totalExperience?: string;
  fee?: string;
}

export function DoctorCard({
  id,
  image,
  name,
  degrees,
  specialization,
  badge,
  specialties,
  rating = 4.1,
  reviewCount = 15,
  visitCount = 35,
  lastWorked,
  experienceCount = 0,
  totalExperience = "1+ Year",
  fee = "৳2",
}: DoctorCardProps) {
  return (
    <div className="relative flex flex-col w-full max-w-[450px] overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md h-[275px]">
      {/* Top Part: Image and Info */}
      <div className="flex gap-4 p-5">
        {/* Left Column: Image & Experience */}
        <div className="flex flex-col items-center gap-3 w-[110px] shrink-0">
          <div className="relative">
            <div className="w-[100px] h-[110px] rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm bg-gray-50">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
            {/* Status Dot */}
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm" />
          </div>

          <div className="text-center">
            <span className="block text-lg font-bold text-gray-900 leading-tight">
              {totalExperience}
            </span>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              Experience
            </span>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col flex-1 gap-1.5 pt-1 overflow-hidden">
          <h3 className="text-xl font-bold text-gray-900 truncate leading-snug tracking-tight">
            {name}
          </h3>

          <p className="text-sm font-medium text-gray-500 truncate">
            {degrees || specialization}
          </p>

          <div className="mt-1">
            <div className="inline-flex items-center px-4 py-1.5 rounded-r-2xl rounded-l-md bg-primary text-white text-[12px] font-semibold tracking-wide relative">
              {badge || specialization || "Specialist"}
              <div className="absolute right-[-8px] top-0 bottom-0 w-4 bg-primary transform skew-x-[-20deg] rounded-r-md -z-10" />
            </div>
          </div>

          <p className="text-[14px] font-medium text-primary mt-1 leading-tight truncate">
            {specialties || "General Physician"}
          </p>


        </div>
      </div>

      {/* Bottom Part: Action */}
      <div className="mt-auto border-t border-gray-100 flex items-center justify-center p-3 bg-gray-50/30">
        <Link
          to={`/doctors/${id}`}
          className="flex items-center gap-2 w-full justify-center py-2.5 bg-white border border-primary text-primary rounded-xl font-bold text-[14px] shadow-sm hover:bg-primary/5 transition-colors whitespace-nowrap"
        >
          <Calendar className="w-4 h-4" />
          View Details
        </Link>
      </div>
    </div>
  );
}
