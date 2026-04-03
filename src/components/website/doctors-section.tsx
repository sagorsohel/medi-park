"use client";

import { Button } from "@/components/ui/button";
import { DoctorCard } from "./doctor-card";
import { useNavigate } from "react-router";
import { useGetDoctorsQuery } from "@/services/doctorApi";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

interface DoctorsSectionProps {
  title?: string;
}

export function DoctorsSection({ title }: DoctorsSectionProps) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDoctorsQuery(1);
  console.log(data);

  // Get first 5 doctors and map to card format
  const doctors = useMemo(() => {
    if (!data?.data) return [];
    return data.data.slice(0, 6).map((doctor) => {
      // Extract degrees from education
      const degrees = doctor.education
        ?.map((edu) => edu.qualification)
        .filter(Boolean)
        .join(", ");

      // Experience Calculation based on user snippet
      const experienceList = (doctor as any).experience || [];
      const experienceCount = experienceList.length;

      const totalYears = experienceList.reduce((acc: number, exp: any) => {
        // Handle "X Years" string or direct number
        const duration = exp.duration || exp.no_of_years || "0";
        const years = parseInt(duration) || 0;
        return acc + years;
      }, 0);

      const totalExperience = totalYears > 0 ? `${totalYears}+ Year` : "1+ Year";

      return {
        id: doctor.id,
        image: doctor.image || "/vite.svg",
        name: doctor.doctor_name,
        degrees: degrees || doctor.specialist || "Medical Professional",
        specialization: doctor.specialist || "",
        badge: doctor.specialist || "Specialist",
        specialties: doctor.department || "General Physician",
        experienceCount: experienceCount,
        totalExperience: totalExperience,
        // Mocking these as they're not in the API yet
        rating: 4.5,
        reviewCount: 20,
        visitCount: 40,
        fee: "৳500",
      };
    });
  }, [data]);

  return (
    <div className="w-full bg-[#f8fbff] py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            {title ? (
              title
            ) : (
              <>Our <span className="text-primary">Doctors</span></>
            )}
          </h2>

        </div>

        {/* Doctor Cards */}
        <div className="mb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              Failed to load doctors. Please try again later.
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              No doctors available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  {...doctor}
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
            className="bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white px-10 py-7 text-lg font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            View All Doctors
          </Button>
        </div>
      </div>
    </div>
  );
}


