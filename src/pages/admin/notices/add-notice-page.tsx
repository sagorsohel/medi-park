"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Loader2,
  Calendar,
  FileText,
  Save,
} from "lucide-react";
import {
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
} from "@/services/noticeApi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "background",
  "align",
];

export default function AddNoticePage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const id = params.id ? parseInt(params.id) : null;

  const pathname = window.location.pathname;
  const isViewMode = pathname.includes("/view/");
  const isEditMode = pathname.includes("/edit/");
  const isCreateMode = !id && !isEditMode && !isViewMode;

  const { data: recordData, isLoading: isRecordLoading } = useGetNoticeByIdQuery(id!, { skip: !id });

  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  // Helper to format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    return dateString.substring(0, 10);
  };

  // Load existing notice details when editing or viewing
  useEffect(() => {
    if (recordData?.data) {
      const rec = recordData.data;
      setTitle(rec.title || "");
      setContent(rec.content || "");
      setPublishedAt(formatDateForInput(rec.published_at));
    }
  }, [recordData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Content is required.");
      return;
    }

    const payload = {
      title,
      content,
      published_at: publishedAt || null,
    };

    try {
      if (isEditMode && id) {
        await updateNotice({ id, data: payload }).unwrap();
        toast.success("Notice updated successfully!");
      } else {
        await createNotice(payload).unwrap();
        toast.success("Notice created successfully!");
      }
      navigate("/admin/notices");
    } catch (err) {
      console.error("Failed to save notice:", err);
      const typedErr = err as { data?: { message?: string } };
      const msg = typedErr?.data?.message || "Failed to save notice. Please check the inputs.";
      toast.error(msg);
    }
  };

  if (isRecordLoading && id) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading notice details...</p>
      </div>
    );
  }

  const readOnlyProps = isViewMode ? { readOnly: true, disabled: true } : {};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl space-y-6">
      {/* Back & Title */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/notices")}
          className="h-8 w-8 -ml-2 text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isCreateMode && "Add New Notice"}
            {isEditMode && "Edit Notice"}
            {isViewMode && "View Notice Details"}
          </h1>
          <p className="text-xs text-gray-500">
            {isCreateMode && "Configure and publish a new notice to the public notice board."}
            {isEditMode && "Update details of the notice board entry."}
            {isViewMode && "Review the details of the published notice."}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Notice Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="font-bold text-gray-700">Notice Title *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hospital Outpatient Department Holiday Announcement"
              className="pl-10"
              required
              {...readOnlyProps}
            />
          </div>
        </div>

        {/* Published At Date */}
        <div className="space-y-2">
          <Label htmlFor="published_at" className="font-bold text-gray-700">Published Date (Optional)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="published_at"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="pl-10"
              {...readOnlyProps}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            Leave empty to publish immediately or select a schedule date.
          </p>
        </div>

        {/* Rich Text Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="font-bold text-gray-700">Notice Content *</Label>
          <div className="bg-white">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={isViewMode ? { toolbar: false } : quillModules}
              formats={quillFormats}
              placeholder="Write notice description or information..."
              readOnly={isViewMode}
              className="min-h-[200px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/notices")}
          >
            {isViewMode ? "Go Back" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2 min-w-[120px] font-bold"
            >
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              {isEditMode ? "Save Changes" : "Create Notice"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
