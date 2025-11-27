"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">Submit Your Query</h2>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Patient Full Name */}
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
                    />
                  </FieldContent>
                </Field>

                {/* Phone Number */}
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
                    />
                  </FieldContent>
                </Field>

                {/* Date of Birth */}
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
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    />
                  </FieldContent>
                </Field>

                {/* Message */}
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
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-none"
                    />
                  </FieldContent>
                </Field>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Gender */}
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
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FieldContent>
                </Field>

                {/* Email */}
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
                    />
                  </FieldContent>
                </Field>

                {/* reCAPTCHA Placeholder */}
                <Field>
                  <FieldContent>
                    <div className="flex items-center gap-2 p-4 border border-gray-300 rounded-md bg-gray-50">
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-6 text-lg rounded-lg"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

