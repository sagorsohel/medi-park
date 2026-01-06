import { motion } from 'framer-motion'
import { PageHeroSection } from '@/components/website/page-hero-section'

export default function MessageOfChairmanPage() {
    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <PageHeroSection
                image="https://placehold.co/1920x600/1e3a8a/ffffff?text=Message+of+Chairman"
                heading="Message of Chairman"
                alt="Message of Chairman"
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
                                    src="https://placehold.co/400x500/e2e8f0/1e293b?text=Chairman"
                                    alt="Prof. Dr. Zahidul Haq"
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
                                MESSAGE OF CHAIRMAN
                                <div className="h-1 w-20 bg-[#10b981] mt-2 rounded-full"></div>
                            </h1>

                            <div className="space-y-6 text-gray-600 leading-relaxed mt-8 text-justify">
                                <p>
                                    Bangladesh Specialized Hospital PLC. becomes one of the most advanced and modern hospitals in Bangladesh with all the
                                    characteristics of a world-class hospital with a wide range of services and specialists, equipment, technology, ambiance and
                                    high-quality service. Bangladesh Specialized hospital is the landmark of a multitude of modern medical technology and
                                    advances through paperless medical records. Our skilled nurses, technologists, and administrators aided by state-of-the-art
                                    equipment, provides a congenial infrastructure for the medical professionals in providing healthcare in international standards.
                                </p>

                                <p>
                                    To fulfill the demand of the qualitative & supportive service, we have introduced a modern setup of advanced high-tech
                                    machinery chronologically for complete diagnosis with reliability and standard accuracy.
                                </p>

                                <p>
                                    We are committed to offering excellent healthcare service and that will be cost-effective for our patients. We also conduct
                                    continuous development and welfare for our staff in order to promote healthcare in Bangladesh. Listening to your whisper, we
                                    have inaugurated our 3rd building so that we can serve more people with proper care.
                                </p>

                                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-[#1e3a8a] mt-8">
                                    <p className="italic text-[#1e3a8a] font-medium">
                                        "We believe in a vision is 'To be a renowned organization at the leading-edge medicine, providing quality healthcare to meet
                                        our nation's aspirations'."
                                    </p>
                                </div>

                                <p>
                                    This is <span className="font-semibold text-[#10b981]">Bangladesh Specialized Hospital PLC.</span> because you are very special to us.
                                </p>

                                <div className="pt-8 mt-8 border-t border-gray-100">
                                    <p className="text-gray-500 mb-2">Best Wishes</p>
                                    <h3 className="text-xl font-bold text-[#1e3a8a]">PROF. DR. ZAHIDUL HAQ</h3>
                                    <p className="text-[#10b981] font-medium">Chairman, BSH PLC.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
