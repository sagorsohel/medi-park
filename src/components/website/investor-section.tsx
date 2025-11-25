"use client";

import { Button } from "@/components/ui/button";
import { InvestorCard } from "./investor-card";

const investors = [
  {
    id: 1,
    image: "/about1.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 2,
    image: "/about-2.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 3,
    image: "/about3.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 4,
    image: "/about1.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 5,
    image: "/about-2.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  }
];

export function InvestorSection() {
  return (
    <div className="w-full bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">Investor</h2>
          <div className="w-0.5 h-8 bg-blue-900 mx-auto mt-2" />
        </div>

        {/* Investor Cards */}
        <div className="overflow-x-auto mb-12">
          <div className="flex gap-6 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5 max-w-7xl mx-auto">
            {investors.map((investor) => (
              <InvestorCard
                key={investor.id}
                image={investor.image}
                name={investor.name}
                designation={investor.designation}
                description={investor.description}
              />
            ))}
          </div>
        </div>

        {/* View All Investor Button */}
        <div className="text-center">
          <Button
            className="bg-blue-100 text-blue-900 border border-blue-900 hover:bg-blue-200 px-8 py-6 text-lg font-semibold rounded-lg"
          >
            View All Investor
          </Button>
        </div>
      </div>
    </div>
  );
}

