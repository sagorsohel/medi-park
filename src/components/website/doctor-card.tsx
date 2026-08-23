"use client";

import { Link } from "react-router";
import { Stethoscope, Calendar, Building2 } from "lucide-react";

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
  totalExperience = "1+ Year",
}: DoctorCardProps) {
  const displayDegrees = degrees && degrees !== name ? degrees : "";
  const displayRole = specialization || badge || "Consultant Specialist";
  const displayDept = specialties || "Medical Department";

  return (
    <div className="group relative flex flex-col w-full max-w-[360px] overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ease-out">

      {/* Top Part: Image and Experience / Status Badges - Clickable Link to Doctor Details */}
      <Link to={`/doctors/${id}`} className="relative p-5 pb-0 flex justify-center bg-slate-50/50 block">
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />

          {/* Subtle overlay on the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Experience Badge on Top-Right */}
          <div className="absolute top-3 right-3 bg-[#0B1B3D]/95 backdrop-blur-sm text-amber-300 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest shadow-lg border border-amber-400/20 uppercase">
            {totalExperience} Exp
          </div>
        </div>
      </Link>

      {/* Middle Part: Doctor Chamber Room Door Nameplate Design - Clickable Link */}
      <Link to={`/doctors/${id}`} className="flex flex-col p-5 pt-4 flex-1 block">
        {/* Nameplate Plaque Box */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#0B1B3D] via-[#0E224D] to-[#081530] text-white border-2 border-amber-400/40 shadow-[0_8px_20px_rgba(11,27,61,0.25)] transition-all duration-300 group-hover:border-amber-400/70">
          {/* Decorative Corner Rivets / Screws */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />

          {/* Doctor Name */}
          <h3 className="text-base font-extrabold text-amber-300 tracking-wide text-center leading-snug truncate uppercase drop-shadow-sm px-2">
            {name}
          </h3>

          {/* Qualifications / Degrees */}
          {displayDegrees && (
            <p className="text-[11px] font-medium text-slate-200 text-center mt-1 leading-tight tracking-normal line-clamp-1 italic px-2">
              {displayDegrees}
            </p>
          )}

          {/* Gold Divider Line */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mx-auto my-2.5" />

          {/* Designation & Department */}
          <div className="flex flex-col gap-1.5 text-center px-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white tracking-wide truncate">
              <Stethoscope className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">{displayRole}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-300 truncate">
              <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">{displayDept}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bottom Part: Action Button linking to Doctor Details */}
      <div className="p-5 pt-0 mt-auto">
        <Link
          to={`/doctors/${id}`}
          className="flex items-center gap-2.5 w-full justify-center py-3 bg-[#0B1B3D] hover:bg-primary text-white rounded-xl font-bold text-[12px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]"
        >
          <Calendar className="w-4 h-4" />
          View Details & Appointment
        </Link>
      </div>
    </div>
  );
}
