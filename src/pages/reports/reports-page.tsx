import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, User, ShieldCheck, Wrench, Home } from "lucide-react";
import { Link } from "react-router";

export default function ReportsPage() {
    return (
        <div className="w-full min-h-screen  bg-gray-50/50 py-28">
            <BreadcrumbSection currentPage="Online Report" />

            <div className="max-w-4xl mx-auto px-4 md:px-6 mt-16">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Medical Reports</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Access your diagnostic and laboratory reports instantly using your invoice number and registered mobile number.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                    {/* Decorative Background blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" /> Invoice / Bill Number
                                </label>
                                <Input
                                    placeholder="e.g. INV-2023-0001"
                                    className="bg-gray-50/80 h-14 text-lg px-4 border-gray-200 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Mobile Number / Patient ID
                                </label>
                                <Input
                                    placeholder="01XXXXXXXXX"
                                    className="bg-gray-50/80 h-14 text-lg px-4 border-gray-200 focus:border-primary"
                                />
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                Your data is secure and encrypted
                            </div>
                            <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg flex items-center gap-2">
                                <Search className="w-5 h-5" /> Search Reports
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Under Maintenance Banner Section */}
                <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                    <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative bg-rose-50 rounded-full p-5 border-2 border-rose-100 shadow-sm transition-transform hover:scale-110 duration-500">
                                    <Wrench className="w-12 h-12 text-rose-600 mb-1" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Section Update in Progress
                        </h2>

                        <div className="inline-block bg-rose-50 text-rose-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase border border-rose-200">
                            Currently Under Maintenance
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
                            We are redesigning this part of the site to give you cleaner, faster access to information that visitors and patients care about the most. Check back soon!
                        </p>

                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                                <Link to="/" className="flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Return Home
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm transition-all duration-300 w-full sm:w-auto">
                                <Link to="/contacts" className="flex items-center gap-2">
                                    Contact Us Instead
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
