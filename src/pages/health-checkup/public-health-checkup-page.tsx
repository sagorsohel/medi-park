import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight, ArrowRightCircle, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetHealthCheckupPackagesPublicQuery, type HealthCheckupPackage } from "@/services/healthCheckupPackageApi";
import { useGetFacilitiesPublicQuery } from "@/services/homepageApi";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";

export default function PublicHealthCheckupPage() {
    const { data: packagesData, isLoading: packagesLoading } = useGetHealthCheckupPackagesPublicQuery(1);
    const { data: facilitiesData, isLoading: facilitiesLoading } = useGetFacilitiesPublicQuery();

    const [selectedPackage, setSelectedPackage] = useState<HealthCheckupPackage | null>(null);

    const packages = packagesData?.data || [];
    // Just grab 3 sample active facilities for the right side block.
    const facilities = (facilitiesData?.data?.filter(f => f.status === 'active') || []).slice(0, 3);

    // Distribute packages into two columns for layout
    const midPoint = Math.ceil(packages.length / 2);
    const leftColumnPackages = packages.slice(0, midPoint);
    const rightColumnPackages = packages.slice(midPoint);

    return (
        <div className="w-full bg-[#f2f7f7] min-h-screen py-28">
            {/* Top Banner & Breadcrumb */}
            <PageHeroSection
                image="https://amrak.lk/wp-content/uploads/2023/09/Untitled-design-1024x576.png"
                heading="HEALTH CHECK-UP SERVICES"
                overlayOpacity={0.5}
            />
            <BreadcrumbSection currentPage="Health Check Up" />

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start mt-6">
                    {/* Left Side Component (Packages) */}
                    <div className="flex-1 w-full">
                        <h2 className="text-[21px] font-bold text-[#1e293b] mb-8 tracking-wide">
                            BSH HEALTH CHECK-UP SERVICES (PACKAGES)
                        </h2>

                        {packagesLoading ? (
                            <div className="flex py-20 items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[#00A884]" />
                            </div>
                        ) : packages.length === 0 ? (
                            <p className="text-gray-500 italic">No health checkup packages available currently.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                                <div className="space-y-5">
                                    {leftColumnPackages.map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => pkg.image ? setSelectedPackage(pkg) : null}
                                            className="flex items-center group w-full text-left"
                                        >
                                            <ArrowRightCircle className="w-4 h-4 shrink-0 text-[#00A884] mr-2 transition-transform group-hover:translate-x-1" />
                                            <span className="text-[#3fc0ad] hover:text-[#00A884] text-[15.5px] font-medium tracking-tight">
                                                {pkg.package_name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-5">
                                    {rightColumnPackages.map(pkg => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => pkg.image ? setSelectedPackage(pkg) : null}
                                            className="flex items-center group w-full text-left"
                                        >
                                            <ArrowRightCircle className="w-4 h-4 shrink-0 text-[#00A884] mr-2 transition-transform group-hover:translate-x-1" />
                                            <span className="text-[#3fc0ad] hover:text-[#00A884] text-[15.5px] font-medium tracking-tight">
                                                {pkg.package_name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side Dependencies / Ads */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-3 pt-2">
                        {facilitiesLoading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded" />)}
                            </div>
                        ) : (
                            <>
                                {facilities.map((facility, idx) => (
                                    <Link
                                        key={facility.id}
                                        to={`/facilities/${facility.id}`}
                                        className="flex items-center h-[72px] rounded-lg bg-[#1eb596] hover:bg-[#199d82] transition-colors text-white px-5 shadow-sm"
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center border border-white/30 shrink-0 mr-4 rounded-full">
                                            {/* Dummy SVG since image might be URL */}
                                            <img src={facility.image || "/images/dept-icon-placeholder.png"} onError={(e) => { e.currentTarget.style.display = 'none'; }} alt="" className="w-6 h-6 object-contain filter invert brightness-0" />
                                        </div>
                                        <span className="text-[14px] font-bold tracking-wide">{facility.title}</span>
                                    </Link>
                                ))}
                                <Link
                                    to="/facilities"
                                    className="flex items-center justify-center bg-[#34358a] hover:bg-[#252669] transition-colors text-white py-4 shadow-sm w-full font-bold text-[14px] uppercase tracking-wider"
                                >
                                    More Departments
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for viewing package image directly */}
            <Dialog open={!!selectedPackage} onOpenChange={(open) => !open && setSelectedPackage(null)}>
                <DialogContent className="max-w-[700px] w-full p-0 overflow-hidden bg-white border-none shadow-none focus:outline-none focus:ring-0 flex justify-center items-center">
                    <DialogTitle className="sr-only">Viewing Package: {selectedPackage?.package_name}</DialogTitle>
                    {selectedPackage?.image ? (
                        <div className="relative w-full overflow-hidden flex justify-center mt-8">
                            {/* <button
                                onClick={() => setSelectedPackage(null)}
                                className="absolute -top-3 right-0 md:-right-3 z-50 bg-[#1e293b] text-white p-2 rounded-md hover:bg-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button> */}
                            <img
                                src={selectedPackage.image.startsWith('http') ? selectedPackage.image : `http://api.mediparkhospital.com${selectedPackage.image}`}
                                alt={selectedPackage.package_name}
                                className="w-full max-h-[85vh] object-contain"
                            />
                        </div>
                    ) : (
                        <div className="bg-white p-8 text-center text-gray-500 rounded-xl">
                            Sorry, no preview image available for this package.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
