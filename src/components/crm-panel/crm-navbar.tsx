import { Plus, Bell, Box, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CRMUserNav } from "@/components/crm-panel/crm-user-nav";

interface CRMNavbarProps {
  title: string;
}

export function CRMNavbar({ title }: CRMNavbarProps) {
  return (
    <header className="sticky top-0 flex items-center z-10 w-full bg-slate-50/80 h-20 shadow-sm backdrop-blur-xl border-b-2 border-slate-100/50">
      <div className="mx-4 sm:mx-8 flex items-center justify-between w-full">
        {/* Left Side */}
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-start lg:hidden">
              <span className="text-xl font-black text-primary leading-none tracking-tight">MediPark</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 pl-0.5">CRM Portal</span>
           </div>
           
           <div className="hidden lg:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{title || "Portal Active"}</span>
           </div>
        </div>

        {/* Center - Empty */}
        <div className="flex-1" />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-xl p-2.5 flex items-center gap-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="relative group cursor-pointer">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </div>

            <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
          </div>

          <CRMUserNav />
        </div>
      </div>
    </header>
  );
}
