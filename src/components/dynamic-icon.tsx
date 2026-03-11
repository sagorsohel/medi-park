"use client";

import React, { useState, useEffect, Suspense } from "react";

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
    const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        if (!name) return;

        // Determine the icon set from the name (e.g., "AiFillAliwangwang" -> "ai")
        let set = name.substring(0, 2).toLowerCase();

        // Special cases for react-icons
        if (["hi", "hi2"].includes(set)) set = "hi";
        if (["io", "io5"].includes(set)) set = "io";
        if (["ri"].includes(set)) set = "ri";

        const loadIcon = async () => {
            try {
                let module;
                switch (set) {
                    case 'ai': module = await import("react-icons/ai"); break;
                    case 'bs': module = await import("react-icons/bs"); break;
                    case 'fa': module = await import("react-icons/fa"); break;
                    case 'md': module = await import("react-icons/md"); break;
                    case 'hi': module = await import("react-icons/hi"); break;
                    case 'fi': module = await import("react-icons/fi"); break;
                    case 'gi': module = await import("react-icons/gi"); break;
                    case 'go': module = await import("react-icons/go"); break;
                    case 'gr': module = await import("react-icons/gr"); break;
                    case 'im': module = await import("react-icons/im"); break;
                    case 'io': module = await import("react-icons/io"); break;
                    case 'ri': module = await import("react-icons/ri"); break;
                    case 'si': module = await import("react-icons/si"); break;
                    case 'ti': module = await import("react-icons/ti"); break;
                    case 'wi': module = await import("react-icons/wi"); break;
                    case 'cg': module = await import("react-icons/cg"); break;
                    case 'vsc': module = await import("react-icons/vsc"); break;
                    default:
                        // Fallback to Ai if unknown
                        module = await import("react-icons/ai");
                }

                const component = (module as any)[name];
                if (component) {
                    setIconComponent(() => component);
                }
            } catch (error) {
                console.error(`Failed to load icon: ${name}`, error);
            }
        };

        loadIcon();
    }, [name]);

    if (!IconComponent) {
        return <div className={props.className} style={{ width: props.width, height: props.height }} />;
    }

    return <IconComponent {...props} />;
}
