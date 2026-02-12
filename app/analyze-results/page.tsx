"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";

export default function AnalyzeResultsPage() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <WorkflowStepper activeStep={4} />
      <main className="flex-1 flex items-center justify-center bg-[#f5f6f7]">
        <p className="text-[#6b7280]">Analyze Results</p>
      </main>
    </div>
  );
}
