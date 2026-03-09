import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Button } from "@/components/ui/button";
import { Video, CalendarCheck, CreditCard, Stethoscope, Wrench, Home } from "lucide-react";
import { Link } from "react-router";

export default function TelemedicinePage() {
    return (
        <div className="w-full min-h-screen bg-gray-50/50 pb-20">
            <BreadcrumbSection currentPage="Telemedicine" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-16 space-y-20">

                {/* Intro */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                        <Video className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Consult a Doctor Online
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get expert medical advice from the comfort of your home. High-quality video consultations with top specialists, secure and easy to use.
                    </p>
                    <div className="pt-4">
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                            Book Video Consultation Now
                        </Button>
                    </div>
                </div>

                {/* How it Works section */}
                <div className="bg-white rounded-4xl p-8 md:p-16 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-gray-100">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">How Telemedicine Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                        <div className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                <CalendarCheck className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">1. Book Appointment</h4>
                            <p className="text-gray-600">
                                Choose your preferred specialty, find a doctor, and select a suitable time slot for your online visit.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                <CreditCard className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">2. Pay Securely</h4>
                            <p className="text-gray-600">
                                Complete the payment online using our SSL-secured gateway via Card, MFS or Net Banking.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                <Stethoscope className="w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">3. Video Consult</h4>
                            <p className="text-gray-600">
                                Join the video call link sent to your phone/email at the scheduled time to talk to your doctor.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Under Maintenance Banner Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
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
