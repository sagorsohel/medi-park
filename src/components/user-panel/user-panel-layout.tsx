"use client";

import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./user-sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Navbar } from "./user-navbar";
import { useEffect } from "react";

export default function UserPanelLayout() {
  const location = useLocation();
  const sidebar = useStore(useSidebar, (x) => x);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <Navbar title="User Dashboard" />
        <Outlet />
      </main>
    
    </>
  );
}

