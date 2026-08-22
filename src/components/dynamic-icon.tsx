"use client";

import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";

interface DynamicIconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
    name?: string | null;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
    const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        if (!name || typeof name !== "string") return;

        const cleanName = name.trim();
        if (!cleanName) return;

        // Determine icon set prefix (checking 3-character prefixes first)
        let set = "";
        const p3 = cleanName.substring(0, 3).toLowerCase();
        if (["fa6", "hi2", "io5", "tfi", "vsc", "lia"].includes(p3)) {
            set = p3;
        } else {
            set = cleanName.substring(0, 2).toLowerCase();
        }

        let isMounted = true;

        const loadIcon = async () => {
            try {
                let module: any;
                switch (set) {
                    case 'ai': module = await import("react-icons/ai"); break;
                    case 'bs': module = await import("react-icons/bs"); break;
                    case 'bi': module = await import("react-icons/bi"); break;
                    case 'ci': module = await import("react-icons/ci"); break;
                    case 'cg': module = await import("react-icons/cg"); break;
                    case 'di': module = await import("react-icons/di"); break;
                    case 'fa': module = await import("react-icons/fa"); break;
                    case 'fa6': module = await import("react-icons/fa6"); break;
                    case 'fi': module = await import("react-icons/fi"); break;
                    case 'fc': module = await import("react-icons/fc"); break;
                    case 'gi': module = await import("react-icons/gi"); break;
                    case 'go': module = await import("react-icons/go"); break;
                    case 'gr': module = await import("react-icons/gr"); break;
                    case 'hi': module = await import("react-icons/hi"); break;
                    case 'hi2': module = await import("react-icons/hi2"); break;
                    case 'im': module = await import("react-icons/im"); break;
                    case 'io': module = await import("react-icons/io"); break;
                    case 'io5': module = await import("react-icons/io5"); break;
                    case 'lia': module = await import("react-icons/lia"); break;
                    case 'lu': module = await import("react-icons/lu"); break;
                    case 'md': module = await import("react-icons/md"); break;
                    case 'pi': module = await import("react-icons/pi"); break;
                    case 'ri': module = await import("react-icons/ri"); break;
                    case 'rx': module = await import("react-icons/rx"); break;
                    case 'si': module = await import("react-icons/si"); break;
                    case 'sl': module = await import("react-icons/sl"); break;
                    case 'tb': module = await import("react-icons/tb"); break;
                    case 'tfi': module = await import("react-icons/tfi"); break;
                    case 'ti': module = await import("react-icons/ti"); break;
                    case 'vsc': module = await import("react-icons/vsc"); break;
                    case 'wi': module = await import("react-icons/wi"); break;
                    default:
                        module = await import("react-icons/bs");
                }

                const component = module?.[cleanName] || module?.default?.[cleanName];
                if (component && isMounted) {
                    setIconComponent(() => component);
                } else if (isMounted) {
                    // Try fallback set if not found in target set
                    try {
                        const fallbackModule: Record<string, any> = await import("react-icons/bs");
                        const fallbackComponent = fallbackModule?.[cleanName] || fallbackModule?.default?.[cleanName];
                        if (fallbackComponent && isMounted) {
                            setIconComponent(() => fallbackComponent);
                        }
                    } catch {}
                }
            } catch (error) {
                console.error(`Failed to load icon: ${cleanName}`, error);
            }
        };

        loadIcon();

        return () => {
            isMounted = false;
        };
    }, [name]);

    if (!IconComponent) {
        return <Activity className={(props.className as string) || "w-6 h-6"} />;
    }

    return <IconComponent {...props} />;
}
