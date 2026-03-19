import { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-screen bg-coven-bg text-coven-text">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-4 py-4 md:px-8 md:py-6">{children}</main>
      </div>
    </div>
  );
}

