"use client";

import { User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export function UserNav() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200/50">
      <div className="flex items-center gap-1">
        {/* Avatar Icon Section */}
        <div className="bg-sidebar-accent/50 rounded-lg p-2 shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-lg px-3 py-2 flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-none mb-1 truncate">
            {user?.name || 'Admin'}
          </p>
          <p className="text-xs text-gray-700 leading-none truncate">
            {user?.email || 'techisloveforever@gmail.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
