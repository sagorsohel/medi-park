"use client";

import { useState } from "react";
import { NewsPageHero } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { NewsPublicCard } from '@/components/website/news-public-card'
import { useGetNewsPublicQuery } from "@/services/newsApi";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { motion, type Variants } from "framer-motion";

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetNewsPublicQuery(currentPage);
  
  const newsItems = data?.data || [];
  const pagination = data?.pagination;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1 * (index % 6),
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <NewsPageHero />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="News & Media" />

      {/* News & Media Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              News & Media
            </h2>
            <div className="w-44 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-center mb-12 max-w-4xl mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </p>

          {/* News Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {newsItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No news available at the moment.
              </div>
            ) : (
              newsItems.map((news, index) => (
                <motion.div key={news.id} custom={index} variants={cardVariants}>
                  <NewsPublicCard
                    id={news.id}
                    image={news.feature_image}
                    date={news.created_at}
                    title={news.title}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {pagination && pagination.total_page > 1 && (
            <DataTablePagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_page}
              totalEntries={pagination.total_count}
              entriesPerPage={pagination.per_page}
              onPageChange={setCurrentPage}
              showingFrom={(pagination.current_page - 1) * pagination.per_page + 1}
              showingTo={Math.min(pagination.current_page * pagination.per_page, pagination.total_count)}
            />
          )}
        </div>
      </section>
    </div>
  )
}

