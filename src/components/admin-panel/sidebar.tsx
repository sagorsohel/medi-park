"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { Edit, Eye, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

export function Sidebar() {
  // All hooks must be called before any conditional returns
  const sidebar = useStore(useSidebar, (x) => x);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Early return after all hooks
  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full bg-[#D7EBFB] lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col shadow-md rounded-r-lg bg-[#D7EBFB] p-3"
      >
        {/* Logo Section - Fixed at top */}
        <div className="shrink-0 px-4  p-3 border-4 border-white bg-[#D7EBFB] rounded-[12px]">
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
        <div className="flex-1 overflow-hidden min-h-0 border-4 border-white py-4 rounded-[12px] mt-6">
          <Menu isOpen={getOpenState()} />
        </div>

        {/* Profile Section - Fixed at bottom */}
        <div className={cn(
          "shrink-0 pt-4 pb-3 px-2 rounded-[12px] bg-[#D7EBFB]",
          !getOpenState() && "px-2"
        )}>
          <div className={cn(
            "transition-[transform,opacity,display] ease-in-out duration-300",
            !getOpenState()
              ? "-translate-x-96 opacity-0 hidden"
              : "translate-x-0 opacity-100"
          )}>
            <p className="text-sm font-semibold text-gray-700 mb-3 px-2">Profile</p>
            <div className="bg-white rounded-lg p-3  shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
            <img src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" alt="" className="size-[47px] object-cover rounded-lg border p-1" />
              <div>
                <p className="text-sm text-gray-800 font-medium truncate mb-1">
                  {user?.email || "user@example.com"}
                </p>

                <p className="text-sm text-gray-800 font-medium capitalize">
                  {user?.role || "Admin"}
                </p>
              </div>
            </div>
              <div className="flex items-center gap-2 px-2 pt-2">
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {/* Handle edit */ }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Edit</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {/* Handle view */ }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Log Out</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

          </div>
          {!getOpenState() && (
            <div className="flex flex-col items-center gap-2">
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {/* Handle edit */ }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {/* Handle view */ }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Log Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
