"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  type Facility,
} from "@/services/homepageApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface DraftFacility {
  id: string; // temporary ID like 'draft-123'
  title: string;
  short_description: string;
  image: string;
  status: 'active' | 'inactive';
  imageFile?: File;
}

interface EditableFacility {
  title?: string;
  short_description?: string;
  image?: string | File;
  status?: 'active' | 'inactive';
}

export function FacilitiesManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetFacilitiesQuery(currentPage);
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
      image: "",
      status: "inactive",
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

  const handleDraftFieldChange = (draftId: string, field: keyof DraftFacility, value: string) => {
    setDraftFacilities(prev =>
      prev.map(draft =>
        draft.id === draftId ? { ...draft, [field]: value } : draft
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
      alert("Please fill in all fields and select an image.");
      return;
    }

    setCreatingFacilities(prev => ({ ...prev, [draftId]: true }));

    try {
      await createFacility({
        title: draft.title,
        short_description: draft.short_description,
        image: draft.imageFile,
        status: draft.status,
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

  const handleEditFieldChange = (id: number, field: keyof EditableFacility, value: string) => {
    setEditableFacilities(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
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
    if (editable.image instanceof File) return true;
    if (editable.status !== undefined && editable.status !== facility.status) return true;

    return false;
  };

  const getFacilityValue = (facility: Facility, field: 'title' | 'short_description' | 'image' | 'status'): string => {
    const editable = editableFacilities[facility.id];
    if (editable && field in editable) {
      if (field === 'image' && editable.image instanceof File) {
        return imagePreviews[`edit-${facility.id}`] || '';
      }
      return editable[field] as string;
    }
    return facility[field] as string;
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                      <Textarea
                        value={draft.short_description}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'short_description', e.target.value)}
                        placeholder="Enter short description"
                        rows={3}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-5">
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
                              <Textarea
                                value={getFacilityValue(facility, 'short_description')}
                                onChange={(e) => handleEditFieldChange(facility.id, 'short_description', e.target.value)}
                                placeholder="Enter short description"
                                rows={3}
                              />
                            ) : (
                              <p className="text-gray-700">{facility.short_description}</p>
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

