import { useState } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { InvestorListCard } from '@/components/website/investor-list-card'
import { Button } from '@/components/ui/button'

export default function InvestorsPage() {
  const [displayCount, setDisplayCount] = useState(36); // Initial display count

  // Generate investor data (you can replace this with actual data)
  const allInvestors = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    image: i % 4 === 0 ? "/hero1.png" : i % 4 === 1 ? "/hero2.png" : i % 4 === 2 ? "/hero3.png" : "/hero4.png",
    name: "Dr. SM Abdullah Al Mamun",
    role: "Author"
  }));

  const displayedInvestors = allInvestors.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, allInvestors.length));
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <PageHeroSection image="/investor-page.png" heading="Investor List" alt="Investor List Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Investor List" />
      
      {/* Investor List Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-4xl font-bold text-blue-900 mb-12 text-center">
            Investor List
          </h1>

          {/* Investor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {displayedInvestors.map((investor) => (
              <InvestorListCard
                key={investor.id}
                image={investor.image}
                name={investor.name}
                role={investor.role}
              />
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < allInvestors.length && (
            <div className="text-center mt-8">
              <Button
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg font-semibold rounded-lg"
                onClick={handleLoadMore}
              >
                Load More Investor
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

