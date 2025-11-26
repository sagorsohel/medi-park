"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

interface JobApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
}

export function JobApplicationModal({ open, onOpenChange, jobTitle }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    resume: null as File | null,
  });

  const [resumeFileName, setResumeFileName] = useState("No file chosen");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form and close modal
    setFormData({
      fullName: "",
      gender: "",
      email: "",
      phoneNumber: "",
      resume: null,
    });
    setResumeFileName("No file chosen");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
            Apply Here
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Whether you're looking for solutions or want to explore opportunities, we're here to collaborate with you.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <Field>
              <FieldLabel>
                Full Name<span className="text-red-500">*</span>
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
          </div>

          {/* Applying For */}
          <Field>
            <FieldLabel>
              Applying For<span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                name="applyingFor"
                value={jobTitle}
                readOnly
                className="bg-gray-100"
              />
            </FieldContent>
          </Field>

          {/* Resume */}
          <Field>
            <FieldLabel>
              Resume<span className="text-red-500">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-200 hover:bg-gray-300"
                  onClick={() => document.getElementById("resume-upload")?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-600">{resumeFileName}</span>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>
            </FieldContent>
          </Field>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-lg w-full md:w-auto"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

