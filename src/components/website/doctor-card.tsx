"use client";

interface DoctorCardProps {
  image: string;
  name: string;
  specialization: string;
  description: string;
}

export function DoctorCard({ image, name, specialization, description }: DoctorCardProps) {
  return (
    <div className="bg-primary rounded-[22px] overflow-hidden shadow-md min-w-[320px] lg:min-w-0">
      {/* Image Section */}
      <div className="relative  ">
        <img
          src={image}
          alt={name}
          className="w-[207px] h-[211px] object-cover mx-auto mt-3 rounded-[22px]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Text Section - Dark Blue Background */}
      <div className="bg-primary text-white p-6 flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2 text-center leading-tight">
          {name}
        </h3>
        <p className="text-xs text-blue-200 text-center mb-2 font-medium uppercase">
          {specialization}
        </p>
        <p className="text-xs text-blue-200 text-center leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

