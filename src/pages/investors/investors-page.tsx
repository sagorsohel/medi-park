import React, { useState, useMemo, useEffect } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { InvestorCard, InvestorSkeleton } from '@/components/website/investor-card'
import { useGetInvestorsQuery } from '@/services/investorApi'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, isFetching } = useGetInvestorsQuery({
    search: debouncedSearch,
    page: currentPage
  });

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Map and filter investors
  const mappedInvestors = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.map((investor) => ({
      id: investor.id,
      image: investor.image || investor.applicant_image || "/vite.svg",
      name: investor.investor_name || investor.applicant_full_name || "Investor",
      role: investor.profession || investor.organization || "Investor"
    }));
  }, [data]);

  const pagination = data?.pagination;

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
          {(isLoading || isFetching) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <InvestorSkeleton key={i} />
              ))}
            </div>
          ) : mappedInvestors.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm ? `No legacy partners matching "${searchTerm}" found.` : "No legacy partners found."}
              </p>
              {searchTerm && (
                <button 
                   className="mt-2 text-primary font-bold hover:underline"
                   onClick={() => setSearchTerm("")}
                >
                  Clear search filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Investor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {mappedInvestors.map((investor) => (
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

              {/* Pagination */}
              {pagination && pagination.total_page > 1 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <DataTablePagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_page}
                    totalEntries={pagination.total_count}
                    entriesPerPage={pagination.per_page}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

