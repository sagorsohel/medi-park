import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section';
import { BreadcrumbSection } from '@/components/website/breadcrumb-section';
import { Button } from '@/components/ui/button';
import { JobApplicationModal } from '@/components/website/job-application-modal';
import { MapPin, Clock, Briefcase, Users, DollarSign, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useGetJobDetailByIdQuery } from "@/services/jobApi";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: jobResponse, isLoading } = useGetJobDetailByIdQuery(Number(id), { skip: !id });
  const job = jobResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Job not found</h2>
        <Button onClick={() => navigate("/career")}>Return to Careers</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={job.job_title} alt={`${job.job_title} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={job.job_title} />

      {/* Job Detail Content */}
      <section className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/career")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            See All Positions
          </Button>

          {/* Job Title */}
          <h1 className="text-4xl font-bold text-primary mb-8">
            {job.job_title}
          </h1>

          {/* PURPOSE */}
          {job.purpose && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">PURPOSE</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.purpose }}
              />
            </div>
          )}

          {/* GENERAL JOB DESCRIPTION */}
          {job.general_job_description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">GENERAL JOB DESCRIPTION</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.general_job_description }}
              />
            </div>
          )}

          {/* DEPARTMENT SPECIFIC JOB DESCRIPTION */}
          {job.department_specific_job_description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">DEPARTMENT SPECIFIC JOB DESCRIPTION</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.department_specific_job_description }}
              />
            </div>
          )}

          {/* TRAINING & DEVELOPMENT */}
          {job.training_and_development && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">TRAINING & DEVELOPMENT</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.training_and_development }}
              />
            </div>
          )}

          {/* Prevention And Control of Infections */}
          {job.prevention_and_control_of_infections && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Prevention And Control of Infections (PCI)</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.prevention_and_control_of_infections }}
              />
            </div>
          )}

          {/* Basic Competencies */}
          {job.basic_competencies && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Basic Competencies</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.basic_competencies }}
              />
            </div>
          )}

          {/* Behavioral Competencies */}
          {job.behavioral_competencies && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Behavioral Competencies</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.behavioral_competencies }}
              />
            </div>
          )}

          {/* Job Details */}
          <div className="border-t pt-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Job Location</p>
                  <p className="font-semibold text-gray-900">{job.job_location || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Employment Status</p>
                  <p className="font-semibold text-gray-900">{job.employment_status || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">{job.experience || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Vacancy</p>
                  <p className="font-semibold text-gray-900">{job.vacancy || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Salary Range</p>
                  <p className="font-semibold text-gray-900">{job.salary_range || "Negotiable"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-semibold text-gray-900">{job.deadline || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-primary hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-lg flex-1 sm:flex-none"
                onClick={() => setIsModalOpen(true)}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="border-blue-900 text-primary hover:bg-blue-50 px-8 py-6 text-lg rounded-lg flex-1 sm:flex-none"
                onClick={() => navigate("/careers")}
              >
                ← See All Positions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {job && (
        <JobApplicationModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          jobTitle={job.job_title}
          jobId={job.id}
        />
      )}
    </div>
  );
}

