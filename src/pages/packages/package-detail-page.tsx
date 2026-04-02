"use client";

import { useLocation, Link, Navigate } from "react-router";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Loader2, Check, ShieldCheck, Zap, Activity, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { HomepagePricing } from "@/services/homepagePricingApi";

export default function PackageDetailPage() {
  const location = useLocation();
  const plan = location.state?.plan as HomepagePricing | undefined;

  // If no plan data is passed, redirect back to packages list
  if (!plan) {
    return <Navigate to="/packages" replace />;
  }

  let parsedFeatures: string[] = [];
  try {
    if (typeof plan.features === "string") {
      parsedFeatures = JSON.parse(plan.features);
    } else if (Array.isArray(plan.features)) {
      parsedFeatures = plan.features;
    }
  } catch (e) { /* ignore */ }

  return (
    <div className="w-full bg-slate-50/50">
      {/* Hero Section */}
      <PageHeroSection
        image="/navbar-logo.png"
        heading={plan.title}
        alt={plan.title}
      />

      <BreadcrumbSection currentPage={plan.title} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Header Card */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-4 py-1.5 rounded-full tracking-wider">
                      Health Plan
                    </span>
                    {plan.highlight && (
                        <span className="bg-[#0B1B3D] text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-full tracking-wider animate-pulse">
                            Most Popular
                        </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-[#0B1B3D] tracking-tight">{plan.title}</h1>
                </div>
                <div className="text-left md:text-right">
                  <div className="flex items-baseline gap-1 md:justify-end">
                    <span className="text-2xl font-bold text-primary">TK</span>
                    <span className="text-5xl md:text-6xl font-black text-[#0B1B3D]">{plan.price}</span>
                  </div>
                  <p className="text-gray-400 font-bold uppercase text-sm tracking-widest mt-1">Per {plan.duration}</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600 mb-10 leading-relaxed font-medium">
                {plan.description}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none mb-1">Guaranteed Quality</h4>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Premium Healthcare Service</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none mb-1">Duration: {plan.duration}</h4>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Flexible Timing</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Detail */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-black text-[#0B1B3D] mb-8 flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                Package Features & Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                {parsedFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-primary/5 transition-colors group">
                    <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-primary/20 transition-all">
                      <Check className="w-4 h-4 text-primary stroke-[3px]" />
                    </div>
                    <span className="text-gray-700 font-bold transition-colors group-hover:text-primary">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* CTA Sidebar Card */}
            <div className="sticky top-28 bg-[#0B1B3D] rounded-[40px] p-10 text-white shadow-2xl overflow-hidden group">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />

              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-8">
                    <Heart className="w-10 h-10 text-primary" />
                 </div>
                 <h3 className="text-2xl font-black text-center mb-4">Subscribe To This Package</h3>
                 <p className="text-white/60 text-center font-medium text-sm mb-10 leading-relaxed">
                   Get instant access to all mentioned features and expert healthcare consultants.
                 </p>
                 
                 <div className="w-full space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-2xl shadow-lg text-lg uppercase tracking-widest">
                       Purchase Now
                    </Button>
                    <Link to="/packages" className="block w-full">
                        <Button variant="outline" className="w-full border-2 border-white/10 hover:bg-white/5 text-white font-bold h-16 rounded-2xl">
                           View Other Plans
                        </Button>
                    </Link>
                 </div>
                 
                 <p className="mt-8 text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
                    <Check className="w-3 h-3" />
                    Secure Transaction Guaranteed
                 </p>
              </div>
            </div>

            {/* Simple Contact Card */}
            <div className="bg-white rounded-[35px] p-8 border border-gray-100 shadow-sm">
                <h4 className="font-black text-[#0B1B3D] text-lg mb-4">Have Questions?</h4>
                <p className="text-gray-500 font-medium text-sm mb-6">Our health consultants are available 24/7 to help you choose the right plan.</p>
                <div className="flex items-center gap-4 text-primary font-black">
                   <Zap className="w-5 h-5 fill-current" />
                   <span>Call Hotline: 10633</span>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
