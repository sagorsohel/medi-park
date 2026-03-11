"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, RefreshCw, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
    useGetVideoLinkQuery,
    useUpdateVideoLinkMutation,
} from "@/services/videoLinkApi";

export function VideoLinkManage() {
    const { data, isLoading, error, refetch } = useGetVideoLinkQuery();
    const [updateVideoLink] = useUpdateVideoLinkMutation();

    const [editableData, setEditableData] = useState<{
        title?: string;
        description?: string;
        video?: string;
        status?: "active" | "inactive";
    }>({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (data?.data) {
            setEditableData({});
        }
    }, [data]);

    const hasChanges = (): boolean => {
        if (!data?.data) return Object.keys(editableData).length > 0;
        const section = data.data;

        if (editableData.title !== undefined && editableData.title !== section.title) return true;
        if (editableData.description !== undefined && editableData.description !== section.description) return true;
        if (editableData.video !== undefined && editableData.video !== section.video) return true;
        if (editableData.status !== undefined && editableData.status !== section.status) return true;

        return false;
    };

    const handleInputChange = (field: string, value: string) => {
        setEditableData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!hasChanges()) return;

        setUpdating(true);

        try {
            const currentObj: any = data?.data || {};
            const payload = {
                title: editableData.title !== undefined ? editableData.title : currentObj.title,
                description: editableData.description !== undefined ? editableData.description : currentObj.description,
                video: editableData.video !== undefined ? editableData.video : currentObj.video,
                status: editableData.status !== undefined ? editableData.status : currentObj.status,
            };

            await updateVideoLink(payload).unwrap();

            setEditableData({});
            refetch();
            toast.success("Video link updated successfully!");
        } catch (err) {
            console.error("Failed to update video link:", err);
            toast.error("Failed to update video link. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handleReset = () => {
        setEditableData({});
    };

    if (isLoading) {
        return (
            <Card className="mt-8">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="mt-8">
                <CardContent className="text-center py-12 text-red-500">
                    Failed to load video link data. Please try again.
                </CardContent>
            </Card>
        );
    }

    const currentData = data?.data || null;

    const getValue = (key: string) => {
        if (editableData[key as keyof typeof editableData] !== undefined)
            return editableData[key as keyof typeof editableData] as string;
        if (currentData) return (currentData as any)[key] as string || "";
        return "";
    };

    return (
        <Card className="mt-8 p-5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Video Link Management</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={updating}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <FieldContent>
                            <Input
                                value={getValue("title")}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Video title"
                            />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Video URL</FieldLabel>
                        <FieldContent>
                            <Input
                                value={getValue("video")}
                                onChange={(e) => handleInputChange("video", e.target.value)}
                                placeholder="https://example.com/video.mp4"
                            />
                        </FieldContent>
                    </Field>
                </div>

                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <FieldContent>
                        <Textarea
                            value={getValue("description")}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Video description..."
                            rows={4}
                        />
                    </FieldContent>
                </Field>

                {/* Video Preview */}
                {getValue("video") && (
                    <Field>
                        <FieldLabel>Preview</FieldLabel>
                        <FieldContent>
                            <div className="relative w-full max-w-xl rounded-lg overflow-hidden border border-gray-300 bg-black aspect-video flex items-center justify-center">
                                {(() => {
                                    const videoUrl = getValue("video");
                                    const youtubeMatch = videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                                    const youtubeId = youtubeMatch && youtubeMatch[2].length === 11 ? youtubeMatch[2] : null;

                                    if (youtubeId) {
                                        return (
                                            <iframe
                                                className="w-full h-full"
                                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                                title="Video Preview"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                        );
                                    }

                                    return (
                                        <video
                                            key={videoUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                            src={videoUrl}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    );
                                })()}
                            </div>
                        </FieldContent>
                    </Field>
                )}

                <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                        <select
                            value={getValue("status") || "active"}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                        >
                            <option value="inactive">Inactive</option>
                            <option value="active">Active</option>
                        </select>
                    </FieldContent>
                </Field>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                        onClick={handleUpdate}
                        disabled={!hasChanges() || updating}
                        className="flex items-center gap-2"
                    >
                        {updating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Update Video Link
                            </>
                        )}
                    </Button>

                    {hasChanges() && (
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={updating}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Reset Changes
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
