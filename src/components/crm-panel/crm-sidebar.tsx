"use client";

import { CRMMenu } from "@/components/crm-panel/crm-menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export function CRMSidebar() {
  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full bg-sidebar lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col shadow-md rounded-r-lg bg-sidebar p-3"
      >
        <div className="shrink-0 px-4 p-3 border-4 border-sidebar-border bg-sidebar rounded-[12px]">
          <Link
            to="/accounting/software/dashboard"
            className={cn(
              "flex items-center gap-3 transition-opacity duration-300",
              !getOpenState() ? "justify-center" : "justify-start"
            )}
          >
            <div
              className={cn(
                "transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
                <div className="flex flex-col items-start">
                    <span className="text-xl font-black text-primary leading-none tracking-tight">MediPark</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 pl-0.5">Accounting Soft</span>
                </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-hidden min-h-0 border-4 border-sidebar-border py-4 rounded-[12px] mt-6">
          <CRMMenu isOpen={getOpenState()} />
        </div>
      </div>
    </aside>
  );
}
