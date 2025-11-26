"use client";

import { Link } from "react-router";
import { Home } from "lucide-react";

interface BreadcrumbSectionProps {
  currentPage: string;
}

export function BreadcrumbSection({ currentPage }: BreadcrumbSectionProps) {
  return (
    <div className="w-full bg-white py-4 border-t  border-gray-300 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-gray-800">
          <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-bold text-gray-900">{currentPage}</span>
        </nav>
      </div>
    </div>
  );
}

