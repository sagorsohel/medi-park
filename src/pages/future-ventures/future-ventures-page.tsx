"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FutureVenturesPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFutureVenturesPublicQuery(1);
  const [searchQuery, setSearchQuery] = useState("");

  const activeFutureVentures = useMemo(() => {
    if (!data?.data) return [];
    let ventures = data.data.filter((venture) => venture.status === 'active');
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      ventures = ventures.filter((venture) =>
        venture.title.toLowerCase().includes(query)
      );
    }
    
    return ventures;
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
        image="/future-ventures-hero.jpg" 
        heading="Future Ventures" 
        alt="Future Ventures Hero" 
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Future Ventures" />

      {/* Future Ventures Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search future ventures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Future Ventures Grid */}
          {activeFutureVentures.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No future ventures found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeFutureVentures.map((venture, index) => (
                <motion.div
                  key={venture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full"
                    onClick={() => navigate(`/future-ventures/${venture.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={venture.image}
                        alt={venture.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/vite.svg";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {venture.title}
                      </h3>
                      <div 
                        className="text-sm text-gray-600 line-clamp-3 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: venture.short_description }}
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

