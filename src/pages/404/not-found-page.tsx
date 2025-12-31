import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, Search, Clock, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-pink-500/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Main Content Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-16 border border-primary/20">
          <div className="space-y-8">
            {/* Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-ping"></div>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-primary via-pink-500 to-primary rounded-full p-8 animate-pulse">
                  <Search className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-primary">
                404
              </h1>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-6 h-6 animate-spin" />
                <p className="text-xl md:text-2xl font-semibold">Page Not Found</p>
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. 
              It might be under construction or has been moved to a new location.
            </p>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  What happened?
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The page you requested doesn't exist or may have been moved. 
                Try navigating back or visit our homepage to find what you're looking for.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Back to Home
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
              >
                <Link to="/coming-soon" className="flex items-center gap-2">
                  <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Coming Soon
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
                onClick={() => window.history.back()}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </div>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Need help? <Link to="/contacts" className="text-primary hover:underline font-medium">Contact us</Link> or check out our <Link to="/" className="text-primary hover:underline font-medium">homepage</Link></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

