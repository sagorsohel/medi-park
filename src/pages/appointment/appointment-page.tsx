import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, Stethoscope, MessageSquare, Wrench, Home } from "lucide-react";
import { Link } from "react-router";

export default function AppointmentPage() {
    return (
        <div className="w-full min-h-screen bg-gray-50/50 pb-20">
            -            <BreadcrumbSection currentPage="Request Appointment" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Info Section */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your Visit</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Schedule your appointment online. Our team will contact you to confirm the date and time.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                                    <p className="text-sm text-gray-600">Mon - Sun</p>
                                    <p className="text-sm text-gray-600">24/7 Emergency Service</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Emergency Call</h3>
                                    <p className="text-sm text-gray-600">+880 1234 567890</p>
                                    <p className="text-sm text-gray-600">Available 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" /> Patient Name
                                        </label>
                                        <Input placeholder="Enter full name" className="bg-gray-50/50" />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-primary" /> Phone Number
                                        </label>
                                        <Input placeholder="Enter phone number" className="bg-gray-50/50" />
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4 text-primary" /> Department
                                        </label>
                                        <select className="w-full flex h-10 rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="">Select Department</option>
                                            <option value="cardiology">Cardiology</option>
                                            <option value="neurology">Neurology</option>
                                            <option value="orthopedics">Orthopedics</option>
                                            <option value="pediatrics">Pediatrics</option>
                                        </select>
                                    </div>

                                    {/* Doctor */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" /> Preferred Doctor
                                        </label>
                                        <select className="w-full flex h-10 rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                            <option value="">Any Doctor</option>
                                            <option value="dr-smith">Dr. John Smith</option>
                                            <option value="dr-jane">Dr. Jane Doe</option>
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" /> Preferred Date
                                        </label>
                                        <Input type="date" className="bg-gray-50/50" />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-primary" /> Email Address
                                        </label>
                                        <Input type="email" placeholder="Enter email (optional)" className="bg-gray-50/50" />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" /> Additional Message
                                    </label>
                                    <Textarea placeholder="Briefly describe your medical issue or queries..." className="bg-gray-50/50 min-h-[120px]" />
                                </div>

                                <Button type="submit" size="lg" className="w-full md:w-auto px-8 text-base">
                                    Confirm Appointment Request
                                </Button>
                            </form>
                        </div>
                    </div>

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
