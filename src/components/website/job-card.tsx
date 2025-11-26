"use client";

import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Briefcase } from "lucide-react";

interface JobCardProps {
  id: string | number;
  image: string;
  title: string;
  vacancy: string;
  deadline: string;
  location: string;
  type: string;
  onApply?: () => void;
}

export function JobCard({
  id,
  image,
  title,
  vacancy,
  deadline,
  location,
  type,
  onApply
}: JobCardProps) {
  const navigate = useNavigate();

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      navigate(`/careers/job/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <div className="relative w-full p-3  rounded-[16px] h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full rounded-[16px] object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>
      <CardContent className="p-3">
        <h3 className="text-xl font-bold text-blue-900 mb-4">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm">Vacancy: {vacancy}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Deadline: {deadline}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />

            <span className="text-sm">{location} • {type}</span>
          </div>
        </div>
        <Button
          className="w-full bg-blue-900 rounded-[40px] hover:bg-blue-800 text-white"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
}

