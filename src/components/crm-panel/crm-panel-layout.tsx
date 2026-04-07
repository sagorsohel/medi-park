"use client";

import { Outlet, useLocation } from "react-router";
import { CRMSidebar } from "@/components/crm-panel/crm-sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { CRMNavbar } from "@/components/crm-panel/crm-navbar";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function CRMPanelLayout() {
  const location = useLocation();
  const sidebar = useStore(useSidebar, (x) => x);
  const { setTheme } = useTheme();
  
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <CRMSidebar />
      <main
        className={cn(
          "min-h-screen transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <CRMNavbar title="MediPark Enterprise Portal" />
        <div className="px-5 py-8 sm:px-10 lg:px-12 bg-slate-50 min-h-[calc(100vh-80px)]">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
