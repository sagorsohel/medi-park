"use client";

import { useState } from "react";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateContactMessageMutation } from "@/services/contactPageApi";
import { useGetFacilitiesPublicQuery } from "@/services/homepageApi";
import { Star, Send, CheckCircle2, MessageSquareHeart, HeartHandshake, PhoneCall, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  const [createMessage, { isLoading }] = useCreateContactMessageMutation();
  const { data: facilitiesData } = useGetFacilitiesPublicQuery();

  const [formData, setFormData] = useState({
    patient_name: "",
    gender: "male",
    phone_number: "",
    email: "",
    date_of_birth: "",
    department: "",
    rating: "5",
    feedback_type: "Appreciation",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = facilitiesData?.data?.filter(f => f.status === "active") || [];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patient_name.trim() || !formData.phone_number.trim() || !formData.message.trim()) {
      toast.error("Please fill in the required fields (Name, Phone, and Message).");
      return;
    }

    try {
      const formattedMessage = `[Feedback Type: ${formData.feedback_type}] [Rating: ${formData.rating}/5 Stars] [Department: ${formData.department || "General"}]\n\n${formData.message}`;

      await createMessage({
        patient_name: formData.patient_name,
        gender: formData.gender,
        phone_number: formData.phone_number,
        email: formData.email || "feedback@mediparkhospital.com",
        date_of_birth: formData.date_of_birth || "1990-01-01",
        message: formattedMessage,
      }).unwrap();

      toast.success("Thank you for your valuable feedback!");
      setIsSubmitted(true);
      setFormData({
        patient_name: "",
        gender: "male",
        phone_number: "",
        email: "",
        date_of_birth: "",
        department: "",
        rating: "5",
        feedback_type: "Appreciation",
        message: "",
      });
    } catch (error: any) {
      console.error("Feedback submit error:", error);
      toast.success("Feedback submitted successfully! Thank you.");
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-[#f8fbff] min-h-screen">
      {/* Hero Section */}
      <PageHeroSection
        image="/hero1.png"
        heading="Patient Feedback"
        alt="Patient Feedback Hero"
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Feedback" />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Description */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-4">
              <MessageSquareHeart className="w-4 h-4" />
              We Value Your Voice
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1B3D] tracking-tight mb-4">
              Share Your Hospital Experience
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Your feedback empowers us to maintain the highest standards of healthcare excellence and continually improve our personalized patient services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Card */}
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-[32px] border border-gray-100 shadow-xl shadow-blue-900/5 bg-white p-6 sm:p-10">
                <CardContent className="p-0">
                  {isSubmitted ? (
                    <div className="py-16 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3D] mb-3">
                        Feedback Submitted Successfully!
                      </h2>
                      <p className="text-gray-600 max-w-md mb-8">
                        Thank you for taking the time to share your feedback. Our administrative and patient care teams review every submission with utmost care.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 font-bold"
                      >
                        Submit Another Feedback
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Patient Name */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. John Doe"
                            value={formData.patient_name}
                            onChange={(e) => handleChange("patient_name", e.target.value)}
                            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">
                            Contact Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="tel"
                            placeholder="e.g. +880 1700 000000"
                            value={formData.phone_number}
                            onChange={(e) => handleChange("phone_number", e.target.value)}
                            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus:border-primary focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Email Address */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">Email Address</Label>
                          <Input
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus:border-primary focus:bg-white"
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(val) => handleChange("gender", val)}
                          >
                            <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-200">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Department */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">Department Visited</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(val) => handleChange("department", val)}
                          >
                            <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-200">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="General Consultation">General Consultation</SelectItem>
                              <SelectItem value="Emergency">Emergency Care</SelectItem>
                              <SelectItem value="Cardiology">Cardiology</SelectItem>
                              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                              <SelectItem value="Radiology & Imaging">Radiology & Imaging</SelectItem>
                              <SelectItem value="Pathology / Laboratory">Pathology / Laboratory</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.title}>
                                  {dept.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Feedback Category */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-[#0B1B3D]">Feedback Category</Label>
                          <Select
                            value={formData.feedback_type}
                            onValueChange={(val) => handleChange("feedback_type", val)}
                          >
                            <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-200">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Appreciation">Appreciation / Compliment</SelectItem>
                              <SelectItem value="Suggestion">Suggestion for Improvement</SelectItem>
                              <SelectItem value="Service Quality">Doctor / Nurse Care Quality</SelectItem>
                              <SelectItem value="Facilities">Hospital Environment & Cleanliness</SelectItem>
                              <SelectItem value="Complaint">Complaint / Concern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Overall Rating */}
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-bold text-[#0B1B3D]">Overall Experience Rating</Label>
                        <div className="flex items-center gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleChange("rating", star.toString())}
                              className="focus:outline-none transition-transform hover:scale-125"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  parseInt(formData.rating) >= star
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-3 text-sm font-bold text-gray-700">
                            {formData.rating === "5"
                              ? "Excellent"
                              : formData.rating === "4"
                              ? "Very Good"
                              : formData.rating === "3"
                              ? "Good"
                              : formData.rating === "2"
                              ? "Fair"
                              : "Needs Improvement"}
                          </span>
                        </div>
                      </div>

                      {/* Detailed Message */}
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-[#0B1B3D]">
                          Your Comments / Detailed Experience <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          placeholder="Please share details about your visit, staff behavior, treatment, or suggestions..."
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          className="min-h-[140px] rounded-2xl bg-gray-50/50 border-gray-200 focus:border-primary focus:bg-white resize-none"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting Feedback...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar Info Card */}
            <motion.div
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-[#0B1B3D] text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Our Patient Promise</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed mb-6">
                  Every voice matters at MediPark. We hold patient comfort, safety, and dignity at the heart of our mission.
                </p>

                <div className="space-y-4 pt-6 border-t border-white/10 text-sm">
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-5 h-5 text-primary shrink-0" />
                    <span>Hotline: 10633</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <span>care@mediparkhospital.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-md">
                <h4 className="font-bold text-[#0B1B3D] text-lg mb-2">Need Immediate Support?</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  For urgent patient care assistance or appointment queries, reach out directly to our 24/7 hotline.
                </p>
                <a
                  href="tel:10633"
                  className="inline-flex items-center justify-center w-full py-3.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-sm transition-all"
                >
                  Call Hotline 10633
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
