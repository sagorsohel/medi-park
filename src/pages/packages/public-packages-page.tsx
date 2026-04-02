"use client";

import { Check, Star, ShieldCheck, Zap, Info } from "lucide-react";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { useGetHomepagePricingsQuery, type HomepagePricing } from "@/services/homepagePricingApi";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "react-router";

function PackageDetailsCard({ plan }: { plan: HomepagePricing }) {
  const isPopular = !!plan.highlight;
  let parsedFeatures: string[] = [];
  try {
    if (typeof plan.features === "string") {
      parsedFeatures = JSON.parse(plan.features);
    } else if (Array.isArray(plan.features)) {
      parsedFeatures = plan.features;
    }
  } catch (e) { /* ignore */ }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col md:flex-row rounded-3xl overflow-hidden border shadow-sm transition-all hover:shadow-xl ${
        isPopular ? "border-primary/30 ring-1 ring-primary/10" : "border-gray-100"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-[10px] font-bold px-6 py-1 rotate-[35deg] translate-x-[20px] translate-y-[10px] shadow-sm uppercase tracking-wider">
            Popular
          </div>
        </div>
      )}

      {/* Pricing Header Area */}
      <div className={`p-8 md:w-1/3 flex flex-col justify-center items-center text-center border-r border-gray-50 bg-gradient-to-br ${
        isPopular ? "from-primary/5 to-transparent" : "from-gray-50/50 to-transparent"
      }`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-bold text-primary">TK</span>
          <span className="text-5xl font-black text-gray-900">{plan.price}</span>
          <span className="text-gray-500 font-medium">/{plan.duration}</span>
        </div>
        <p className="text-gray-600 text-sm mb-8 max-w-[200px] leading-relaxed">
          {plan.description}
        </p>
        <Link 
          to={`/packages/${plan.id}`}
          state={{ plan }}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm text-center block transition-all ${
            isPopular ? "bg-primary text-white hover:bg-primary/90" : "bg-[#0B1B3D] text-white hover:bg-[#0B1B3D]/90"
          }`}
        >
          Select Package
        </Link>
      </div>

      {/* Features Content Area */}
      <div className="p-8 md:w-2/3 bg-white flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">What's included in this package</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {parsedFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/20">
                <Check className="w-3.5 h-3.5 text-primary stroke-[3px]" />
              </div>
              <span className="text-gray-700 font-medium leading-tight group-hover:text-gray-900 transition-colors">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Benefits/Incentives Footer */}
        <div className="mt-auto pt-8 flex flex-wrap gap-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">Verified Health Care</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">Top Rated Service</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">Customizable Care</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PublicPackagesPage() {
  const { data, isLoading } = useGetHomepagePricingsQuery(1);
  const activePlans = data?.data?.filter(p => p.status === "active") || [];

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <PageHeroSection
        image="/navbar-logo.png" // Using a safe default or placeholder
        heading="Packages & Plans"
        alt="Health Packages"
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Packages" />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-6 tracking-tight leading-tight">
            Transparent Pricing for <span className="text-primary underline decoration-4 underline-offset-8">Every Patient</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            Choose the perfect health package tailored to your needs. From routine checkups to specialized complex care, we provide quality healthcare with clear, affordable pricing.
          </p>
        </div>

        {/* Packages List */}
        <div className="flex flex-col gap-10">
          {activePlans.length > 0 ? (
            activePlans.map((plan) => (
              <PackageDetailsCard key={plan.id} plan={plan} />
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">No Packages Available Right Now</p>
            </div>
          )}
        </div>

        {/* FAQ/Contact Support CTA */}
        <div className="mt-24 p-12 rounded-[40px] bg-[#0B1B3D] text-white text-center relative overflow-hidden group">
          {/* Suttle accent spheres */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Need a specialized health plan?</h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Our consultants are ready to help you build a custom package that fits your exact requirements. Contact our patient support desk today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-full shadow-lg">
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-white font-bold h-14 px-10 rounded-full">
                View All Facilities
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
