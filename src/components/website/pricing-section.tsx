"use client";

import { Check } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useGetHomepagePricingsQuery, type HomepagePricing } from "@/services/homepagePricingApi";
import { Loader2 } from "lucide-react";

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
  } catch (e) { /* ignore */ }

  return (
    <div
      className={`relative rounded-[24px] p-6 w-full flex flex-col mx-auto ${isPopular
        ? "bg-primary text-primary-foreground lg:scale-105 z-10 min-h-[400px] lg:min-h-[500px] shadow-2xl"
        : "bg-white text-primary border-[3px] border-primary min-h-[400px] lg:h-fit shadow-md"
        } `}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-white border-2 border-primary text-primary text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-1 items-baseline">
          <span className={`text-2xl md:text-3xl font-bold ${isPopular ? "text-primary-foreground/90" : "text-primary/60"}`}>$</span>
          <span className="text-[40px] md:text-[48px] font-extrabold tracking-tight">{plan.price}</span>
          <span className={`text-sm md:text-base font-semibold ml-1 ${isPopular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            /{plan.duration}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 mt-2">{plan.title}</h3>
        <p className={`text-sm md:text-md font-medium leading-relaxed ${isPopular ? "text-primary-foreground/90" : "text-primary/70"}`}>
          {plan.description}
        </p>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {parsedFeatures.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <div className={`mt-1 h-5 w-5 rounded-full shrink-0 flex items-center justify-center ${isPopular ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              <Check className="h-3.5 w-3.5 stroke-[3px]" />
            </div>
            <span className={`text-[15px] leading-snug ${isPopular ? "text-primary-foreground" : "text-gray-700"}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full rounded-full py-3 px-6 font-bold transition-all duration-300 transform active:scale-95 ${isPopular
          ? "bg-white text-primary hover:bg-white/90 shadow-lg"
          : "bg-primary text-white hover:bg-primary/90 shadow-md"
          }`}
      >
        Choose plan
      </button>
    </div>
  );
}

export function PricingSection() {
  const { data, isLoading } = useGetHomepagePricingsQuery(1);
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
    <div className="w-full bg-[#f8fafc] py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">Our Pricing Plans</h2>
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
              <CarouselContent className="-ml-4 py-12"> {/* Added py-12 for badge/scale clearance */}
                {activePlans.map((plan) => (
                  <CarouselItem key={plan.id} className="pl-4 basis-[90%] sm:basis-1/2">
                    <div className="px-1">
                      <PricingCard plan={plan} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Navigation buttons below cards */}
              <div className="flex justify-center items-center gap-6 mt-4">
                <CarouselPrevious className="static transform-none h-12 w-12 border-2 border-primary/20 hover:border-primary text-primary transition-all" />
                <CarouselNext className="static transform-none h-12 w-12 border-2 border-primary/20 hover:border-primary text-primary transition-all" />
              </div>
            </Carousel>
          </div>

          {/* Desktop Grid */}
          <div className={`hidden lg:grid gap-6 items-stretch justify-center pt-8 ${activePlans.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
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
      </div>
    </div>
  );
}

