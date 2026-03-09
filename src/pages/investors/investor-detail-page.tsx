import { useParams, Link } from "react-router";
import { useGetInvestorByIdQuery } from "@/services/investorApi";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Loader2, ArrowLeft, Phone, Building2, User, CreditCard, ShieldCheck, FileText, BadgeDollarSign, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvestorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useGetInvestorByIdQuery(Number(id), {
        skip: !id,
    });

    const investor = data?.data;

    return (
        <div className="w-full min-h-screen bg-gray-50/50 pb-20">
            <BreadcrumbSection currentPage={investor?.investor_name || investor?.applicant_full_name || "Investor Details"} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <Button asChild variant="ghost" className="mb-8 text-primary hover:bg-primary/10 -ml-4">
                    <Link to="/investors" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Investors
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

                            {/* Contact Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <Phone className="w-5 h-5 text-primary" /> Contact Information
                                </h3>
                                <div className="space-y-3 gap-4">
                                    {investor.email_address && (
                                        <div><span className="block text-sm text-gray-500">Email</span><span className="text-gray-900">{investor.email_address}</span></div>
                                    )}
                                    {investor.mobile_number && (
                                        <div><span className="block text-sm text-gray-500">Mobile Number</span><span className="text-gray-900">{investor.mobile_number}</span></div>
                                    )}
                                    {investor.present_address && (
                                        <div><span className="block text-sm text-gray-500">Present Address</span><span className="text-gray-900 whitespace-pre-wrap">{investor.present_address}</span></div>
                                    )}
                                    {investor.permanent_address && (
                                        <div><span className="block text-sm text-gray-500">Permanent Address</span><span className="text-gray-900 whitespace-pre-wrap">{investor.permanent_address}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <User className="w-5 h-5 text-primary" /> Personal Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {investor.gender && (
                                        <div><span className="block text-sm text-gray-500">Gender</span><span className="text-gray-900 capitalize">{investor.gender}</span></div>
                                    )}
                                    {investor.date_of_birth && (
                                        <div><span className="block text-sm text-gray-500">Date of Birth</span><span className="text-gray-900">{investor.date_of_birth}</span></div>
                                    )}
                                    {investor.nationality && (
                                        <div><span className="block text-sm text-gray-500">Nationality</span><span className="text-gray-900">{investor.nationality}</span></div>
                                    )}
                                    {investor.religion && (
                                        <div><span className="block text-sm text-gray-500">Religion</span><span className="text-gray-900">{investor.religion}</span></div>
                                    )}
                                    {investor.nid_pp_bc_number && (
                                        <div className="col-span-2"><span className="block text-sm text-gray-500">NID / PP / BC Number</span><span className="text-gray-900">{investor.nid_pp_bc_number}</span></div>
                                    )}
                                    {investor.tin_number && (
                                        <div className="col-span-2"><span className="block text-sm text-gray-500">TIN Number</span><span className="text-gray-900">{investor.tin_number}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Family Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <Home className="w-5 h-5 text-primary" /> Family Details
                                </h3>
                                <div className="space-y-4">
                                    {investor.fathers_name && (
                                        <div><span className="block text-sm text-gray-500">Father's Name</span><span className="text-gray-900">{investor.fathers_name}</span></div>
                                    )}
                                    {investor.mothers_name && (
                                        <div><span className="block text-sm text-gray-500">Mother's Name</span><span className="text-gray-900">{investor.mothers_name}</span></div>
                                    )}
                                    {investor.spouses_name && (
                                        <div><span className="block text-sm text-gray-500">Spouse's Name</span><span className="text-gray-900">{investor.spouses_name}</span></div>
                                    )}
                                    {investor.marital_status && (
                                        <div><span className="block text-sm text-gray-500">Marital Status</span><span className="text-gray-900 capitalize">{investor.marital_status}</span></div>
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
                                    {investor.number_of_hss && (
                                        <div><span className="block text-sm text-gray-500">Number of HSS</span><span className="text-gray-900">{investor.number_of_hss}</span></div>
                                    )}
                                    {investor.price_per_hss && (
                                        <div><span className="block text-sm text-gray-500">Price per HSS</span><span className="text-gray-900">{investor.price_per_hss}</span></div>
                                    )}
                                    {investor.total_price && (
                                        <div><span className="block text-sm text-gray-500">Total Price</span><span className="text-gray-900">{investor.total_price}</span></div>
                                    )}
                                    {investor.agreed_price && (
                                        <div className="col-span-2"><span className="block text-sm text-gray-500">Agreed Price</span><span className="text-gray-900">{investor.agreed_price}</span></div>
                                    )}
                                    {investor.total_price_in_words && (
                                        <div className="col-span-2"><span className="block text-sm text-gray-500">In Words</span><span className="text-gray-900 text-sm whitespace-pre-wrap">{investor.total_price_in_words}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full md:col-span-2 lg:col-span-1">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                    <CreditCard className="w-5 h-5 text-primary" /> Payment Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {investor.mode_of_payment && (
                                        <div className="col-span-2"><span className="block text-sm text-gray-500">Mode of Payment</span><span className="text-gray-900 capitalize">{investor.mode_of_payment.replace(/_/g, ' ')}</span></div>
                                    )}
                                    {investor.booking_money && (
                                        <div><span className="block text-sm text-gray-500">Booking Money</span><span className="text-gray-900">{investor.booking_money}</span></div>
                                    )}
                                    {investor.down_payment && (
                                        <div><span className="block text-sm text-gray-500">Down Payment</span><span className="text-gray-900">{investor.down_payment}</span></div>
                                    )}
                                    {(investor.installment_start_from || investor.installment_start_to) && (
                                        <div className="col-span-2">
                                            <span className="block text-sm text-gray-500">Installment Period</span>
                                            <span className="text-gray-900">
                                                {investor.installment_start_from || 'N/A'} to {investor.installment_start_to || 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nominee details */}
                            {investor.nominee_name && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 h-full md:col-span-2 lg:col-span-1">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
                                        <User className="w-5 h-5 text-primary" /> Nominee Details
                                    </h3>
                                    <div className="flex items-center gap-4 mb-4 mt-2">
                                        {investor.nominee_image && (
                                            <img src={investor.nominee_image} alt={investor.nominee_name} className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">{investor.nominee_name}</p>
                                            <p className="text-sm text-gray-500">Relation: {investor.nominee_relation}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {investor.nominee_mobile_number && (
                                            <div><span className="block text-sm text-gray-500">Mobile Number</span><span className="text-gray-900">{investor.nominee_mobile_number}</span></div>
                                        )}
                                        {investor.nominee_nid_pp_bc_number && (
                                            <div><span className="block text-sm text-gray-500">NID / PP / BC Number</span><span className="text-gray-900">{investor.nominee_nid_pp_bc_number}</span></div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
