"use client";

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { InvestorCard } from "./investor-card";
import { useMemo } from "react";
import { useGetInvestorsQuery } from "@/services/investorApi";
import { Loader2 } from "lucide-react";

export function InvestorSection() {
  const { data, isLoading } = useGetInvestorsQuery(1);

  console.log("investor section data", data);
  // Get all investors from API
  const investors = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((investor) => ({
      id: investor.id,
      image: investor.image || investor.applicant_image || "/vite.svg",
      name: investor.investor_name || investor.applicant_full_name || "Investor",
      designation: investor.profession || investor.organization || "Investor",
      description: investor.about || "MediPark Hospital Investor",
    }));
  }, [data]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Our Legacy Partner</h2>
            <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Only render if we have data
  if (investors.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Our Legacy Partner</h2>
          <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
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
            className="bg-blue-100 text-primary border border-blue-900 hover:bg-blue-200 px-8 py-6 text-lg font-semibold rounded-lg"
            asChild
          >
            <Link to="/investors">View All Our Legacy Partner</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

