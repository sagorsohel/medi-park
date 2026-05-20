"use client";

import { Link } from "react-router";
import { Stethoscope, Calendar } from "lucide-react";

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
  return (
    <div className="group relative flex flex-col w-full max-w-[360px] overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(11,27,61,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-out bg-gradient-to-b from-white to-gray-50/50">

      {/* Top Part: Image and Experience / Status Badges */}
      <div className="relative p-5 pb-0 flex justify-center">
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden shadow-md border border-gray-50 bg-gray-50/50">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Experience Badge on Top-Right */}
          <div className="absolute top-3 right-3 bg-[#0B1B3D]/95 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest shadow-lg border border-white/10 uppercase">
            {totalExperience} Exp
          </div>


        </div>
      </div>

      {/* Middle Part: Name, Degrees, Designation & Department Info */}
      <div className="flex flex-col p-5 pt-4 flex-1">
        {/* Name */}
        <h3 className="text-lg font-extrabold text-gray-900 leading-snug group-hover:text-primary transition-colors duration-300 truncate">
          {name}
        </h3>

        {/* Degrees */}


        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-4" />

        {/* Info Details List */}
        <div className="flex flex-col gap-3">
          {/* Designation Detail */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Designation</span>
              <span className="text-xs font-bold text-gray-700 truncate mt-0.5">
                {specialization || badge || "Consultant Specialist"}
              </span>
            </div>
          </div>

          {/* Department Detail */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/5 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider leading-none">Department</span>
              <span className="text-xs font-bold text-gray-700 truncate mt-0.5">
                {specialties || "General Medicine Department"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part: Action Button */}
      <div className="p-5 pt-0 mt-auto">
        <Link
          to={`/doctors/${id}`}
          className="flex items-center gap-2.5 w-full justify-center py-3 bg-[#0B1B3D] text-white hover:bg-primary hover:text-white rounded-xl font-bold text-[12px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01]"
        >
          <Calendar className="w-4 h-4" />
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
