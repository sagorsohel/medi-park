import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section';
import { BreadcrumbSection } from '@/components/website/breadcrumb-section';
import { Button } from '@/components/ui/button';
import { JobApplicationModal } from '@/components/website/job-application-modal';
import { MapPin, Clock, Briefcase, Users, DollarSign, Calendar, ArrowLeft } from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, this would be fetched from an API based on the id
  const job = {
    id: id || "1",
    title: "Resident Medical Officer",
    location: "Dhaka",
    type: "Full Time",
    experience: "",
    vacancy: "Multiple",
    salary: "Negotiable Taka",
    deadline: "N/A",
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={job.title} alt={`${job.title} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={job.title} />

      {/* Job Detail Content */}
      <section className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/careers")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            See All Positions
          </Button>

          {/* Job Title */}
          <h1 className="text-4xl font-bold text-primary mb-8">
            {job.title}
          </h1>

          {/* PURPOSE */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">PURPOSE</h2>
            <p className="text-gray-700 leading-relaxed">
              A Resident Medical Officer (RMO) provides essential medical care under the supervision of senior doctors and Consultant in the department.
              They are responsible for patient care, including initial assessments, treatment plans, and emergency responses.
              RMOs also play a crucial role in monitoring patient progress and collaborating with the healthcare team.
            </p>
          </div>

          {/* GENERAL JOB DESCRIPTION */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">GENERAL JOB DESCRIPTION</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Assessment of patients on admission.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Detailed history taking and Physical examination and documentation within the first 24 hours of admission.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Responsible for sending the appropriate investigations for patients as directed by the primary consultant and authorized to send investigations which are urgent.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Take daily rounds of the patients in the wards and assess them for treatment as deemed fit by consultant and review them regularly.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Responsible for completing the in-Patient rounds every day before and fill the case sheets and progress notes & all the necessary documents & JCI document in specific chart of medical record without fail.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Responsible for providing adequate treatment to the patient as advised and to check the dosage, frequency, route of administrations of all medications, considering all precautions.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Continually monitor and review patient progress and adjust the management plan when necessary and take appropriate initiatives in medical and surgical emergencies when required.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Preparation of discharge summaries well in time and briefing the patient about the medications on discharge.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Works under the guidance of Registrar/ Specialist in the department.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To follow hospital practices and demonstrate initiative aligned to ensure the safest possible environment for patients and staff.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To attend all clinical meetings and workshops and actively participate in paper presentations.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To be part of training programs conducted in the hospital and to take continuous initiatives for knowledge and skill up gradation.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To be involved in teaching programs that is held by the department.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To be an active member for the quality initiatives of the hospital.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Any other responsibility assigned by the Coordinator / DMS office.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To be part of the quality improvement of JCI documentation process of the hospital.</span>
              </li>
            </ul>
          </div>

          {/* DEPARTMENT SPECIFIC JOB DESCRIPTION */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">DEPARTMENT SPECIFIC JOB DESCRIPTION</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Shall be doing minor procedures under supervision of Registrar/Specialist.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Assist consultants in the day-to-day management of patients under the supervision of Registrar/Specialist.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To do on-Call duties to attend to medical patients received through emergency and assist in their management as advised by the consultant.</span>
              </li>
            </ul>
          </div>

          {/* TRAINING & DEVELOPMENT */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">TRAINING & DEVELOPMENT</h2>
            <p className="text-gray-700 mb-3">To participate in the academic activities of the department and Hospital by taking part in:</p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Mandatory safety training</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prevention & Control of Infection</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Departmental policy & Procedures</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Trained in basic CPR</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Trained in Blood Borne pathogen exposure and management.</span>
              </li>
            </ul>
          </div>

          {/* Prevention And Control of Infections */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Prevention And Control of Infections (PCI):</h2>
            <p className="text-gray-700 mb-3">
              To follow the standard precautions for all patients as per hospital protocol for prevention and control of infections.
              Standard precautions include but are not limited to following:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4 mb-4">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Hand hygiene,</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Respiratory hygiene,</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Proper use of personal protective equipments (PPE),</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Aseptic precautions,</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prevention of accidental inoculation injury, and</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Waste segregation.</span>
              </li>
            </ul>
            <p className="text-gray-700 mb-3">
              To follow the additional precautions for suspected/confirmed patients of certain infectious diseases as per hospital protocol for prevention and control of infections.
            </p>
            <p className="text-gray-700">
              Responsible for implementing and maintaining other practices and protocols of PCI as per Hospital PCI policy.
            </p>
          </div>

          {/* Basic Competencies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Basic Competencies:</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To elicit and record relevant focused history from patients and their attendants and with an accurate list of Medications used before admission.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To relate physical findings to history in order to establish and formulate Anesthesia plan management plan in coordination with senior registrar and Consultant.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>To prescribe, review and monitor appropriate therapeutic interventions relevant to clinical practice.</span>
              </li>
            </ul>
          </div>

          {/* Behavioral Competencies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Behavioral Competencies:</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Shows respect and behave in accordance with Good Medical Practice.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Works flexibly and deals with tasks effectively and efficiently.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Remains calm in stressful or high-pressure situations and adopts a timely, rational approach.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Maintains good interpersonal relationships with his colleagues and juniors.</span>
              </li>
            </ul>
          </div>

          {/* Job Details */}
          <div className="border-t pt-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Job Location</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Employment Status</p>
                  <p className="font-semibold text-gray-900">{job.type}</p>
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
                  <p className="font-semibold text-gray-900">{job.vacancy}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Salary Range</p>
                  <p className="font-semibold text-gray-900">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-semibold text-gray-900">{job.deadline}</p>
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
      <JobApplicationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        jobTitle={job.title}
      />
    </div>
  );
}

