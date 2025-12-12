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

  // Prefetch data when on specific pages for instant display
  useEffect(() => {
    if (location.pathname === "/") {
      store.dispatch(homepageApi.endpoints.getHeroSectionsPublic.initiate());
    } else if (location.pathname === "/about") {
      store.dispatch(aboutPageApi.endpoints.getAboutPageBanner.initiate());
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteNavbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <WebsiteFooter />
    </div>
  );
}

