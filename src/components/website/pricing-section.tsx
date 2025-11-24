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
    <div className="w-full bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">Pricing</h2>
        </div>

        {/* Pricing Cards - Horizontal scroll on mobile, no break on desktop */}
        <div className="">
          <div className="flex gap-4 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-lg p-6 min-w-[280px] lg:min-w-0 ${
                  plan.popular
                    ? "bg-blue-900 text-white scale-105 z-10"
                    : "bg-white text-blue-900"
                } shadow-md`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-white text-blue-900 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-3xl font-bold mb-1">{plan.price}</div>
                  <div className={`text-sm mb-3 ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>
                    /month
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.popular ? "text-blue-200" : "text-gray-600"}`}>
                    {plan.tagline}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 shrink-0 ${plan.popular ? "text-white" : "text-blue-600"}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-lg py-2 px-4 font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-900 text-white border-2 border-white hover:bg-blue-800"
                      : "bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-50"
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

