"use client";

import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { useGetFutureVentureByIdQuery, useGetFutureVenturesPublicQuery } from "@/services/futureVenturesApi";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

export default function FutureVentureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ventureId = id ? parseInt(id) : 0;

  const { data: ventureData, isLoading } = useGetFutureVentureByIdQuery(ventureId);
  const { data: relatedVenturesData } = useGetFutureVenturesPublicQuery(1);

  const venture = ventureData?.data;
  const relatedVentures = relatedVenturesData?.data?.filter(v => v.id !== ventureId && v.status === 'active').slice(0, 6) || [];

  // Animation variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Future Venture not found</h1>
          <p className="text-gray-600">The future venture you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection 
        image={venture.image} 
        heading={'Future Ventures'} 
        alt={`${venture.title} Hero`} 
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={venture.title} />

      {/* Future Venture Detail Content */}
      <section className="w-full bg-white">
        {/* Dark Blue Header */}
        <div className="w-full bg-primary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              {venture.title}
            </h1>
            {venture.short_description && (
              <p className="text-xl text-white/90 text-center mt-4 max-w-3xl mx-auto">
                {venture.short_description}
              </p>
            )}
          </div>
        </div>

        {/* Main Image Section */}
        <motion.div
          className="w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <img
            src={venture.image}
            alt={venture.title}
            className="w-[90%] mx-auto flex justify-center items-center h-auto max-h-[600px] object-cover rounded-lg mt-8"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="w-full bg-white pb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div
              className="space-y-6 text-gray-700 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: venture.description }}
            />
          </div>
        </motion.div>

        {/* Related Future Ventures Section */}
        {relatedVentures.length > 0 && (
          <motion.section
            className="w-full bg-gray-50 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Future Ventures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedVentures.map((relatedVenture) => (
                  <Link
                    key={relatedVenture.id}
                    to={`/future-ventures/${relatedVenture.id}`}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <img
                          src={relatedVenture.image}
                          alt={relatedVenture.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {relatedVenture.title}
                          </h3>
                          {relatedVenture.short_description && (
                            <p className="text-gray-600 line-clamp-3">
                              {relatedVenture.short_description}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </section>
    </div>
  );
}

