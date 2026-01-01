"use client";

import { Link } from "react-router";

interface DoctorCardProps {
  id: number;
  image: string;
  name: string;
  specialization: string;
  description: string;
}

export function DoctorCard({ id, image, name, specialization, description }: DoctorCardProps) {
  return (
    <div className="relative flex min-w-[320px] lg:min-w-0 h-full overflow-visible flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      {/* Header Section with Gradient Background */}
      <div className="relative mx-4 -mt-6 h-32 rounded-xl bg-linear-to-r from-primary/50 to-primary bg-clip-border text-white shadow-lg shadow-blue-500/40">
      </div>
      
      {/* Image Overlay - positioned to overlap header and card body */}
      <div className="relative -mt-20 mx-auto z-10">
        <img
          src={image}
          alt={name}
          className="w-36 h-36 object-cover rounded-full border-4 border-white shadow-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Content Section - flex-1 to take available space */}
      <div className="p-6 flex-1 flex flex-col">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased text-center">
          {name}
        </h5>
        <p className="block font-sans text-sm font-semibold text-primary mb-2 uppercase text-center">
          {specialization}
        </p>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased text-center flex-1">
          {description}
        </p>
      </div>

      {/* Button Section - fixed at bottom */}
      <div className="p-6 pt-0 mt-auto">
        <Link
          to={`/doctors/${id}`}
          className="block select-none rounded-lg bg-primary py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-full"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

