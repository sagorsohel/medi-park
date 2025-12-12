"use client";

import { useGetBranchesQuery } from "@/services/contactPageApi";
import { Loader2, MapPin, Phone, Mail } from "lucide-react";

export function ContactBranchesSection() {
  const { data, isLoading } = useGetBranchesQuery(1);

  const branches = data?.data?.filter(branch => branch.status === "active") || [];

  if (isLoading) {
    return (
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading branches...</span>
          </div>
        </div>
      </div>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gray-800">Visit Our Branches </span>
          </h2>

        </div>
        {branches.map((branch, index) => (
          <div key={branch.id} className={index > 0 ? "mt-20" : ""}>
           

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Left Column - Map Placeholder */}
              <div className="w-full">
                <div className="w-full h-[400px] md:h-[500px] bg-white border-2 border-gray-200 rounded-lg flex flex-col items-center justify-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center mb-4">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Map</h3>
                  <p className="text-gray-500 text-center text-sm">
                    Map integration would be implemented here
                  </p>
                </div>
              </div>

              {/* Right Column - Office Information */}
              <div className="w-full space-y-8">
                {/* Office Name Section */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{branch.name}</h3>
                  <div className="space-y-1 text-gray-700">
                    {branch.address.split(',').map((line, idx) => (
                      <p key={idx} className="text-base">
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                </div>





                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary shrink-0" />
                      <a
                        href={`tel:${branch.phone}`}
                        className="text-base text-gray-700 hover:text-primary transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary shrink-0" />
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-base text-gray-700 hover:text-primary transition-colors break-all"
                      >
                        {branch.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
