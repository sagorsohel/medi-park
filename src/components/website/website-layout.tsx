"use client";

import { Outlet, useLocation } from "react-router";
import { WebsiteNavbar } from "./website-navbar";
import { WebsiteFooter } from "./website-footer";
import { useEffect } from "react";
import { store } from "@/store";
import { homepageApi } from "@/services/homepageApi";
import { aboutPageApi } from "@/services/aboutPageApi";

export function WebsiteLayout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Let React Query hooks handle data fetching natively

  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteNavbar />
      <main className="flex-1 overflow-hidden py-[100px]">
        <Outlet />
      </main>
      <WebsiteFooter />
    </div>
  );
}

