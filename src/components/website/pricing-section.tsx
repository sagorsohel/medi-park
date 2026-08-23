import { Check, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Link } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useGetHomepagePricingsQuery, type HomepagePricing } from "@/services/homepagePricingApi";
import { useGetHeadingsQuery } from "@/services/headingApi";

interface PricingCardProps {
  plan: HomepagePricing;
}

function PricingCard({ plan }: PricingCardProps) {
  const isPopular = !!plan.highlight;
  let parsedFeatures: string[] = [];
  try {
    if (typeof plan.features === "string") {
      parsedFeatures = JSON.parse(plan.features);
    } else if (Array.isArray(plan.features)) {
      parsedFeatures = plan.features;
    }
  } catch (e) {
    if (typeof plan.features === "string") {
      parsedFeatures = (plan.features as string).split("\n").filter(Boolean);
    }
  }

  const hasOffer = Boolean(plan.final_price && plan.final_price !== plan.price);
  const regularPrice = plan.price || "";
  const offerPrice = plan.final_price || plan.price || "";

  return (
    <div
      className={`relative rounded-[28px] p-7 w-full flex flex-col mx-auto transition-all duration-300 ${isPopular
        ? "bg-gradient-to-b from-[#0B1B3D] to-[#081530] text-white lg:scale-105 z-10 min-h-[460px] shadow-2xl border-2 border-primary"
        : "bg-white text-gray-900 border-2 border-slate-200 min-h-[440px] shadow-lg hover:shadow-xl"
        }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-amber-400 text-[#0B1B3D] text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-md uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular Offer
          </span>
        </div>
      )}

      {/* Header Info */}
      <div className="mb-6">
        <h3 className={`text-2xl font-black mb-2 mt-1 ${isPopular ? "text-white" : "text-[#0B1B3D]"}`}>
          {plan.title}
        </h3>
        <p className={`text-sm font-medium leading-relaxed mb-5 ${isPopular ? "text-slate-300" : "text-gray-600"}`}>
          {plan.description}
        </p>

        {/* Pricing Hierarchy: Regular Price -> Special Early Benefit -> Exclusive Offer Price */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 dark:bg-white/5 dark:border-white/10">
          {/* 1. Regular Price */}
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold uppercase tracking-wider ${isPopular ? "text-slate-300" : "text-gray-500"}`}>
              Regular Price:
            </span>
            <span className={`font-bold text-sm ${hasOffer ? "line-through text-gray-400" : isPopular ? "text-amber-300" : "text-gray-800"}`}>
              Tk {regularPrice}
            </span>
          </div>

          {/* 2. Special Early Participation Benefit (Editable/Discount) */}
          {plan.discount_price ? (
            <div className="flex items-center justify-between text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold">
              <span>Special Early Benefit:</span>
              <span>Tk {plan.discount_price} Off</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold">
              <span>Early Participation Benefit</span>
              <span>Available</span>
            </div>
          )}

          {/* 3. Exclusive Offer Price */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex items-baseline justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${isPopular ? "text-amber-300" : "text-primary"}`}>
              Exclusive Offer:
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl sm:text-3xl font-black ${isPopular ? "text-amber-300" : "text-[#0B1B3D]"}`}>
                Tk {offerPrice}
              </span>
              {plan.duration && (
                <span className={`text-xs font-semibold ${isPopular ? "text-slate-300" : "text-gray-500"}`}>
                  /{plan.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bullet-point Features / Questions & Answers */}
      <div className="mb-6 flex-1">
        <h4 className={`text-xs font-black uppercase tracking-wider mb-3 ${isPopular ? "text-amber-300/90" : "text-primary"}`}>
          Key Benefits & Inclusions:
        </h4>
        <ul className="space-y-3">
          {parsedFeatures.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start gap-2.5 text-sm">
              <div className={`mt-0.5 h-4 w-4 rounded-full shrink-0 flex items-center justify-center ${isPopular ? "bg-amber-400/20 text-amber-300" : "bg-primary/10 text-primary"}`}>
                <Check className="h-2.5 w-2.5 stroke-[3px]" />
              </div>
              <span className={`leading-snug font-medium ${isPopular ? "text-slate-200" : "text-gray-700"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Link
        to={`/packages/${plan.id}`}
        state={{ plan }}
        className={`w-full rounded-2xl py-3.5 px-6 font-bold text-center block transition-all duration-300 transform active:scale-95 shadow-md ${isPopular
          ? "bg-amber-400 hover:bg-amber-300 text-[#0B1B3D] font-extrabold"
          : "bg-[#0B1B3D] hover:bg-primary text-white"
          }`}
      >
        Select Package
      </Link>
    </div>
  );
}

export function PricingSection() {
  const { data, isLoading } = useGetHomepagePricingsQuery(1);
  const { data: headingData } = useGetHeadingsQuery();
  const headings = headingData?.data;

  const activePlansRaw = data?.data?.filter(p => p.status === "active") || [];

  const regularPlans = activePlansRaw.filter(p => !p.highlight);
  const highlightedPlans = activePlansRaw.filter(p => p.highlight);

  const activePlans = [...regularPlans];
  highlightedPlans.forEach(hp => {
    const mid = Math.floor(activePlans.length / 2);
    activePlans.splice(mid, 0, hp);
  });

  if (isLoading) {
    return (
      <div className="w-full bg-white py-16 md:py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (activePlans.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#f8fafc] py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-3">
            Investment & Healthcare Packages
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4 tracking-tight">
            {headings?.homepage_pricing_section_title || "Investment Opportunity & Health Plans"}
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        {/* Pricing Cards - Carousel on mobile, grid on desktop */}
        <div className="max-w-7xl mx-auto">
          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel
              className="w-full"
              opts={{
                align: "center",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-4 py-10">
                {activePlans.map((plan) => (
                  <CarouselItem key={plan.id} className="pl-4 basis-[90%] sm:basis-1/2">
                    <div className="px-1">
                      <PricingCard plan={plan} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center items-center gap-6 mt-4">
                <CarouselPrevious className="static transform-none h-12 w-12 border-2 border-primary/20 hover:border-primary text-primary transition-all" />
                <CarouselNext className="static transform-none h-12 w-12 border-2 border-primary/20 hover:border-primary text-primary transition-all" />
              </div>
            </Carousel>
          </div>

          {/* Desktop Grid */}
          <div className={`hidden lg:grid gap-8 items-stretch justify-center pt-6 ${activePlans.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
            activePlans.length === 2 ? 'lg:grid-cols-2 max-w-4xl mx-auto' :
              activePlans.length === 3 ? 'lg:grid-cols-3 max-w-6xl mx-auto' :
                activePlans.length === 4 ? 'lg:grid-cols-4' :
                  'lg:grid-cols-5'
            }`}>
            {activePlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Dynamic Button Link */}
        {(headings?.homepage_pricing_section_button_text || "Browse All Packages") && (
          <div className="mt-14 text-center">
            <Link
              to={headings?.homepage_pricing_section_button_link || "/packages"}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl active:scale-95 group"
            >
              {headings?.homepage_pricing_section_button_text || "Browse All Packages"}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}

        {/* Image After Browse All Package */}
        <div className="mt-16 max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative group">
          <div className="relative h-[240px] sm:h-[320px] md:h-[380px] w-full bg-gradient-to-r from-[#0B1B3D] via-[#0E224D] to-primary">
            <img
              src="/hero1.png"
              alt="MediPark Hospital Medical Excellence"
              className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-10 text-white bg-black/20">
              <span className="px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-widest mb-3">
                Excellence In Modern Healthcare
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black max-w-2xl leading-tight mb-3">
                Invest in Better Health, Exceptional Service & Advanced Facilities
              </h3>
              <p className="text-blue-100/90 text-sm sm:text-base max-w-xl">
                Partner with MediPark Specialized Hospital Limited for world-class patient care and healthcare infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
