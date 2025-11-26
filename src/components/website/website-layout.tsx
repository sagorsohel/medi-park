"use client";

import { Outlet } from "react-router";
import { WebsiteNavbar } from "./website-navbar";
import { WebsiteFooter } from "./website-footer";

export function WebsiteLayout() {
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

