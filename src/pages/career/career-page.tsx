import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { JobCard } from '@/components/website/job-card'
import { EventCard } from '@/components/website/event-card'
import { Button } from '@/components/ui/button'
import { useGetCareerPagesQuery } from '@/services/careerPageApi'
import { useGetJobDetailsQuery } from '@/services/jobApi'
import { useGetNewsPublicQuery } from '@/services/newsApi'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function CareerPage() {
  const navigate = useNavigate();
  // Fetch data
  const { data: careerDataResponse, isLoading: careerLoading } = useGetCareerPagesQuery();
  const { data: jobDataResponse, isLoading: jobLoading } = useGetJobDetailsQuery();
  const { data: newsDataResponse, isLoading: newsLoading } = useGetNewsPublicQuery(1);

  if (careerLoading || jobLoading || newsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const careerData = careerDataResponse?.data?.[0];
  const jobs = jobDataResponse?.data || [];
  const events = newsDataResponse?.data?.slice(0, 3) || []; // showing latest 3 news/events

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={careerData?.title || "Career"} alt="Career Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={careerData?.title || "Career"} />

      {/* Want to Join Our Team Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary mb-6 text-center block mx-auto border-b-2 pb-2 w-fit">
            {careerData?.section1 || "Want to join our team?"}
          </h2>

          {/* Message Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8 mt-12">
            {/* Image */}
            <div className="w-full md:w-60 shrink-0">
              <div className="relative rounded-[22px] overflow-hidden border-2 bg-primary border-blue-600">
                <div className='border rounded-b-[22px] bg-primary'>
                  <img
                    src={careerData?.card_image || "/hero1.png"}
                    alt={careerData?.card_title || "Image"}
                    className="w-full h-[200px] object-cover border rounded-b-[22px]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                </div>
                <div className="bg-primary text-white p-4 text-center">
                  <p className="font-bold text-md">{careerData?.card_title}</p>
                  <p className="text-sm mt-1 text-blue-100">
                    {careerData?.card_subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-4">
                {careerData?.message_title || "Message"}
              </h3>
              <div
                className="text-gray-700 text-justify mb-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: careerData?.card_description || "" }}
              />
              <div
                className="text-gray-700 text-justify prose max-w-none"
                dangerouslySetInnerHTML={{ __html: careerData?.message_description || "" }}
              />
            </div>
          </div>

          {/* Additional Text */}
          {careerData?.after_message_section && (
            <div className="max-w-4xl mx-auto mt-8">
              <div
                className="text-gray-700 text-justify prose max-w-none"
                dangerouslySetInnerHTML={{ __html: careerData.after_message_section }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Apply for a Job Section */}
      <section className="w-full bg-primary/30 rounded-t-lg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">
            {careerData?.job_section_title || "Available Positions"}
          </h2>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} onClick={() => navigate(`/careers/job/${job.id}`)} className="cursor-pointer hover:shadow-lg transition-shadow rounded-xl">
                  <JobCard
                    id={job.id}
                    image="/hero1.png" // Could be dynamic if job has image
                    title={job.job_title}
                    vacancy={job.vacancy?.toString() || "N/A"}
                    deadline={job.deadline || "N/A"}
                    location={job.job_location || "N/A"}
                    type={job.employment_status || "Full Time"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg opacity-80">
              <p className="text-gray-600 text-lg">No active jobs found at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join US Banner Section */}
      <section className="w-full bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {careerData?.join_us_section_title || "Join Us"}
              </h2>
              <div
                className="text-white text-lg prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: careerData?.join_us_section_subtitle || "" }}
              />
            </div>
            <Button
              className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-lg whitespace-nowrap"
              onClick={() => {
                navigate("/contact"); // Assuming resume submission happens via contact or a dedicated form
              }}
            >
              {careerData?.join_us_section_button || "Submit your resume"}
            </Button>
          </div>
        </div>
      </section>

      {/* Employee Engagement & Events Section */}
      {events.length > 0 && (
        <section className="w-full bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">
              {careerData?.employee_engagement_title || "Employee Engagement & Events"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <div key={event.id} onClick={() => navigate(`/news-detail/${event.id}`)} className="cursor-pointer">
                  <EventCard
                    image={event.feature_image || "/hero1.png"}
                    date={new Date(event.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    title={event.title}
                    link={`/news-detail/${event.id}`}
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button
                className="bg-primary hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-lg"
                onClick={() => navigate("/news-and-events")}
              >
                {careerData?.employee_engagement_button || "View all Medipark News"}
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

