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
      className={`relative rounded-[24px] p-6 w-full flex flex-col ${isPopular
        ? "bg-primary text-primary-foreground scale-105 z-10 min-h-[500px] shadow-2xl"
        : "bg-card text-primary border-[3px] border-primary h-fit shadow-md"
        } `}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <span className="bg-background border border-primary text-primary text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className={`mb-6 ${isPopular ? "" : "flex-1"}`}>
        <div className="flex gap-1 items-center">
          <div className="text-[32px] font-bold">${plan.price}</div>
          <div className={`text-sm font-medium mt-2 ${isPopular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            /{plan.duration}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
        <p className={`text-md font-semibold ${isPopular ? "text-primary-foreground" : "text-primary"}`}>
          {plan.description}
        </p>
      </div>

      <ul className={`space-y-3 mb-6 ${isPopular ? "" : "flex-1"}`}>
        {parsedFeatures.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-2">
            <div>
              <Check className={`h-5 w-5 rounded-full shrink-0 ${isPopular ? "text-primary-foreground bg-primary-foreground/20" : "bg-primary text-primary-foreground"}`} />
            </div>
            <span className={`text-sm ${isPopular ? "text-primary-foreground" : "text-primary"}`}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full rounded-[22px] py-2 px-4 font-medium transition-colors mt-auto ${isPopular
          ? "bg-background text-primary border-2 border-background hover:border-background hover:bg-primary hover:text-primary-foreground"
          : "bg-primary text-primary-foreground border-2 border-primary hover:bg-secondary hover:text-primary"
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
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12">Pricing</h2>
        </div>

        {/* Pricing Cards - Carousel on mobile, grid on desktop */}
        <div className="max-w-7xl mx-auto">
          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {activePlans.map((plan, index) => (
                  <CarouselItem key={plan.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
                    <PricingCard plan={plan} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Navigation buttons below cards */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <CarouselPrevious className="relative left-0 top-0 transform-none" />
                <CarouselNext className="relative right-0 top-0 transform-none" />
              </div>
            </Carousel>
          </div>

          {/* Desktop Grid */}
          <div className={`hidden lg:grid ${activePlans.length < 5 ? `lg:grid-cols-${activePlans.length}` : 'lg:grid-cols-5'} gap-4 items-center justify-center`}>
            {activePlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

