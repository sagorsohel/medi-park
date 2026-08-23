import React, { useState, useMemo, useEffect } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { InvestorCard, InvestorSkeleton } from '@/components/website/investor-card'
import { useGetInvestorsQuery } from '@/services/investorApi'
import { Search, Layers, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function InvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
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

  // Map and extract categories
  const mappedInvestors = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.map((investor) => {
      const address = investor.present_address || investor.permanent_address || "";
      const addressParts = address.split(/[\n,\r]/).map(p => p.trim()).filter(Boolean);
      const district = addressParts.length > 0 ? addressParts[addressParts.length - 1] : "";
      const category = investor.category_of_share || investor.profession || "General Partner";

      return {
        id: investor.id,
        image: investor.image || investor.applicant_image || "/vite.svg",
        name: investor.investor_name || investor.applicant_full_name || "Investor",
        role: investor.profession || investor.organization || "Legacy Partner",
        district: district,
        category: category,
      };
    });
  }, [data]);

  // Extract unique categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    mappedInvestors.forEach((inv) => {
      if (inv.category) set.add(inv.category);
    });
    return ["All", ...Array.from(set)];
  }, [mappedInvestors]);

  // Filter by category
  const filteredInvestors = useMemo(() => {
    if (selectedCategory === "All") return mappedInvestors;
    return mappedInvestors.filter((inv) => inv.category === selectedCategory);
  }, [mappedInvestors, selectedCategory]);

  const pagination = data?.pagination;

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <PageHeroSection image="/investor-page.png" heading="Our Legacy Partner List" alt="Our Legacy Partner List Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Our Legacy Partner List" />

      {/* Investor List Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                <Layers className="w-3.5 h-3.5" />
                Category Wise Display
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0B1B3D]">
                Our Legacy Partners
              </h1>
            </div>

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

          {/* Category Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-gray-100 scrollbar-none">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0B1B3D] text-white shadow-md shadow-blue-950/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {(isLoading || isFetching) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <InvestorSkeleton key={i} />
              ))}
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm ? `No legacy partners matching "${searchTerm}" found.` : "No legacy partners found."}
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button 
                   className="mt-2 text-primary font-bold hover:underline"
                   onClick={() => {
                     setSearchTerm("");
                     setSelectedCategory("All");
                   }}
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Investor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {filteredInvestors.map((investor) => (
                  <div key={investor.id}>
                    <InvestorCard
                      image={investor.image}
                      name={investor.name}
                      designation={investor.role}
                      description=""
                      district={investor.district}
                      category={investor.category}
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
