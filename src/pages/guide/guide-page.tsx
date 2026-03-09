import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ShieldAlert, Coffee, Bed, Phone, ArrowRight, Wrench, Home } from "lucide-react";
import { Link } from "react-router";

export default function GuidePage() {
    const guideTopics = [
        {
            icon: Clock,
            title: "Visiting Hours",
            description: "General Ward: 4:00 PM to 6:00 PM daily. ICU/CCU visits are restricted and require special permission.",
            colorClass: "bg-blue-50 text-blue-600",
        },
        {
            icon: MapPin,
            title: "Location & Floor Map",
            description: "Find your way around easily. Check out our interactive digital hospital map at the front desk.",
            colorClass: "bg-emerald-50 text-emerald-600",
        },
        {
            icon: Bed,
            title: "Admission Info",
            description: "What to bring when you are admitted: ID card, previous medical records, and daily essentials.",
            colorClass: "bg-purple-50 text-purple-600",
        },
        {
            icon: ShieldAlert,
            title: "Emergency Protocol",
            description: "In case of emergency, follow the red exit signs. Fire exits are located at both ends of the building.",
            colorClass: "bg-rose-50 text-rose-600",
        },
        {
            icon: Coffee,
            title: "Cafeteria & Dining",
            description: "The hospital cafeteria on the Ground Floor is open 24/7. Outside food is not allowed in patient rooms.",
            colorClass: "bg-amber-50 text-amber-600",
        },
        {
            icon: Phone,
            title: "Important Contacts",
            description: "Keep a list of important extension numbers handy for immediate assistance during your stay.",
            colorClass: "bg-indigo-50 text-indigo-600",
        },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50/50 py-28">
            <BreadcrumbSection currentPage="Patient & Visitors Guide" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-16">

                {/* Header Content */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Helpful Information for Your Visit
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you are here as a patient or visiting a loved one, we have compiled everything you need to know for a smooth and comfortable experience.
                    </p>
                </div>

                {/* Grid Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guideTopics.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col h-full"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.colorClass}`}>
                                <item.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                                {item.description}
                            </p>

                            <div className="mt-auto">
                                <Button variant="ghost" className="p-0 hover:bg-transparent text-primary hover:text-primary/80 font-semibold group flex items-center gap-2">
                                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-primary/5 rounded-4xl p-8 md:p-12 border border-primary/10 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left max-w-2xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Need direct assistance?</h3>
                        <p className="text-gray-600">Our customer support desk is located at the main lobby and is available 24/7 to help you.</p>
                    </div>
                    <Button size="lg" className="h-14 px-8 text-lg shrink-0 rounded-full shadow-lg">
                        View Hospital Map
                    </Button>
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
