"use client";

import { Card, CardContent } from "@/components/ui/card";

interface InvestorListCardProps {
  image: string;
  name: string;
  role: string;
}

export function InvestorListCard({ image, name, role }: InvestorListCardProps) {
  return (
    <Card className="border !p-0 border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
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
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-1 truncate">
              {name}
            </h3>
            <p className="text-sm text-text truncate">
              {role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

