"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Link } from "react-router";


export function Sidebar() {
  // All hooks must be called before any conditional returns
  const sidebar = useStore(useSidebar, (x) => x);


  // Early return after all hooks
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
        {/* Logo Section - Fixed at top */}
        <div className="shrink-0 px-4  p-3 border-4 border-sidebar-border bg-sidebar rounded-[12px]">
          <Link
            to="/admin/dashboard"
            className={cn(
              "flex items-center gap-3 transition-opacity duration-300 w-[197px] h-[53px] ",
              !getOpenState() ? "justify-center" : "justify-start"
            )}
          >
            <div className="relative shrink-0">

            </div>
            <div
              className={cn(
                "transition-[transform,opacity,display] ease-in-out w-[197px] h-[53px] duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <img src="/dashboard-logo.png" alt="MediPark Logo" className="w-[197px] h-[53px]" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/logo.png";
              }} />
            </div>
          </Link>
        </div>

        {/* Menu Section - Scrollable */}
        <div className="flex-1 overflow-hidden min-h-0 border-4 border-sidebar-border py-4 rounded-[12px] mt-6">
          <Menu isOpen={getOpenState()} />
        </div>

      </div>
    </aside>
  );
}
