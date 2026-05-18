"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, Calendar } from "lucide-react";

interface DoctorProfileCardProps {
  id: string | number;
  image: string;
  name: string;
  qualifications: string;
  role: string;
  department: string;
  onViewProfile?: () => void;
}

export function DoctorProfileCard({
  id,
  image,
  name,
  qualifications,
  role,
  department,
}: DoctorProfileCardProps) {
  return (
    <Card className="group overflow-hidden border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-[0_20px_40px_rgba(11,27,61,0.06)] hover:-translate-y-1 transition-all duration-300 bg-gradient-to-b from-white to-gray-50/50 p-4">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Left Column: Image Container with Hover Zoom */}
          <div className="shrink-0 flex justify-center sm:block">
            <div className="relative w-40 h-[170px] rounded-2xl overflow-hidden shadow-md border border-gray-50 bg-gray-50/50">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Active Pulsing Status indicator */}

            </div>
          </div>

          {/* Right Column: Name, Degrees, Designation & Department info */}
          <div className="flex-grow flex flex-col justify-between min-w-0">
            <div>
              {/* Name */}
              <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">
                {name}
              </h3>

              {/* Degrees */}
              <p className="text-[12px] font-semibold text-gray-500 mt-1 italic line-clamp-1">
                {qualifications || "MBBS, Medical Specialist"}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-gray-100 my-3.5" />

              {/* Labeled Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* Designation */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">Designation</span>
                    <span className="text-xs font-bold text-gray-700 truncate mt-0.5">{role}</span>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-emerald-500/5 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider leading-none">Department</span>
                    <span className="text-xs font-bold text-gray-700 truncate mt-0.5">{department}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Doctor Profile Button */}
            <Button
              className="bg-[#0B1B3D] hover:bg-primary text-white rounded-xl font-bold text-[12px] uppercase tracking-wider py-5 w-full sm:w-auto sm:px-6 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]"
              asChild
            >
              <Link to={`/doctors/${id}`}>
                <Calendar className="w-3.5 h-3.5 mr-2" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DoctorSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm p-4 bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image */}
          <div className="shrink-0 flex justify-center sm:block">
            <Skeleton className="w-40 h-[170px] rounded-2xl" />
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col justify-between py-1 min-w-0">
            <div>
              <Skeleton className="h-7 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="w-full h-px bg-gray-100 my-3.5" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-grow space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-grow space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
