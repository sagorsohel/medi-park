"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

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
  onViewProfile
}: DoctorProfileCardProps) {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <CardContent className="p-2">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="">
            <div className="w-44 h-44 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-gray-200">
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
          </div>
          
          {/* Content */}
          <div className= "grow flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-text mb-2">{name}</h3>
              <p className="text-sm text-gray-600 mb-2">{qualifications}</p>
              <p className="text-base font-semibold text-gray-900 mb-2">{role}</p>
              <Link 
                to={`/doctors/${id}`}
                className="text-text hover:text-blue-800 underline text-sm inline-block mb-4"
              >
                {department}
              </Link>
            </div>
            <Button
              className="bg-blue-900 hover:bg-blue-800 rounded-[40px] text-white w-full md:w-auto"
              onClick={handleViewProfile}
              asChild
            >
              <Link to={`/doctors/${id}`}>View Doctor Profile</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

