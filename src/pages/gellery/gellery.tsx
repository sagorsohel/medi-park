import { PageHeroSection } from "@/components/website/page-hero-section";
import { useGetGalleryPageBannerQuery } from "@/services/galleryPageApi";

export default function GelleryPage() {
  const { data } = useGetGalleryPageBannerQuery();
  const banner = data?.data;

  const heroImage = banner?.background_image ?? "/hero1.png";
  const heroOpacity = banner?.opacity ? parseFloat(banner.opacity) : 0.4;

  return (
    <div className="w-full">
      <PageHeroSection
        image={heroImage}
        heading="Gallery"
        alt="Gallery Hero"
        overlayOpacity={heroOpacity}
      />

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Gallery</h2>
          <p className="text-gray-600">
            Gallery content will appear here once available.
          </p>
        </div>
      </section>
    </div>
  );
}


