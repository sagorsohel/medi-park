"use client";

export function AboutSection() {
  return (
    <div className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      {/* Background Curved Lines - SVG */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 1000"
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        {/* Subtle background curved lines */}
        <path
          d="M0,150 Q300,120 600,140 Q900,160 1200,150"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="opacity-40"
        />
        <path
          d="M0,200 Q400,180 800,200 Q1000,220 1200,210"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          className="opacity-30"
        />
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* About Us Navigation Button */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <button className="bg-gray-100 border border-gray-400 rounded-lg px-6 py-2 text-gray-800 font-medium text-sm md:text-base hover:bg-gray-200 transition-colors">
            About Us
          </button>
          <div className="w-0.5 h-8 bg-gray-600 mt-2" />
        </div>

        {/* Mission Statement - Left Aligned */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20 px-4">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-left">
            <span className="font-bold text-gray-900">At Medipark, our mission is simple:</span>{" "}
            to provide the highest quality medical care in an environment of genuine compassion and respect. 
            We believe that true health care goes beyond treating symptoms—it involves understanding the person.
          </p>
        </div>

        {/* Image Cards in Arc with SVG S-Curve Connecting Lines */}
        <div className="relative max-w-6xl mx-auto px-4">
          {/* SVG for S-curve pattern connecting images */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 1, height: '100%' }}
          >
            {/* S-curve from top left of left image, up towards text, then down to top left of center image */}
            <path
              d="M 200 450 Q 250 200 500 250 Q 750 300 800 450"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              className="opacity-60"
            />
            {/* Curve from top left of center image down to top left of right image */}
            <path
              d="M 500 250 Q 650 300 800 450"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              className="opacity-60"
            />
            {/* Line connecting bottom of left image to bottom of center image */}
            <path
              d="M 250 550 Q 400 550 500 550"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              className="opacity-50"
            />
            {/* Line connecting bottom of center image to bottom of right image */}
            <path
              d="M 500 550 Q 650 550 750 550"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              className="opacity-50"
            />
          </svg>

          {/* Images in arc layout - same positions as image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10 pb-20">
            {/* Left Image Card - Lower left position */}
            <div className="relative group transform md:translate-y-8">
              <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  shadow-sm">
                <img
                  src="/about1.png"
                  alt="Medical professionals in operating room"
                  className="w-[262px] h-[144px]  object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            </div>

            {/* Middle Image Card - Center position (higher) */}
            <div className="relative group transform md:translate-y-20 translate-x-12">
              <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  overflow-hidden shadow-sm">
                <img
                  src="/about-2.png"
                  alt="Doctor with patient"
                  className="w-[262px] h-[144px]  object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            </div>

            {/* Right Image Card - Lower right position */}
            <div className="relative group transform md:translate-y-10 translate-x-12">
              <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  overflow-hidden shadow-sm">
                <img
                  src="/about3.png"
                  alt="Medical items and equipment"
                  className="w-[262px] h-[144px]  object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

