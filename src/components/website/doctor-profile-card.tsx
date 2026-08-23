"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, Calendar, Building2 } from "lucide-react";

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
  const displayQualifications = qualifications && qualifications !== name ? qualifications : "";
  const displayRole = role || "Consultant Specialist";
  const displayDept = department || "Medical Department";

  return (
    <Card className="group overflow-hidden border border-slate-200/80 hover:border-primary/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white rounded-3xl p-4 sm:p-5">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-5 items-stretch">

          {/* Left Column: Image Container - Link to Doctor Details */}
          <Link to={`/doctors/${id}`} className="shrink-0 flex justify-center sm:block">
            <div className="relative w-40 sm:w-44 h-[190px] rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-100">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Right Column: Doctor Chamber Door Nameplate Box */}
          <div className="flex-grow flex flex-col justify-between min-w-0">
            {/* Nameplate Plaque Container - Link to Doctor Details */}
            <Link to={`/doctors/${id}`} className="block">
              <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#0B1B3D] via-[#0E224D] to-[#081530] text-white border-2 border-amber-400/40 shadow-[0_4px_16px_rgba(11,27,61,0.2)] mb-3">
                {/* Corner Screws */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />

                {/* Doctor Name */}
                <h3 className="text-base sm:text-lg font-extrabold text-amber-300 uppercase tracking-wide truncate drop-shadow-sm">
                  {name}
                </h3>

                {/* Degrees / Qualifications */}
                {displayQualifications && (
                  <p className="text-[11px] font-medium text-slate-200 mt-0.5 line-clamp-1 italic">
                    {displayQualifications}
                  </p>
                )}

                {/* Gold Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent my-2" />

                {/* Role & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-100 font-bold min-w-0">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">{displayRole}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="truncate">{displayDept}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* View Details & Book Appointment Button */}
            <Button
              className="bg-[#0B1B3D] hover:bg-primary text-white rounded-xl font-bold text-[12px] uppercase tracking-wider py-5 w-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]"
              asChild
            >
              <Link to={`/doctors/${id}`}>
                <Calendar className="w-4 h-4 mr-2" />
                View Details & Appointment
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
    <Card className="overflow-hidden border border-gray-100 shadow-sm p-4 bg-white rounded-3xl">
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
