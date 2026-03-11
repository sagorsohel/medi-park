"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/dynamic-icon";

const iconSetManifest = {
    Ai: () => import("react-icons/ai"),
    Bs: () => import("react-icons/bs"),
    Fa: () => import("react-icons/fa"),
    Md: () => import("react-icons/md"),
    Hi: () => import("react-icons/hi"),
};

interface IconSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function IconSelector({ value, onChange, disabled }: IconSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSet, setActiveSet] = useState<keyof typeof iconSetManifest>("Ai");
    const [loadedSets, setLoadedSets] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loadedSets[activeSet]) return;

        const loadSet = async () => {
            setIsLoading(true);
            try {
                const module = await iconSetManifest[activeSet]();
                setLoadedSets(prev => ({ ...prev, [activeSet]: module }));
            } catch (error) {
                console.error(`Failed to load icon set: ${activeSet}`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSet();
    }, [activeSet, loadedSets]);

    const filteredIcons = useMemo(() => {
        const currentSet = loadedSets[activeSet];
        if (!currentSet) return [];
        return Object.keys(currentSet).filter((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 50); // Limit to 50 for performance
    }, [searchTerm, activeSet, loadedSets]);

    return (
        <div className="space-y-4 border rounded-md p-4 bg-gray-50/50">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search icons..."
                        className="pl-9"
                        disabled={disabled}
                    />
                </div>
                {value && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-primary/20 text-primary">
                        <DynamicIcon name={value} className="w-5 h-5" />
                        <span className="text-sm font-medium">{value}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-1 hover:text-red-500"
                            onClick={() => onChange("")}
                            disabled={disabled}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex gap-2 border-b pb-2">
                {Object.keys(iconSetManifest).map((set) => (
                    <button
                        key={set}
                        onClick={() => setActiveSet(set as any)}
                        className={`px-3 py-1 text-xs font-semibold rounded-t-md transition-colors ${activeSet === set
                            ? "bg-white border-t border-x border-b-white -mb-[1px] text-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {set === "Ai" ? "Ant Design" :
                            set === "Bs" ? "Bootstrap" :
                                set === "Fa" ? "Font Awesome" :
                                    set === "Md" ? "Material Design" : "Heroicons"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 min-h-[100px] max-h-[300px] overflow-y-auto p-2 bg-white rounded border">
                {isLoading ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mb-2" />
                        <span className="text-sm">Loading icons...</span>
                    </div>
                ) : (
                    <>
                        {filteredIcons.map((name) => (
                            <button
                                key={name}
                                title={name}
                                onClick={() => onChange(name)}
                                disabled={disabled}
                                className={`flex flex-col items-center justify-center p-2 rounded-md transition-all hover:bg-primary/10 group ${value === name ? "bg-primary/20 border-primary border ring-2 ring-primary/20" : "border-transparent border"
                                    }`}
                            >
                                <div className="group-hover:scale-110 transition-transform">
                                    <DynamicIcon name={name} className="w-6 h-6" />
                                </div>
                            </button>
                        ))}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-400 italic">
                                No icons found for "{searchTerm}"
                            </div>
                        )}
                    </>
                )}
            </div>
            <p className="text-[10px] text-gray-400 italic">
                * Displaying first 50 results. Try searching for specific keywords.
            </p>
        </div>
    );
}
