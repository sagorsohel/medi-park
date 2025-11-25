"use client";

import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Foundation Share",
    price: "$19",
    tagline: "Unleash the power of automation.",
    features: [
      "Multi-step Zaps",
      "3 Premium Apps",
      "2 Users team"
    ],
    popular: false
  },
  {
    name: "Standard Ownership",
    price: "$19",
    tagline: "Unleash the power of automation.",
    features: [
      "Multi-step Zaps",
      "3 Premium Apps",
      "2 Users team"
    ],
    popular: false
  },
  {
    name: "Premium Stake",
    price: "$89",
    tagline: "Automation plus enterprise-grade features.",
    features: [
      "Multi-step Zap",
      "Unlimited Premium",
      "Unlimited Users Team",
      "Advanced Admin",
      "Custom Data Retention"
    ],
    popular: true
  },
  {
    name: "Elite Circle",
    price: "$19",
    tagline: "Unleash the power of automation.",
    features: [
      "Multi-step Zaps",
      "3 Premium Apps",
      "2 Users team"
    ],
    popular: false
  },
  {
    name: "Legacy Partner",
    price: "$19",
    tagline: "Unleash the power of automation.",
    features: [
      "Multi-step Zaps",
      "3 Premium Apps",
      "2 Users team"
    ],
    popular: false
  }
];

export function PricingSection() {
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-12">Pricing</h2>
        </div>

        {/* Pricing Cards - Horizontal scroll on mobile, no break on desktop */}
        <div className="">
          <div className="flex gap-4 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5 max-w-7xl mx-auto items-center justify-center">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-[24px] p-6 min-w-[280px] lg:min-w-0 flex flex-col ${
                  plan.popular
                    ? "bg-blue-900 text-white scale-105 z-10 min-h-[500px] shadow-2xl"
                    : "bg-white text-blue-900 border-[3px] border-blue-900 h-fit shadow-md"
                } `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-white border border-blue-900  text-blue-900 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  </div>
                )}

              <div className={`mb-6 ${plan.popular ? "" : "flex-1"}`}>
                <div className="flex gap-1 items-center">
                <div className="text-[32px] font-bold ">{plan.price}</div>
                <div className={`text-sm font-medium mt-2 ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>
                  /month
                </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-md  font-semibold ${plan.popular ? " text-white" : "text-primary"}`}>
                  {plan.tagline}
                </p>
              </div>

              <ul className={`space-y-3 mb-6 ${plan.popular ? "" : "flex-1"}`}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <div >
                    <Check className={`h-5 w-5 rounded-full  shrink-0 ${plan.popular ? "text-white bg-[#234687]" : "bg-[#234687] text-white"}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? "text-white" : "text-[#234687]"} `}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-[22px] py-2 px-4 font-medium transition-colors mt-auto ${
                  plan.popular
                    ? "bg-white text-blue-900 border-2 border-white hover:border-white hover:bg-primary hover:text-white"
                    : "bg-primary text-white border-2 border-blue-900 hover:bg-blue-50 hover:text-primary"
                }`}
              >
                Choose plan
              </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

