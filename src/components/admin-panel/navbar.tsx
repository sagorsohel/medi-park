import { Plus, Bell, Box, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 flex items-center z-10 w-full bg-[#D7EBFB] h-16 shadow backdrop-blur supports-backdrop-filter:bg-[#D7EBFB] dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex  items-center justify-between w-full">
        {/* Left Side - Shortcut Button */}
        <div className="flex items-center gap-4">
          <SheetMenu />
          <Button className="bg-primary hover:bg-[#1e3a8a] text-white rounded-lg px-4 py-5 flex items-center gap-2">
            <div className="border border-white rounded p-0.5">
              <Plus className="w-3 h-3" />
            </div>
            <span>Shortcut</span>
          </Button>
        </div>

        {/* Center - Empty or Title (hidden on larger screens) */}
        <div className="flex-1 hidden lg:block">
          <h1 className="font-bold text-center">{title}</h1>
        </div>

        {/* Right Side - Icon Group and User Nav */}
        <div className="flex items-center gap-2 ">
          {/* Icon Group */}
          <div className="bg-white rounded-lg p-4 flex items-center gap-4 mr-2">
            {/* Bell Icon with notification */}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>

            {/* Cube Icon with notification */}
            <div className="relative">
              <Box className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>

            {/* Plus Icon with notification */}
            <div className="relative">
              <Plus className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>

            {/* Settings Icon */}
            <Settings className="w-5 h-5 text-gray-700" />
          </div>

          {/* User Nav */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
