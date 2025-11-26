import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { JobCard } from '@/components/website/job-card'
import { EventCard } from '@/components/website/event-card'
import { Button } from '@/components/ui/button'

export default function CareerPage() {
  // Sample job data
  const jobs = [
    {
      id: 1,
      image: "/hero1.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    },
    {
      id: 2,
      image: "/hero2.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    },
    {
      id: 3,
      image: "/hero3.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    },
    {
      id: 4,
      image: "/hero4.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    },
    {
      id: 5,
      image: "/hero1.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    },
    {
      id: 6,
      image: "/hero2.png",
      title: "Resident Medical Officer",
      vacancy: "Multiple",
      deadline: "N/A",
      location: "Dhaka",
      type: "Full Time"
    }
  ]

  // Sample event data
  const events = [
    {
      id: 1,
      image: "/hero1.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    },
    {
      id: 2,
      image: "/hero2.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    },
    {
      id: 3,
      image: "/hero3.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    },
    {
      id: 4,
      image: "/hero4.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    },
    {
      id: 5,
      image: "/hero1.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    },
    {
      id: 6,
      image: "/hero2.png",
      date: "09 November 2025",
      title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
      link: "#"
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Career" alt="Career Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Career" />
      
      {/* Want to Join Our Team Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center">
            Want to join our team?
          </h2>
          <p className="text-gray-700 text-justify mb-8 max-w-4xl mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.
          </p>
          
          {/* HR Message Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            {/* Image */}
            <div className="w-full md:w-80 shrink-0">
              <div className="relative rounded-lg overflow-hidden border-2 border-blue-600">
                <img
                  src="/hero1.png"
                  alt="GEN MAMUN MOSTAFI (RTD)"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
                <div className="bg-blue-900 text-white p-4">
                  <p className="font-bold text-lg">GEN MAMUN MOSTAFI (RTD)</p>
                  <p className="text-sm mt-1">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Message from Senior Director, HR
              </h3>
              <p className="text-gray-700 text-justify mb-4">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries, but also the leap into 
                electronic typesetting, remaining essentially unchanged.
              </p>
              <p className="text-gray-700 text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five.
              </p>
            </div>
          </div>
          
          {/* Additional Text */}
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-gray-700 text-justify">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type 
              specimen book. It has survived not only five centuries, but also the leap into 
              electronic typesetting, remaining essentially unchanged.
            </p>
            <p className="text-gray-700 text-justify">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
              when an unknown printer took a galley of type and scrambled it to make a type 
              specimen book. It has survived not only five.
            </p>
          </div>
        </div>
      </section>
      
      {/* Apply for a Job Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
            Apply for a job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                image={job.image}
                title={job.title}
                vacancy={job.vacancy}
                deadline={job.deadline}
                location={job.location}
                type={job.type}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Join US Banner Section */}
      <section className="w-full bg-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join US
              </h2>
              <p className="text-white text-lg">
                Submit your resume, we will contact you when a relevant opportunity becomes available.
              </p>
            </div>
            <Button 
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg whitespace-nowrap"
              onClick={() => {
                // Handle submit resume action
                console.log("Submit resume clicked")
              }}
            >
              Submit your resume
            </Button>
          </div>
        </div>
      </section>
      
      {/* Employee Engagement & Events Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
            Employee Engagement & Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                image={event.image}
                date={event.date}
                title={event.title}
                link={event.link}
              />
            ))}
          </div>
          <div className="text-center">
            <Button 
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => {
                // Handle view all news action
                console.log("View all Medipark News clicked")
              }}
            >
              View all Medipark News
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

