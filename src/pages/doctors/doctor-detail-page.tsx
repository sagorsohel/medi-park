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
      doctorData.experience.forEach((exp: { hospital?: string; duration?: string; year?: string; designation?: string }) => {
        if (exp.hospital || exp.duration) {
          const expText = `Worked at ${exp.hospital || "various hospitals"}${exp.duration ? ` for ${exp.duration}` : ""}${exp.year ? ` (${exp.year})` : ""}`;
          areasOfExpertise.push(expText);
        }
      });
    }

    // Split about text into paragraphs if it contains multiple sentences
    if (doctorData.about && doctorData.about.includes('.')) {
      const sentences = doctorData.about.split('.').filter(s => s.trim());
      if (sentences.length > 0) {
        areasOfExpertise.length = 0; // Clear the about we added
        sentences.forEach(sentence => {
          if (sentence.trim()) areasOfExpertise.push(sentence.trim() + '.');
        });
      }
    }

    if (areasOfExpertise.length === 0 && !doctorData.about) {
      areasOfExpertise.push("Experienced medical professional with extensive clinical expertise.");
    }

    return {
      ...doctorData, // spread existing logic
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

                  {/* Personal & Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-4">
                    {data?.data?.doctor_identity_number && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Doctor ID</span>
                        <span className="text-gray-900 font-medium">{data.data.doctor_identity_number}</span>
                      </div>
                    )}
                    {data?.data?.registration_number && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Registration No.</span>
                        <span className="text-gray-900 font-medium">{data.data.registration_number}</span>
                      </div>
                    )}
                    {data?.data?.gender && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Gender</span>
                        <span className="text-gray-900 font-medium capitalize">{data.data.gender}</span>
                      </div>
                    )}
                    {data?.data?.date_of_birth && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Date of Birth</span>
                        <span className="text-gray-900 font-medium">{data.data.date_of_birth}</span>
                      </div>
                    )}
                    {data?.data?.mobile_number && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Mobile</span>
                        <span className="text-gray-900 font-medium">{data.data.mobile_number}</span>
                      </div>
                    )}
                    {data?.data?.email_address && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Email</span>
                        <span className="text-gray-900 font-medium">{data.data.email_address}</span>
                      </div>
                    )}
                  </div>

                  {/* Addresses */}
                  {(data?.data?.present_address || data?.data?.permanent_address) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                      {data?.data?.present_address && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase block mb-1">Present Address</span>
                          <span className="text-gray-800 text-sm whitespace-pre-line">{data.data.present_address}</span>
                        </div>
                      )}
                      {data?.data?.permanent_address && (
                        <div>
                          <span className="text-sm font-semibold text-gray-500 uppercase block mb-1">Permanent Address</span>
                          <span className="text-gray-800 text-sm whitespace-pre-line">{data.data.permanent_address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Areas of Expertise / About */}
                  {doctor.areasOfExpertise.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">About</h2>
                      <ul className="flex flex-col gap-1 text-gray-700">
                        {doctor.areasOfExpertise.map((expertise: string, index: number) => (
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
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 space-y-2">
                              {edu.qualification && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Qualification:</span>
                                  <span className="text-base font-medium text-gray-900">{edu.qualification}</span>
                                </div>
                              )}
                              {edu.institute_name && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Institute:</span>
                                  <span className="text-sm text-gray-700">{edu.institute_name}</span>
                                </div>
                              )}
                              {edu.year && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
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
                        {data.data.experience.map((exp: { hospital?: string; duration?: string; year?: string; designation?: string }, index: number) => (
                          <li key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1 space-y-2">
                              {exp.designation && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Designation:</span>
                                  <span className="text-base font-medium text-gray-900">{exp.designation}</span>
                                </div>
                              )}
                              {exp.hospital && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Hospital:</span>
                                  <span className="text-gray-700">{exp.hospital}</span>
                                </div>
                              )}
                              {exp.duration && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                  <span className="text-sm font-semibold text-primary min-w-[120px]">Duration:</span>
                                  <span className="text-sm text-gray-600">{exp.duration}</span>
                                </div>
                              )}
                              {exp.year && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1">
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
                      <ul className="flex flex-col gap-3">
                        {data.data.awards.map((award: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <span className="mt-1 text-[#00A884]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                            </span>
                            <span className="text-base text-gray-800 font-medium">{award}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Membership */}
                  {data?.data?.membership && Array.isArray(data.data.membership) && data.data.membership.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Membership</h2>
                      <ul className="flex flex-col gap-3">
                        {data.data.membership.map((mem: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <span className="mt-1 text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </span>
                            <span className="text-base text-gray-800 font-medium">{mem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {data?.data?.social_media && typeof data.data.social_media === 'object' && !Array.isArray(data.data.social_media) && Object.keys(data.data.social_media).length > 0 && (
                    <div className="pt-6 mt-4 border-t border-gray-100">
                      <h2 className="text-base text-gray-500 uppercase font-bold tracking-wide mb-4">Connect</h2>
                      <div className="flex items-center gap-4">
                        {data.data.social_media.facebook && (
                          <a href={data.data.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 p-3 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                        )}
                        {data.data.social_media.twitter && (
                          <a href={data.data.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors bg-gray-50 p-3 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </a>
                        )}
                        {data.data.social_media.linkedin && (
                          <a href={data.data.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors bg-gray-50 p-3 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </a>
                        )}
                      </div>
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

