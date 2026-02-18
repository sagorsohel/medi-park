
import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    useGetCommissionSettingsQuery,
    useUpdateCommissionSettingsMutation,
    type CommissionSetting,
} from "@/services/shareManageApi";

export function CommissionSettingsTab() {
    const { data: serverSettings, isLoading } = useGetCommissionSettingsQuery();
    const [updateSettings] = useUpdateCommissionSettingsMutation();

    const [settings, setSettings] = useState<CommissionSetting[]>([]);

    useEffect(() => {
        if (serverSettings) {
            setSettings(serverSettings);
        }
    }, [serverSettings]);

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const handleUpdate = async (level: number, percentage: number) => {
        try {
            await updateSettings({ level, percentage }).unwrap();
            toast.success(`Level ${level} updated successfully`);
        } catch (error) {
            toast.error("Failed to update commission setting");
            console.error(error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Commission Settings</h2>
                <p className="text-muted-foreground">
                    Configure commission percentages for different levels. Each level can be edited individually.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {settings.map((item) => (
                    <CommissionLevelCard
                        key={item.id}
                        setting={item}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>
        </div>
    );
}

interface CommissionLevelCardProps {
    setting: CommissionSetting;
    onUpdate: (level: number, percentage: number) => Promise<void>;
}

function CommissionLevelCard({
    setting,
    onUpdate,
}: CommissionLevelCardProps) {
    const [localPercentage, setLocalPercentage] = useState(setting.percentage);
    const [isSaving, setIsSaving] = useState(false);

    // Track if local state differs from prop state
    // Convert both to number for comparison to avoid string "15.00" vs "15" issues
    const hasChanges = parseFloat(String(localPercentage)) !== parseFloat(String(setting.percentage));

    // If the parent updates the setting from server (e.g. re-fetch), sync local state
    useEffect(() => {
        setLocalPercentage(setting.percentage);
    }, [setting.percentage]);

    const handleSave = async () => {
        try {
            setIsSaving(true);

            await onUpdate(setting.level, parseFloat(String(localPercentage)));

        } catch (error) {
            // Error handled in parent but ensures loading state is reset
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between  space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">
                    Level {setting.level}
                </CardTitle>
                <Badge
                    variant={
                        setting.is_active ? "default" : "destructive"
                    }
                    className={setting.is_active ? "bg-green-600 hover:bg-green-700" : ""}
                >
                    {setting.is_active ? "Active" : "Inactive"}
                </Badge>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid gap-2">
                    <label htmlFor={`percentage-${setting.level}`} className="text-sm font-medium">
                        Commission Percentage (%)
                    </label>
                    <div className="relative">
                        <Input
                            id={`percentage-${setting.level}`}
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={localPercentage}
                            onChange={(e) => setLocalPercentage(e.target.value)}
                            placeholder="0.00"
                            className="text-lg pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    );
}
