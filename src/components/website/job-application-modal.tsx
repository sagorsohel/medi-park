"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { useCreateJobApplicationMutation } from "@/services/jobApi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface JobApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  jobId: number;
}

export function JobApplicationModal({ open, onOpenChange, jobTitle, jobId }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    present_address: { address: "", district: "" },
    permanent_address: { address: "", district: "" },
    upload_cv: null as File | null,
    upload_image: null as File | null,
  });

  const [resumeFileName, setResumeFileName] = useState("No file chosen");
  const [imageFileName, setImageFileName] = useState("No file chosen");
  const [createJobApplication, { isLoading }] = useCreateJobApplicationMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "upload_cv" | "upload_image") => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      if (field === "upload_cv") setResumeFileName(file.name);
      else setImageFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("job_detail_id", jobId.toString());
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    // Pass present_address and permanent_address as nested data
    data.append("present_address[address]", formData.present_address.address);
    data.append("present_address[district]", formData.present_address.district);
    data.append("permanent_address[address]", formData.permanent_address.address);
    data.append("permanent_address[district]", formData.permanent_address.district);

    if (formData.upload_cv) data.append("upload_cv", formData.upload_cv);
    if (formData.upload_image) data.append("upload_image", formData.upload_image);
    data.append("status", "pending");

    try {
      await createJobApplication(data).unwrap();
      toast.success("Application submitted successfully!");
      // Reset form and close modal
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        present_address: { address: "", district: "" },
        permanent_address: { address: "", district: "" },
        upload_cv: null,
        upload_image: null,
      });
      setResumeFileName("No file chosen");
      setImageFileName("No file chosen");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to submit application:", error);
      if (error?.data?.errors) {
        const firstError = Object.values(error.data.errors)[0] as string[];
        toast.error(firstError[0] || "Validation error");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            Apply Here
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Whether you're looking for solutions or want to explore opportunities, we're here to collaborate with you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                Full Name<span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </FieldContent>
            </Field>

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

            <Field>
              <FieldLabel>
                Phone Number<span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </FieldContent>
            </Field>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>
                  Present Address<span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="present_address.address"
                    placeholder="Enter present address"
                    value={formData.present_address.address}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Present Address District<span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="present_address.district"
                    placeholder="Enter district"
                    value={formData.present_address.district}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Permanent Address<span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="permanent_address.address"
                    placeholder="Enter permanent address"
                    value={formData.permanent_address.address}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Permanent Address District<span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="permanent_address.district"
                    placeholder="Enter district"
                    value={formData.permanent_address.district}
                    onChange={handleInputChange}
                    required
                  />
                </FieldContent>
              </Field>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume */}
            <Field>
              <FieldLabel>
                Resume<span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-200 hover:bg-gray-300"
                      onClick={() => document.getElementById("resume-upload")?.click()}
                    >
                      Choose File
                    </Button>
                    <span className="text-sm text-gray-600 truncate max-w-[150px]">{resumeFileName}</span>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, "upload_cv")}
                    className="hidden"
                    required
                  />
                </div>
              </FieldContent>
            </Field>

            {/* Photo */}
            <Field>
              <FieldLabel>
                Photo<span className="text-red-500">*</span>
              </FieldLabel>
              <FieldContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-200 hover:bg-gray-300"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Choose File
                    </Button>
                    <span className="text-sm text-gray-600 truncate max-w-[150px]">{imageFileName}</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "upload_image")}
                    className="hidden"
                    required
                  />
                </div>
              </FieldContent>
            </Field>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-lg w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

