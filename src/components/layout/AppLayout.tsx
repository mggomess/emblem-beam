import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";

export function AppLayout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="md:pl-64">
        <Topbar title={title} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
