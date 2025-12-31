import { useState, useMemo } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { InvestorListCard } from '@/components/website/investor-list-card'
import { Button } from '@/components/ui/button'
import { useGetInvestorsQuery } from '@/services/investorApi'
import { Loader2 } from 'lucide-react'

export default function InvestorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isFetching } = useGetInvestorsQuery(currentPage);

  // Map API data to component format
  const displayedInvestors = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((investor) => ({
      id: investor.id,
      image: investor.image || investor.applicant_image || "/vite.svg",
      name: investor.investor_name || investor.applicant_full_name || "Investor",
      role: investor.profession || investor.organization || "Investor"
    }));
  }, [data]);

  // Check if there are more pages to load
  const hasMorePages = data?.pagination?.next_page !== null;
  const isLoadingMore = isFetching && currentPage > 1;

  const handleLoadMore = () => {
    if (hasMorePages && !isLoadingMore) {
      setCurrentPage((prev) => prev + 1);
    }
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
          <h1 className="text-4xl font-bold text-primary mb-12 text-center">
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
                className="bg-primary hover:bg-blue-800 text-white px-8 py-6 text-lg font-semibold rounded-lg"
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

