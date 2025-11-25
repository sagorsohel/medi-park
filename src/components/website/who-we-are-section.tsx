"use client";

export function WhoWeAreSection() {
  return (
    <div className="relative w-full bg-blue-900 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Cards - Above Heading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Left Image Card */}
          <div className="relative group flex justify-center">
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
              <img
                src="/about1.png"
                alt="Medical professional in operating room"
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </div>

          {/* Middle Image Card */}
          <div className="relative group flex justify-center">
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
              <img
                src="/about-2.png"
                alt="Medical professionals"
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </div>

          {/* Right Image Card */}
          <div className="relative group flex justify-center">
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
              <img
                src="/about3.png"
                alt="Medical professionals"
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </div>
        </div>

        {/* Who We Are Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Who We Are
          </h1>
        </div>

        {/* Text Block */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-white leading-relaxed text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </div>
  );
}

