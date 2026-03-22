import { ReactNode } from "react";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-screen bg-coven-bg text-coven-text">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-4 py-4 md:px-8 md:py-6">{children}</main>
        <div className="flex justify-center py-4">
          <Image
            src="/illustrations/kniv.png"
            alt=""
            width={30}
            height={30}
            className="opacity-[0.15]"
          />
        </div>
        <Footer />
      </div>
    </div>
  );
}

