"use client";

import { Button } from "@/components/ui/button";
import { DoctorCard } from "./doctor-card";
import { useNavigate } from "react-router";
import { useGetDoctorsQuery } from "@/services/doctorApi";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export function DoctorsSection() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDoctorsQuery(1);
  console.log(data);

  // Get first 5 doctors and map to card format
  const doctors = useMemo(() => {
    if (!data?.data) return [];
    return data.data.slice(0, 5).map((doctor) => ({
      id: doctor.id,
      image: doctor.image || "/vite.svg",
      name: doctor.doctor_name,
      specialization: doctor.specialist || "",
      description: doctor.department || "Experienced medical professional",
    }));
  }, [data]);

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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500">
              Failed to load doctors. Please try again later.
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No doctors available at the moment.
            </div>
          ) : (
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
          )}
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

