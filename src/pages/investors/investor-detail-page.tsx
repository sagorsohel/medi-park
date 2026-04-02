import { useParams, Link } from "react-router";
import { useGetInvestorByIdQuery } from "@/services/investorApi";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Loader2, ArrowLeft, Building2, User, ShieldCheck, FileText, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvestorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetInvestorByIdQuery(Number(id), {
        skip: !id,
    });

    const investor = data?.data;

    return (
        <div className="w-full min-h-screen bg-gray-50/50">
            <BreadcrumbSection currentPage={investor?.investor_name || investor?.applicant_full_name || "Investor Details"} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <Button asChild variant="ghost" className="mb-8 text-primary hover:bg-primary/10 -ml-4">
                    <Link to="/investors" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Our Lagecy Partners
                    </Link>
                </Button>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : !investor ? (
                    <div className="text-center py-20 text-gray-500 text-lg bg-white rounded-3xl shadow-sm border border-gray-100">
                        Investor not found.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Header Profile Card */}
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            <div className="h-32 bg-primary/10 relative">
                                <div className="absolute inset-0 bg-linear-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40" />
                            </div>

                            <div className="px-6 md:px-10 pb-10">
                                <div className="flex flex-col md:flex-row gap-8 -mt-16 relative z-10">
                                    <div className="shrink-0 flex justify-center md:justify-start">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white p-2 shadow-xl border border-gray-100">
                                            <img
                                                src={investor.image || investor.applicant_image || "/vite.svg"}
                                                alt={investor.investor_name || investor.applicant_full_name}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/vite.svg";
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 pt-4 text-center md:text-left space-y-2">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {investor.investor_name || investor.applicant_full_name}
                                        </h1>
                                        <p className="text-lg text-primary font-medium flex items-center justify-center md:justify-start gap-2">
                                            <Building2 className="w-5 h-5" />
                                            {investor.profession || investor.organization || "Investor"}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                                <FileText className="w-4 h-4" /> File: {investor.file_number || 'N/A'}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                                                <BadgeDollarSign className="w-4 h-4" /> Share Type: {investor.category_of_share || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {investor.about && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {investor.about}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



                            {/* Personal Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <User className="w-5 h-5 text-primary" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {investor.gender && (
                                        <div><span className="block text-sm text-gray-500">Gender</span><span className="text-gray-900 capitalize">{investor.gender}</span></div>
                                    )}
                                    {investor.nationality && (
                                        <div><span className="block text-sm text-gray-500">Nationality</span><span className="text-gray-900">{investor.nationality}</span></div>
                                    )}
                                    {investor.religion && (
                                        <div><span className="block text-sm text-gray-500">Religion</span><span className="text-gray-900">{investor.religion}</span></div>
                                    )}
                                </div>
                            </div>



                            {/* Share Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <ShieldCheck className="w-5 h-5 text-primary" /> Share Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {investor.category_of_share && (
                                        <div><span className="block text-sm text-gray-500">Share Category</span><span className="text-gray-900">{investor.category_of_share}</span></div>
                                    )}
                                    {investor.file_number && (
                                        <div><span className="block text-sm text-gray-500">File Number</span><span className="text-gray-900">{investor.file_number}</span></div>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
