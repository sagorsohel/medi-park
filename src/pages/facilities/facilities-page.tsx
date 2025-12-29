"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGetFacilitiesPublicQuery } from "@/services/homepageApi";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FacilitiesPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFacilitiesPublicQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const activeFacilities = useMemo(() => {
    if (!data?.data) return [];
    let facilities = data.data.filter((facility) => facility.status === 'active');
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      facilities = facilities.filter((facility) =>
        facility.title.toLowerCase().includes(query)
      );
    }
    
    return facilities;
  }, [data, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection 
        image="/facilities-hero.jpg" 
        heading="Our Facilities" 
        alt="Facilities Hero" 
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Facilities" />

      {/* Facilities Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Facilities Grid */}
          {activeFacilities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No facilities found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeFacilities.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full"
                    onClick={() => navigate(`/facilities/${facility.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/vite.svg";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {facility.title}
                      </h3>
                      <div 
                        className="text-sm text-gray-600 line-clamp-3 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: facility.short_description }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

