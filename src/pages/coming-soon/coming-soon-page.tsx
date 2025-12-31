import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Clock, Mail, Home, Sparkles, Rocket, Calendar } from "lucide-react";
import { useState } from "react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  // Calculate days until a future date (example: 30 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);
  const daysLeft = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

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
                  <Rocket className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-primary">
                Coming Soon
              </h1>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-6 h-6 animate-spin" />
                <p className="text-xl md:text-2xl font-semibold">Something Amazing is on the Way!</p>
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We're working hard to bring you an incredible experience. 
              Stay tuned for updates and be the first to know when we launch!
            </p>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estimated Launch
                </span>
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">{daysLeft}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Days</div>
                </div>
                <div className="text-3xl text-primary">:</div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Hours</div>
                </div>
                <div className="text-3xl text-primary">:</div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Minutes</div>
                </div>
              </div>
            </div>

            {/* Email Subscription Form */}
            <div className="pt-4">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                  >
                    {submitted ? "✓ Subscribed!" : "Notify Me"}
                  </Button>
                </div>
                {submitted && (
                  <p className="mt-3 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                    Thank you! We'll notify you when we launch.
                  </p>
                )}
              </form>
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
                <Link to="/contacts" className="flex items-center gap-2">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>We're working around the clock to bring you the best experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

