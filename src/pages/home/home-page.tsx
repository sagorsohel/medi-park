import { HeroSection } from '@/components/website/hero-section'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LayoutGrid, Shield, Users, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section with Auto-Slider */}
      <HeroSection />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Dashboard</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Get a comprehensive overview of your application with real-time analytics and insights.
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/admin/dashboard">
              View Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Admin Panel</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Manage your application settings, users, and system configuration with our powerful admin interface.
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/admin/login">
              Access Admin Panel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">User Portal</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Easy-to-use interface for users to access features, manage their profiles, and interact with the application.
          </p>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/user/login">
              Access User Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="p-8 md:p-12 bg-muted/50">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Choose your role and sign in to access your personalized dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/admin/login">Admin Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/user/login">User Login</Link>
            </Button>
          </div>
        </Card>
      </section>
      </div>
    </div>
  )
}
