"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, Plus, Trash2, Edit2, X, Check, GripVertical } from "lucide-react";
import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  type Facility,
} from "@/services/homepageApi";
import { useGetDoctorsQuery } from "@/services/doctorApi";
import { useGetBlogsQuery } from "@/services/blogApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

interface AccordionItem {
  title: string;
  description: string;
}

interface DraftFacility {
  id: string; // temporary ID like 'draft-123'
  title: string;
  short_description: string;
  description1: string;
  description2: string;
  footer: string;
  image: string;
  status: 'active' | 'inactive';
  imageFile?: File;
  accordions: AccordionItem[];
  doctors: number[];
  blogs: number[];
}

interface EditableFacility {
  title?: string;
  short_description?: string;
  description1?: string;
  description2?: string;
  footer?: string;
  image?: string | File;
  status?: 'active' | 'inactive';
  accordions?: AccordionItem[];
  doctors?: number[];
  blogs?: number[];
}

export function FacilitiesManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetFacilitiesQuery(currentPage);
  const { data: doctorsData } = useGetDoctorsQuery(1);
  const { data: blogsData } = useGetBlogsQuery(1);
  const [createFacility] = useCreateFacilityMutation();
  const [updateFacility] = useUpdateFacilityMutation();
  const [deleteFacility] = useDeleteFacilityMutation();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftFacilities, setDraftFacilities] = useState<DraftFacility[]>([]);
  const [editableFacilities, setEditableFacilities] = useState<{ [key: number]: EditableFacility }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [creatingFacilities, setCreatingFacilities] = useState<{ [key: string]: boolean }>({});
  const [updatingFacilities, setUpdatingFacilities] = useState<{ [key: number]: boolean }>({});

  // Reset editable facilities when data changes
  useEffect(() => {
    if (data?.data) {
      setEditableFacilities({});
      setImagePreviews({});
    }
  }, [data]);

  const addFacility = () => {
    const draftId = `draft-${Date.now()}`;
    const newDraft: DraftFacility = {
      id: draftId,
      title: "",
      short_description: "",
      description1: "",
      description2: "",
      footer: "",
      image: "",
      status: "inactive",
      accordions: [],
      doctors: [],
      blogs: [],
    };

    setDraftFacilities(prev => [...prev, newDraft]);

    // Scroll to the new draft after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`facility-${draftId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDeleteClick = (id: number) => {
    setFacilityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (facilityToDelete === null) return;

    try {
      await deleteFacility(facilityToDelete).unwrap();
      refetch();
      setFacilityToDelete(null);
    } catch (error) {
      console.error("Failed to delete facility:", error);
      alert("Failed to delete facility. Please try again.");
    }
  };

  const handleDraftFieldChange = (draftId: string, field: keyof DraftFacility, value: string | number[]) => {
    setDraftFacilities(prev =>
      prev.map(draft =>
        draft.id === draftId ? { ...draft, [field]: value } : draft
      )
    );
  };

  const handleDraftAccordionChange = (draftId: string, index: number, field: 'title' | 'description', value: string) => {
    setDraftFacilities(prev =>
      prev.map(draft => {
        if (draft.id !== draftId) return draft;
        const newAccordions = [...(draft.accordions || [])];
        if (!newAccordions[index]) {
          newAccordions[index] = { title: '', description: '' };
        }
        newAccordions[index][field] = value;
        return { ...draft, accordions: newAccordions };
      })
    );
  };

  const addDraftAccordion = (draftId: string) => {
    setDraftFacilities(prev =>
      prev.map(draft =>
        draft.id === draftId
          ? { ...draft, accordions: [...(draft.accordions || []), { title: '', description: '' }] }
          : draft
      )
    );
  };

  const removeDraftAccordion = (draftId: string, index: number) => {
    setDraftFacilities(prev =>
      prev.map(draft =>
        draft.id === draftId
          ? { ...draft, accordions: draft.accordions.filter((_, i) => i !== index) }
          : draft
      )
    );
  };

  const handleDraftImageChange = (draftId: string, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({
      ...prev,
      [draftId]: previewUrl,
    }));

    setDraftFacilities(prev =>
      prev.map(draft =>
        draft.id === draftId ? { ...draft, imageFile: file } : draft
      )
    );
  };

  const handleCreateFacility = async (draftId: string) => {
    const draft = draftFacilities.find(d => d.id === draftId);
    if (!draft) return;

    if (!draft.title.trim() || !draft.short_description.trim() || !draft.imageFile) {
      alert("Please fill in title, short description and select an image.");
      return;
    }

    setCreatingFacilities(prev => ({ ...prev, [draftId]: true }));

    try {
      await createFacility({
        title: draft.title,
        short_description: draft.short_description,
        description1: draft.description1 || undefined,
        description2: draft.description2 || undefined,
        footer: draft.footer || undefined,
        image: draft.imageFile,
        status: draft.status,
        accordions: draft.accordions.length > 0 ? draft.accordions : undefined,
        doctors: draft.doctors.length > 0 ? draft.doctors : undefined,
        blogs: draft.blogs.length > 0 ? draft.blogs : undefined,
      }).unwrap();

      // Remove draft and preview
      setDraftFacilities(prev => prev.filter(d => d.id !== draftId));
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[draftId];
        return newPreviews;
      });
      refetch();
    } catch (error) {
      console.error("Failed to create facility:", error);
      alert("Failed to create facility. Please try again.");
    } finally {
      setCreatingFacilities(prev => {
        const newState = { ...prev };
        delete newState[draftId];
        return newState;
      });
    }
  };

  const removeDraft = (draftId: string) => {
    setDraftFacilities(prev => prev.filter(d => d.id !== draftId));
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      if (newPreviews[draftId]) {
        URL.revokeObjectURL(newPreviews[draftId]);
      }
      delete newPreviews[draftId];
      return newPreviews;
    });
  };

  const startEdit = (facility: Facility) => {
    setEditingId(facility.id);
    setEditableFacilities(prev => ({
      ...prev,
      [facility.id]: {},
    }));
  };

  const cancelEdit = (id: number) => {
    setEditingId(null);
    setEditableFacilities(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setImagePreviews(prev => {
      const newState = { ...prev };
      delete newState[`edit-${id}`];
      return newState;
    });
  };

  const handleEditFieldChange = (id: number, field: keyof EditableFacility, value: string | number[] | AccordionItem[]) => {
    setEditableFacilities(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleEditAccordionChange = (id: number, index: number, field: 'title' | 'description', value: string) => {
    setEditableFacilities(prev => {
      const editable = prev[id] || {};
      const accordions = editable.accordions || [];
      const newAccordions = [...accordions];
      if (!newAccordions[index]) {
        newAccordions[index] = { title: '', description: '' };
      }
      newAccordions[index][field] = value;
      return {
        ...prev,
        [id]: {
          ...editable,
          accordions: newAccordions,
        },
      };
    });
  };

  const addEditAccordion = (id: number) => {
    setEditableFacilities(prev => {
      const editable = prev[id] || {};
      const accordions = editable.accordions || [];
      return {
        ...prev,
        [id]: {
          ...editable,
          accordions: [...accordions, { title: '', description: '' }],
        },
      };
    });
  };

  const removeEditAccordion = (id: number, index: number) => {
    setEditableFacilities(prev => {
      const editable = prev[id] || {};
      const accordions = editable.accordions || [];
      return {
        ...prev,
        [id]: {
          ...editable,
          accordions: accordions.filter((_, i) => i !== index),
        },
      };
    });
  };

  const getAccordions = (facility: Facility, editable: EditableFacility): AccordionItem[] => {
    if (editable.accordions !== undefined) {
      return editable.accordions;
    }
    return facility.accordions || [];
  };

  const handleEditImageChange = (id: number, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({
      ...prev,
      [`edit-${id}`]: previewUrl,
    }));

    setEditableFacilities(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        image: file,
      },
    }));
  };

  const hasChanges = (facility: Facility): boolean => {
    const editable = editableFacilities[facility.id];
    if (!editable) return false;

    if (editable.title !== undefined && editable.title !== facility.title) return true;
    if (editable.short_description !== undefined && editable.short_description !== facility.short_description) return true;
    if (editable.description1 !== undefined && editable.description1 !== (facility.description1 || '')) return true;
    if (editable.description2 !== undefined && editable.description2 !== (facility.description2 || '')) return true;
    if (editable.footer !== undefined && editable.footer !== (facility.footer || '')) return true;
    if (editable.image instanceof File) return true;
    if (editable.status !== undefined && editable.status !== facility.status) return true;
    if (editable.accordions !== undefined) {
      const currentAccordions = JSON.stringify(facility.accordions || []);
      const newAccordions = JSON.stringify(editable.accordions);
      if (currentAccordions !== newAccordions) return true;
    }
    if (editable.doctors !== undefined) {
      const currentDoctors = JSON.stringify(facility.doctors || []);
      const newDoctors = JSON.stringify(editable.doctors);
      if (currentDoctors !== newDoctors) return true;
    }
    if (editable.blogs !== undefined) {
      const currentBlogs = JSON.stringify(facility.blogs || []);
      const newBlogs = JSON.stringify(editable.blogs);
      if (currentBlogs !== newBlogs) return true;
    }

    return false;
  };

  const getFacilityValue = (facility: Facility, field: 'title' | 'short_description' | 'description1' | 'description2' | 'footer' | 'image' | 'status'): string => {
    const editable = editableFacilities[facility.id];
    if (editable && field in editable) {
      if (field === 'image' && editable.image instanceof File) {
        return imagePreviews[`edit-${facility.id}`] || '';
      }
      return editable[field] as string || '';
    }
    return (facility[field] as string) || '';
  };

  const getFacilityArray = (facility: Facility, field: 'doctors' | 'blogs'): number[] => {
    const editable = editableFacilities[facility.id];
    if (editable && editable[field] !== undefined) {
      return editable[field] || [];
    }
    const facilityArray = facility[field];
    if (!facilityArray || !Array.isArray(facilityArray)) return [];
    // Extract IDs if they're objects, otherwise return as-is
    if (facilityArray.length === 0) return [];
    if (typeof facilityArray[0] === 'number') {
      return facilityArray as number[];
    }
    // Handle object arrays - extract IDs
    return facilityArray.map((item: number | { id: number }) => {
      if (typeof item === 'number') return item;
      return item.id;
    });
  };

  const handleUpdateFacility = async (id: number) => {
    const editable = editableFacilities[id];
    const facility = data?.data?.find(f => f.id === id);
    if (!editable || !facility || !hasChanges(facility)) return;

    setUpdatingFacilities(prev => ({ ...prev, [id]: true }));

    try {
      await updateFacility({
        id,
        data: editable,
      }).unwrap();

      setEditingId(null);
      setEditableFacilities(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setImagePreviews(prev => {
        const newState = { ...prev };
        delete newState[`edit-${id}`];
        return newState;
      });
      refetch();
    } catch (error) {
      console.error("Failed to update facility:", error);
      alert("Failed to update facility. Please try again.");
    } finally {
      setUpdatingFacilities(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const facilities = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Facilities Management</CardTitle>
          <Button onClick={addFacility} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Facility
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            Failed to load facilities. Please try again.
          </div>
        ) : (
          <>
            {/* Draft Facilities */}
            {draftFacilities.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-6">
                {draftFacilities.map((draft) => (
                  <Card key={draft.id} id={`facility-${draft.id}`} className="border-2 p-4! border-dashed border-blue-300">
                <CardHeader className=" p-4!">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">New Facility (Draft)</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDraft(draft.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4!">
                  <Field>
                    <FieldLabel>Title *</FieldLabel>
                    <FieldContent>
                      <Input
                        value={draft.title}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'title', e.target.value)}
                        placeholder="Enter facility title"
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Short Description *</FieldLabel>
                    <FieldContent>
                      <div className="bg-white">
                        <style>{`
                          .quill-editor .ql-container {
                            min-height: 200px;
                            height: 200px;
                          }
                        `}</style>
                        <div className="quill-editor">
                          <ReactQuill
                            theme="snow"
                            value={draft.short_description}
                            onChange={(value) => handleDraftFieldChange(draft.id, 'short_description', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter short description"
                          />
                        </div>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Description 1</FieldLabel>
                    <FieldContent>
                      <div className="bg-white">
                        <style>{`
                          .quill-editor .ql-container {
                            min-height: 200px;
                            height: 200px;
                          }
                        `}</style>
                        <div className="quill-editor">
                          <ReactQuill
                            theme="snow"
                            value={draft.description1}
                            onChange={(value) => handleDraftFieldChange(draft.id, 'description1', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter description 1"
                          />
                        </div>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Description 2</FieldLabel>
                    <FieldContent>
                      <div className="bg-white">
                        <style>{`
                          .quill-editor .ql-container {
                            min-height: 200px;
                            height: 200px;
                          }
                        `}</style>
                        <div className="quill-editor">
                          <ReactQuill
                            theme="snow"
                            value={draft.description2}
                            onChange={(value) => handleDraftFieldChange(draft.id, 'description2', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="Enter description 2"
                          />
                        </div>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Footer</FieldLabel>
                    <FieldContent>
                      <Input
                        value={draft.footer}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'footer', e.target.value)}
                        placeholder="Enter footer text"
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Image *</FieldLabel>
                    <FieldContent>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDraftImageChange(draft.id, e.target.files?.[0] || null)}
                        />
                        {imagePreviews[draft.id] && (
                          <img
                            src={imagePreviews[draft.id]}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded border"
                          />
                        )}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Accordions</FieldLabel>
                    <FieldContent>
                      <div className="space-y-2">
                        {(draft.accordions || []).map((accordion, index) => (
                          <div key={index} className="border p-3 rounded space-y-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <Input
                                value={accordion.title}
                                onChange={(e) => handleDraftAccordionChange(draft.id, index, 'title', e.target.value)}
                                placeholder="Accordion title"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDraftAccordion(draft.id, index)}
                                className="text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="bg-white">
                              <style>{`
                                .quill-editor-small .ql-container {
                                  min-height: 150px;
                                  height: 150px;
                                }
                              `}</style>
                              <div className="quill-editor-small">
                                <ReactQuill
                                  theme="snow"
                                  value={accordion.description}
                                  onChange={(value) => handleDraftAccordionChange(draft.id, index, 'description', value)}
                                  modules={quillModules}
                                  formats={quillFormats}
                                  placeholder="Accordion description"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addDraftAccordion(draft.id)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Accordion
                        </Button>
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Doctors</FieldLabel>
                    <FieldContent>
                      <select
                        multiple
                        value={draft.doctors.map(String)}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                          handleDraftFieldChange(draft.id, 'doctors', selected);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                      >
                        {doctorsData?.data?.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.doctor_name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Blogs</FieldLabel>
                    <FieldContent>
                      <select
                        multiple
                        value={draft.blogs.map(String)}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                          handleDraftFieldChange(draft.id, 'blogs', selected);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                      >
                        {blogsData?.data?.map((blog) => (
                          <option key={blog.id} value={blog.id}>
                            {blog.title}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <select
                        value={draft.status}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'status', e.target.value as 'active' | 'inactive')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                      </select>
                    </FieldContent>
                  </Field>

                  <Button
                    onClick={() => handleCreateFacility(draft.id)}
                    disabled={creatingFacilities[draft.id]}
                    className="w-full"
                  >
                    {creatingFacilities[draft.id] ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Create Facility
                      </>
                    )}
                  </Button>
                </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Existing Facilities */}
            {facilities.length === 0 && draftFacilities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No facilities found. Click "Add Facility" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-6 p-5">
                {facilities.map((facility) => {
                  const isEditing = editingId === facility.id;
                  const editable = editableFacilities[facility.id] || {};

                  return (
                    <Card key={facility.id} className="border p-4!">
                      <CardHeader className="pb-4 ">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {isEditing ? "Editing Facility" : facility.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelEdit(facility.id)}
                                  disabled={updatingFacilities[facility.id]}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateFacility(facility.id)}
                                  disabled={updatingFacilities[facility.id] || !hasChanges(facility)}
                                >
                                  {updatingFacilities[facility.id] ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Save
                                    </>
                                  )}
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEdit(facility)}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteClick(facility.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Title</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <Input
                                value={getFacilityValue(facility, 'title')}
                                onChange={(e) => handleEditFieldChange(facility.id, 'title', e.target.value)}
                                placeholder="Enter facility title"
                              />
                            ) : (
                              <p className="text-gray-700">{facility.title}</p>
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Short Description</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <div className="bg-white">
                                <style>{`
                                  .quill-editor .ql-container {
                                    min-height: 200px;
                                    height: 200px;
                                  }
                                `}</style>
                                <div className="quill-editor">
                                  <ReactQuill
                                    theme="snow"
                                    value={getFacilityValue(facility, 'short_description')}
                                    onChange={(value) => handleEditFieldChange(facility.id, 'short_description', value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter short description"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="text-gray-700 prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: facility.short_description }}
                              />
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Description 1</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <div className="bg-white">
                                <style>{`
                                  .quill-editor .ql-container {
                                    min-height: 200px;
                                    height: 200px;
                                  }
                                `}</style>
                                <div className="quill-editor">
                                  <ReactQuill
                                    theme="snow"
                                    value={getFacilityValue(facility, 'description1')}
                                    onChange={(value) => handleEditFieldChange(facility.id, 'description1', value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter description 1"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="text-gray-700 prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: facility.description1 || '' }}
                              />
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Description 2</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <div className="bg-white">
                                <style>{`
                                  .quill-editor .ql-container {
                                    min-height: 200px;
                                    height: 200px;
                                  }
                                `}</style>
                                <div className="quill-editor">
                                  <ReactQuill
                                    theme="snow"
                                    value={getFacilityValue(facility, 'description2')}
                                    onChange={(value) => handleEditFieldChange(facility.id, 'description2', value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter description 2"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="text-gray-700 prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: facility.description2 || '' }}
                              />
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Footer</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <Input
                                value={getFacilityValue(facility, 'footer')}
                                onChange={(e) => handleEditFieldChange(facility.id, 'footer', e.target.value)}
                                placeholder="Enter footer text"
                              />
                            ) : (
                              <p className="text-gray-700">{facility.footer || ''}</p>
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Image</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleEditImageChange(facility.id, e.target.files?.[0] || null)}
                                />
                                {(imagePreviews[`edit-${facility.id}`] || facility.image) && (
                                  <img
                                    src={imagePreviews[`edit-${facility.id}`] || facility.image}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded border"
                                  />
                                )}
                              </div>
                            ) : (
                              <img
                                src={facility.image}
                                alt={facility.title}
                                className="w-32 h-32 object-cover rounded border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/vite.svg";
                                }}
                              />
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Accordions</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <div className="space-y-2">
                                {getAccordions(facility, editable).map((accordion, index) => (
                                  <div key={index} className="border p-3 rounded space-y-2">
                                    <div className="flex items-center gap-2">
                                      <GripVertical className="w-4 h-4 text-gray-400" />
                                      <Input
                                        value={accordion.title}
                                        onChange={(e) => handleEditAccordionChange(facility.id, index, 'title', e.target.value)}
                                        placeholder="Accordion title"
                                        className="flex-1"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeEditAccordion(facility.id, index)}
                                        className="text-red-500"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="bg-white">
                                      <style>{`
                                        .quill-editor-small .ql-container {
                                          min-height: 150px;
                                          height: 150px;
                                        }
                                      `}</style>
                                      <div className="quill-editor-small">
                                        <ReactQuill
                                          theme="snow"
                                          value={accordion.description}
                                          onChange={(value) => handleEditAccordionChange(facility.id, index, 'description', value)}
                                          modules={quillModules}
                                          formats={quillFormats}
                                          placeholder="Accordion description"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addEditAccordion(facility.id)}
                                  className="w-full"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Accordion
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {(facility.accordions || []).map((accordion, index) => (
                                  <div key={index} className="border p-3 rounded">
                                    <h4 className="font-semibold mb-2">{accordion.title}</h4>
                                    <div 
                                      className="text-gray-700 prose max-w-none text-sm"
                                      dangerouslySetInnerHTML={{ __html: accordion.description }}
                                    />
                                  </div>
                                ))}
                                {(!facility.accordions || facility.accordions.length === 0) && (
                                  <p className="text-gray-500 text-sm">No accordions</p>
                                )}
                              </div>
                            )}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Doctors</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <select
                                multiple
                                value={getFacilityArray(facility, 'doctors').map(String)}
                                onChange={(e) => {
                                  const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                  handleEditFieldChange(facility.id, 'doctors', selected);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                              >
                                {doctorsData?.data?.map((doctor) => (
                                  <option key={doctor.id} value={doctor.id}>
                                    {doctor.doctor_name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="space-y-1">
                                {getFacilityArray(facility, 'doctors').length > 0 ? (
                                  getFacilityArray(facility, 'doctors').map((doctorId) => {
                                    const doctor = doctorsData?.data?.find(d => d.id === doctorId);
                                    return doctor ? (
                                      <span key={doctorId} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                                        {doctor.doctor_name}
                                      </span>
                                    ) : null;
                                  })
                                ) : (
                                  <p className="text-gray-500 text-sm">No doctors selected</p>
                                )}
                              </div>
                            )}
                            {isEditing && <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Blogs</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <select
                                multiple
                                value={getFacilityArray(facility, 'blogs').map(String)}
                                onChange={(e) => {
                                  const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                  handleEditFieldChange(facility.id, 'blogs', selected);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                              >
                                {blogsData?.data?.map((blog) => (
                                  <option key={blog.id} value={blog.id}>
                                    {blog.title}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="space-y-1">
                                {getFacilityArray(facility, 'blogs').length > 0 ? (
                                  getFacilityArray(facility, 'blogs').map((blogId) => {
                                    const blog = blogsData?.data?.find(b => b.id === blogId);
                                    return blog ? (
                                      <span key={blogId} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
                                        {blog.title}
                                      </span>
                                    ) : null;
                                  })
                                ) : (
                                  <p className="text-gray-500 text-sm">No blogs selected</p>
                                )}
                              </div>
                            )}
                            {isEditing && <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>}
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel>Status</FieldLabel>
                          <FieldContent>
                            {isEditing ? (
                              <select
                                value={editable.status !== undefined ? editable.status : facility.status}
                                onChange={(e) => handleEditFieldChange(facility.id, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="inactive">Inactive</option>
                                <option value="active">Active</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-1 rounded text-sm ${
                                facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {facility.status}
                              </span>
                            )}
                          </FieldContent>
                        </Field>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_page > 1 && (
              <DataTablePagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_page}
                totalEntries={pagination.total_count}
                entriesPerPage={pagination.per_page}
                onPageChange={setCurrentPage}
                showingFrom={(pagination.current_page - 1) * pagination.per_page + 1}
                showingTo={Math.min(pagination.current_page * pagination.per_page, pagination.total_count)}
              />
            )}
          </>
        )}

        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={confirmDelete}
          title="Delete Facility"
          description="Are you sure you want to delete this facility? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </CardContent>
    </Card>
  );
}

