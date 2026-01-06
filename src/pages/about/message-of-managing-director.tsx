import { motion } from 'framer-motion'
import { PageHeroSection } from '@/components/website/page-hero-section'

export default function MessageOfManagingDirectorPage() {
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <PageHeroSection
                image="https://placehold.co/1920x600/10b981/ffffff?text=Message+of+Managing+Director"
                heading="Message of Managing Director"
                alt="Message of Managing Director"
                overlayOpacity={0.5}
            />

            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/3 bg-[#f0fdf4] p-8 flex items-center justify-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#10b981] rounded-lg transform rotate-3 transition-transform group-hover:rotate-6 opacity-20"></div>
                                <img
                                    src="https://placehold.co/400x500/e2e8f0/1e293b?text=Managing+Director"
                                    alt="Dr. Ahmed Zahid Hossain"
                                    className="relative z-10 rounded-lg shadow-lg w-full max-w-[300px] object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/placeholder-person.jpg";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 p-8 md:p-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2 uppercase relative inline-block">
                                MESSAGE OF MANAGING DIRECTOR
                                <div className="h-1 w-20 bg-[#10b981] mt-2 rounded-full"></div>
                            </h1>

                            <div className="space-y-6 text-gray-600 leading-relaxed mt-8 text-justify">
                                <p>
                                    It is a great privilege for me to introduce Bangladesh Specialized Hospital PLC, a state-of-the-art
                                    healthcare facility in the heart of Dhaka. We have designed this hospital with the belief that users
                                    deserve the best quality healthcare service in a friendly and comfortable environment.
                                </p>

                                <p>
                                    Our goal is to provide world-class healthcare services at an affordable cost. We have equipped our
                                    hospital with the latest medical technologies and have gathered a team of highly qualified and
                                    abroad-experienced consultants, nurses, and technicians.
                                </p>

                                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-[#1e3a8a] mt-8">
                                    <p className="italic text-[#1e3a8a] font-medium">
                                        "Our mission is to bring healthcare of international standards within the reach of every individual.
                                        We are committed to clinical excellence, patient-centricity, and ethical practices."
                                    </p>
                                </div>

                                <p>
                                    We are constantly striving to improve our services and facilities to meet the growing needs of our
                                    patients. Your health and well-being are our top priorities.
                                </p>

                                <p>
                                    Thank you for keeping your trust in <span className="font-semibold text-[#10b981]">Bangladesh Specialized Hospital PLC.</span>
                                </p>

                                <div className="pt-8 mt-8 border-t border-gray-100">
                                    <p className="text-gray-500 mb-2">Best Regards</p>
                                    <h3 className="text-xl font-bold text-[#1e3a8a]">DR. AHMED ZAHID HOSSAIN</h3>
                                    <p className="text-[#10b981] font-medium">Managing Director, BSH PLC.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
