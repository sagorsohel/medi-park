import { useState, useMemo } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { InvestorCard } from '@/components/website/investor-card'
import { Button } from '@/components/ui/button'
import { useGetInvestorsQuery } from '@/services/investorApi'
import { Loader2, Search } from 'lucide-react'
import { Input } from "@/components/ui/input";

export default function InvestorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isFetching } = useGetInvestorsQuery(currentPage);

  // Map and filter investors
  const filteredInvestors = useMemo(() => {
    if (!data?.data) return [];
    
    const allMapped = data.data.map((investor) => ({
      id: investor.id,
      image: investor.image || investor.applicant_image || "/vite.svg",
      name: investor.investor_name || investor.applicant_full_name || "Investor",
      role: investor.profession || investor.organization || "Investor"
    }));

    if (!searchTerm) return allMapped;

    return allMapped.filter(inv => 
      inv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Check if there are more pages to load
  const hasMorePages = data?.pagination?.next_page !== null;
  const isLoadingMore = isFetching && currentPage > 1;

  const handleLoadMore = () => {
    if (hasMorePages && !isLoadingMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <PageHeroSection image="/investor-page.png" heading="Our Legacy Partner List" alt="Our Legacy Partner List Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Our Legacy Partner List" />

      {/* Investor List Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Our Legacy Partner List
            </h1>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search legacy partner by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && currentPage === 1 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm ? `No legacy partners matching "${searchTerm}" found.` : "No legacy partners found."}
              </p>
              {searchTerm && (
                <Button 
                   variant="link" 
                   className="mt-2 text-primary"
                   onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Investor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {filteredInvestors.map((investor) => (
                  <div key={investor.id}>
                    <InvestorCard
                      image={investor.image}
                      name={investor.name}
                      designation={investor.role}
                      description=""
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button - Only show if not searching or if there are truly more pages (search is client-side) */}
              {!searchTerm && hasMorePages && (
                <div className="text-center mt-12">
                  <Button
                    className="bg-primary hover:bg-blue-800 text-white px-10 py-7 text-lg font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                        Loading...
                      </>
                    ) : (
                      "Load More Partners"
                    )}
                  </Button>
                </div>
              )}

              {/* Show total count */}
              {!searchTerm && data?.pagination && (
                <div className="text-center mt-6 text-sm text-gray-400 font-medium">
                  Showing {filteredInvestors.length} of {data.pagination.total_count} legacy partners
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

