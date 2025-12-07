"use client";

import { Button } from "@/components/ui/button";
import { DoctorCard } from "./doctor-card";
import { useNavigate } from "react-router";

const doctors = [
  {
    id: 1,
    image: "/about1.png",
    name: "PROF. BRIG GEN MAMUN MOSTAFI (RTD)",
    specialization: "NEPHRAOLOGY",
    description: "Specialist in Nephrology and Joint Disease"
  },
  {
    id: 2,
    image: "/about-2.png",
    name: "Dr. Sabera Tarafdar",
    specialization: "Radiology & Imaging",
    description: "Consultant, Radiology & Imaging"
  },
  {
    id: 3,
    image: "/about3.png",
    name: "PROF. BRIG GEN MAMUN MOSTAFI (RTD)",
    specialization: "NEPHRAOLOGY",
    description: "Specialist in Nephrology and Joint Disease"
  },
  {
    id: 4,
    image: "/about1.png",
    name: "PROF. BRIG GEN MAMUN MOSTAFI (RTD)",
    specialization: "NEPHRAOLOGY",
    description: "Specialist in Nephrology and Joint Disease"
  },
  {
    id: 5,
    image: "/about-2.png",
    name: "PROF. BRIG GEN MAMUN MOSTAFI (RTD)",
    specialization: "NEPHRAOLOGY",
    description: "Specialist in Nephrology and Joint Disease"
  }
];

export function DoctorsSection() {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Our Doctors</h2>
          <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
        </div>

        {/* Doctor Cards */}
        <div className="overflow-x-auto mb-18">
          <div className="flex gap-6 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5 max-w-7xl mx-auto">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                image={doctor.image}
                name={doctor.name}
                specialization={doctor.specialization}
                description={doctor.description}
              />
            ))}
          </div>
        </div>

        {/* View All Doctors Button */}
        <div className="text-center">
          <Button
            onClick={() => {
              navigate('/doctors')
            }}
            className="bg-transparant text-primary border-2 border-blue-900 hover:bg-blue-200 px-8 py-7 text-lg font-semibold rounded-full"
          >
            View All Doctors
          </Button>
        </div>
      </div>
    </div>
  );
}

