"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { useGetGalleryPageBannerQuery } from "@/services/galleryPageApi";
import { useGetGalleriesQuery, type GalleryItem } from "@/services/galleryApi";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function GelleryPage() {
  const { data: bannerData } = useGetGalleryPageBannerQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: galleriesData, isLoading } = useGetGalleriesQuery(currentPage);

  const banner = bannerData?.data;
  const heroImage = banner?.background_image ?? "/hero1.png";
  const heroOpacity = banner?.opacity ? parseFloat(banner.opacity) : 0.4;

  const galleryItems = galleriesData?.data ?? [];
  const pagination = galleriesData?.pagination;

  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const tileClasses = useMemo(
    () => ["md:row-span-2", "md:col-span-2", "md:col-span-2 md:row-span-2", "", "md:row-span-2"],
    []
  );

  const showingFrom = pagination
    ? (pagination.current_page - 1) * pagination.per_page + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.current_page * pagination.per_page, pagination.total_count)
    : 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="w-full">
      <PageHeroSection
        image={heroImage}
        heading="Gallery"
        alt="Gallery Hero"
        overlayOpacity={heroOpacity}
      />

      <GalleryShowcase items={galleryItems} isLoading={isLoading} />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Gallery</h2>
            <p className="text-gray-600">
              Explore snapshots from Medipark — click any image to view it in detail.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-gray-500">Loading gallery...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No gallery items found.</div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={containerVariants}
              >
                {galleryItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    className={`relative group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition focus:outline-none border border-gray-200 ${tileClasses[idx % tileClasses.length]}`}
                    onClick={() => setActiveItem(item)}
                    variants={cardVariants}
                  >
                    <div className="relative h-full w-full p-2 bg-primary">
                      <div className="absolute inset-2 rounded-xl border-none pointer-events-none" />
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover rounded-lg transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/vite.svg";
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold px-3 text-center">
                        {item.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {pagination && pagination.total_page > 1 && (
                <div className="mt-10">
                  <DataTablePagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_page}
                    totalEntries={pagination.total_count}
                    entriesPerPage={pagination.per_page}
                    onPageChange={setCurrentPage}
                    showingFrom={showingFrom}
                    showingTo={showingTo}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Dialog open={!!activeItem} onOpenChange={() => setActiveItem(null)}>
        <DialogContent className="max-w-4xl">
          {activeItem && (
            <>
              <DialogHeader>
                <DialogTitle>{activeItem.title}</DialogTitle>
                <p className="text-sm text-gray-500">
                  {new Date(activeItem.date).toLocaleDateString()}
                </p>
              </DialogHeader>
              <div className="w-full">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-auto rounded-lg object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ShowcaseProps = {
  items: GalleryItem[];
  isLoading: boolean;
};

function GalleryShowcase({ items, isLoading }: ShowcaseProps) {
  const [index, setIndex] = useState(0);

  const safeItems = useMemo(() => items ?? [], [items]);
  const length = safeItems.length;
  const normalizedIndex = length ? ((index % length) + length) % length : 0;
  const active = length ? safeItems[normalizedIndex] : undefined;

  const next = () => {
    if (safeItems.length === 0) return;
    setIndex((prev) => (prev + 1) % safeItems.length);
  };

  const prev = () => {
    if (safeItems.length === 0) return;
    setIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  // Auto-advance
  useEffect(() => {
    if (!safeItems.length) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, 5000);
    return () => clearInterval(id);
  }, [safeItems.length]);

  const sideThumbs = useMemo(() => {
    if (!safeItems.length) return [];
    const thumbs: GalleryItem[] = [];
    for (let i = 1; i <= 3; i++) {
      thumbs.push(safeItems[(normalizedIndex + i) % safeItems.length]);
    }
    return thumbs;
  }, [normalizedIndex, safeItems]);

  return (
    <section className="bg-[#fdf8f2] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="hidden lg:flex lg:flex-col gap-4">
            {isLoading ? (
              <div className="text-gray-500 text-sm">Loading...</div>
            ) : (
              sideThumbs.map((thumb, idx) => (
                <button
                  key={`${thumb.id}-${idx}`}
                  onClick={() => setIndex((index + idx + 1) % safeItems.length)}
                  className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={thumb.image}
                    alt={thumb.title}
                    className="h-32 w-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold px-2 text-center line-clamp-2">
                      {thumb.title}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="col-span-1 lg:col-span-4 relative">
            {isLoading || !active ? (
              <div className="h-[380px] sm:h-[460px] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                {isLoading ? "Loading slider..." : "No images"}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative"
                  >
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-[380px] sm:h-[460px] object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/25 via-black/5 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="bg-black/50 text-white px-3 py-2 rounded-lg max-w-md">
                        <p className="text-sm text-white/80 mb-1">
                          {new Date(active.date).toLocaleDateString()}
                        </p>
                        <p className="text-lg font-semibold">{active.title}</p>
                      </div>
                      <div className="flex gap-2 pointer-events-auto">
                        <button
                          onClick={prev}
                          className="h-10 w-10 rounded-full bg-white text-gray-700 shadow hover:bg-primary/30 rounded-t-lg flex items-center justify-center"
                          aria-label="Previous"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={next}
                          className="h-10 w-10 rounded-full bg-white text-gray-700 shadow hover:bg-primary/30 rounded-t-lg flex items-center justify-center"
                          aria-label="Next"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}