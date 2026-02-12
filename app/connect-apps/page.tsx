"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";

export default function ConnectAppsPage() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <WorkflowStepper activeStep={2} />
      <main className="flex-1 flex items-center justify-center bg-[#f5f6f7]">
        <p className="text-[#6b7280]">Connect Apps</p>
      </main>
    </div>
  );
}
