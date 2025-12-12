"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { useCreateContactMessageMutation } from "@/services/contactPageApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export function ContactFormSection() {
  const [createContactMessage, { isLoading }] = useCreateContactMessageMutation();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    message: "",
  });

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createContactMessage({
        patient_name: formData.fullName,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        email: formData.email,
        message: formData.message,
      }).unwrap();
      
      toast.success("Your message has been submitted successfully!");
      
      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      toast.error(error?.data?.message || "Failed to submit message. Please try again.");
    }
  };

  return (
    <motion.div
      className="w-full bg-white py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div className="text-center mb-12" variants={titleVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Submit Your Query</h2>
        </motion.div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants}>
              {/* Left Column */}
              <motion.div className="space-y-6" variants={itemVariants}>
                {/* Patient Full Name */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Patient Full Name<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </FieldContent>
                  </Field>
                </motion.div>

                {/* Phone Number */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Phone Number<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </FieldContent>
                  </Field>
                </motion.div>

                {/* Date of Birth */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Date of Birth<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-all duration-300 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm focus:scale-[1.02]"
                      />
                    </FieldContent>
                  </Field>
                </motion.div>

                {/* Message */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Message<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <textarea
                        name="message"
                        placeholder="Enter Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        cols={12}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-all duration-300 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none focus:scale-[1.02]"
                      />
                    </FieldContent>
                  </Field>
                </motion.div>
              </motion.div>

              {/* Right Column */}
              <motion.div className="space-y-6" variants={itemVariants}>
                {/* Gender */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Gender<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-all duration-300 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm focus:scale-[1.02]"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FieldContent>
                  </Field>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldLabel>
                      Email<span className="text-red-500">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </FieldContent>
                  </Field>
                </motion.div>

                {/* reCAPTCHA Placeholder */}
                <motion.div variants={itemVariants}>
                  <Field>
                    <FieldContent>
                      <div className="flex items-center gap-2 p-4 border border-gray-300 rounded-md bg-primary/30 rounded-t-lg transition-all duration-300 hover:border-primary/50">
                        <input
                          type="checkbox"
                          id="recaptcha"
                          className="w-4 h-4"
                          required
                        />
                        <label htmlFor="recaptcha" className="text-sm text-gray-700">
                          I'm not a robot
                        </label>
                        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                          <span>reCAPTCHA</span>
                          <div className="flex flex-col text-[10px]">
                            <span>Privacy</span>
                            <span>Terms</span>
                          </div>
                        </div>
                      </div>
                    </FieldContent>
                  </Field>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="flex justify-center pt-4" variants={buttonVariants}>
              <Button
                type="submit"
                className="bg-primary hover:bg-blue-800 text-white px-12 py-6 text-lg rounded-lg transition-all duration-300"
                disabled={isLoading}
                asChild
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </motion.button>
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
