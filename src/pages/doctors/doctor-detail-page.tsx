import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'
import { useGetDoctorByIdQuery } from '@/services/doctorApi'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const doctorId = id ? parseInt(id) : 0;
  const { data, isLoading, error } = useGetDoctorByIdQuery(doctorId, { skip: !doctorId });

  // Format doctor data for display
  const doctor = useMemo(() => {
    if (!data?.data) return null;

    const doctorData = data.data;

    // Format qualifications from education array
    let qualifications = "";
    if (doctorData.education && Array.isArray(doctorData.education) && doctorData.education.length > 0) {
      qualifications = doctorData.education
        .map(edu => {
          const parts = [];
          if (edu.qualification) parts.push(edu.qualification);
          if (edu.institute_name) parts.push(`(${edu.institute_name})`);
          return parts.join(" ");
        })
        .filter(q => q)
        .join(", ");
    }

    // Build areas of expertise from about, experience, and education
    const areasOfExpertise: string[] = [];
    
    if (doctorData.about) {
      areasOfExpertise.push(doctorData.about);
    }

    if (doctorData.experience && Array.isArray(doctorData.experience)) {
      doctorData.experience.forEach(exp => {
        if (exp.hospital_name || exp.no_of_years) {
          const expText = `Worked at ${exp.hospital_name || "various hospitals"}${exp.no_of_years ? ` for ${exp.no_of_years} years` : ""}${exp.year ? ` (${exp.year})` : ""}`;
          areasOfExpertise.push(expText);
        }
      });
    }

    // Split about text into paragraphs if it contains multiple sentences
    if (doctorData.about && doctorData.about.includes('.')) {
      const sentences = doctorData.about.split('.').filter(s => s.trim());
      if (sentences.length > 1) {
        areasOfExpertise.length = 0; // Clear the about we added
        sentences.forEach(sentence => {
          if (sentence.trim()) areasOfExpertise.push(sentence.trim() + '.');
        });
      }
    }

    if (areasOfExpertise.length === 0) {
      areasOfExpertise.push("Experienced medical professional with extensive clinical expertise.");
    }

    return {
      id: doctorData.id,
      image: doctorData.image || "/vite.svg",
      name: doctorData.doctor_name || "Doctor",
      qualifications: qualifications || doctorData.specialist || "Medical Professional",
      role: doctorData.specialist || "Consultant",
      department: doctorData.department || "General",
      areasOfExpertise,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeroSection image="/hero1.png" heading="Doctor" alt="Doctor Hero" />
        <BreadcrumbSection currentPage="Doctor" />
        <section className="w-full bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="w-full">
        <PageHeroSection image="/hero1.png" heading="Doctor" alt="Doctor Hero" />
        <BreadcrumbSection currentPage="Doctor" />
        <section className="w-full bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12 text-gray-500">
              Doctor not found or failed to load. Please try again later.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image={doctor.image || "/hero1.png"} heading={'Doctor'} alt={`${doctor.name} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={doctor.name} />

      {/* Doctor Detail Content */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-blue-900 p-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="shrink-0">
                  <div className="sm:w-64 w-full h-64 rounded-lg overflow-hidden border-4 border-gray-200">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-3">
                        {doctor.name}
                      </h1>
                      <p className="text-gray-600 mb-2">{doctor.qualifications}</p>
                      <p className="text-lg font-semibold text-gray-900 mb-2">{doctor.role}</p>
                      <p className="text-blue-600 underline">{doctor.department}</p>
                    </div>
                    {/* Logo */}
                    <div className="hidden md:block">
                      <div className="flex items-center gap-2">
                        <img src="/color-logo.png" className="object-cover " alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Expertise / About */}
                  {doctor.areasOfExpertise.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">About</h2>
                      <ul className="flex flex-col gap-1 text-gray-700">
                        {doctor.areasOfExpertise.map((expertise, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-primary">•</span>
                            <span>{expertise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Known Languages */}
                  {data?.data?.known_languages && Array.isArray(data.data.known_languages) && data.data.known_languages.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Known Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {data.data.known_languages.map((lang: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {data?.data?.education && Array.isArray(data.data.education) && data.data.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
                      <ul className="flex flex-col gap-4">
                        {data.data.education.map((edu: { qualification?: string; institute_name?: string; year?: string }, index: number) => (
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                            <div className="flex-1 space-y-2">
                              {edu.qualification && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Qualification:</span>
                                  <span className="text-base font-medium text-gray-900">{edu.qualification}</span>
                                </div>
                              )}
                              {edu.institute_name && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Institute:</span>
                                  <span className="text-sm text-gray-700">{edu.institute_name}</span>
                                </div>
                              )}
                              {edu.year && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Year:</span>
                                  <span className="text-sm text-gray-600">{edu.year}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Experience */}
                  {data?.data?.experience && Array.isArray(data.data.experience) && data.data.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Experience</h2>
                      <ul className="flex flex-col gap-4">
                        {data.data.experience.map((exp: { hospital_name?: string; no_of_years?: string; year?: string }, index: number) => (
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                            <div className="flex-1 space-y-2">
                              {exp.hospital_name && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Hospital:</span>
                                  <span className="text-base font-medium text-gray-900">{exp.hospital_name}</span>
                                </div>
                              )}
                              {exp.no_of_years && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Duration:</span>
                                  <span className="text-sm text-gray-700">{exp.no_of_years} years</span>
                                </div>
                              )}
                              {exp.year && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Year:</span>
                                  <span className="text-sm text-gray-600">{exp.year}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Awards */}
                  {data?.data?.awards && Array.isArray(data.data.awards) && data.data.awards.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Awards</h2>
                      <ul className="flex flex-col gap-4">
                        {data.data.awards.map((award: { title?: string; description?: string; year?: string }, index: number) => (
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                            <div className="flex-1 space-y-2">
                              {award.title && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Title:</span>
                                  <span className="text-base font-medium text-gray-900">{award.title}</span>
                                </div>
                              )}
                              {award.description && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Description:</span>
                                  <span className="text-sm text-gray-700 flex-1">{award.description}</span>
                                </div>
                              )}
                              {award.year && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Year:</span>
                                  <span className="text-sm text-gray-600">{award.year}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Membership */}
                  {data?.data?.membership && Array.isArray(data.data.membership) && data.data.membership.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Membership</h2>
                      <ul className="flex flex-col gap-4">
                        {data.data.membership.map((mem: { title?: string; description?: string; year?: string }, index: number) => (
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                            <div className="flex-1 space-y-2">
                              {mem.title && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Title:</span>
                                  <span className="text-base font-medium text-gray-900">{mem.title}</span>
                                </div>
                              )}
                              {mem.description && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Description:</span>
                                  <span className="text-sm text-gray-700 flex-1">{mem.description}</span>
                                </div>
                              )}
                              {mem.year && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Year:</span>
                                  <span className="text-sm text-gray-600">{mem.year}</span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

