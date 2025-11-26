"use client";

import { Link } from "react-router";
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
  },
  {
    id: 154353,
    image: "/about1.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 223,
    image: "/about-2.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 3657,
    image: "/about3.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 456757,
    image: "/about1.png",
    name: "GEN MAMUN MOSTAFI (RTD)",
    designation: "Designation",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry."
  },
  {
    id: 556464,
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

        {/* Investor Cards - Infinite Auto Scroll */}
        <div className="mb-12 overflow-hidden">
          <div className="scroll-group">
            <div className="flex gap-6 animate-scroll-left" style={{ width: 'max-content' }}>
              {/* First set of cards */}
              {investors.map((investor) => (
                <div key={investor.id} className="shrink-0" style={{ width: '280px' }}>
                  <InvestorCard
                    image={investor.image}
                    name={investor.name}
                    designation={investor.designation}
                    description={investor.description}
                  />
                </div>
              ))}
              {/* Duplicate set for seamless infinite loop */}
              {investors.map((investor) => (
                <div key={`duplicate-${investor.id}`} className="shrink-0" style={{ width: '280px' }}>
                  <InvestorCard
                    image={investor.image}
                    name={investor.name}
                    designation={investor.designation}
                    description={investor.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Investor Button */}
        <div className="text-center">
          <Button
            className="bg-blue-100 text-blue-900 border border-blue-900 hover:bg-blue-200 px-8 py-6 text-lg font-semibold rounded-lg"
            asChild
          >
            <Link to="/investors">View All Investor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

