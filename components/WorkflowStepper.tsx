"use client";

import Link from "next/link";

export const WORKFLOW_STEPS = [
  "SUMMARY",
  "DESIGN SURVEY",
  "CONNECT APPS",
  "COLLECT RESPONSES",
  "ANALYZE RESULTS",
] as const;

export type WorkflowStepIndex = 0 | 1 | 2 | 3 | 4;

const STEP_ROUTES: Record<WorkflowStepIndex, string> = {
  0: "/summary",
  1: "/survey-builder",
  2: "/connect-apps",
  3: "/collect-responses",
  4: "/analyze-results",
};

interface WorkflowStepperProps {
  activeStep?: WorkflowStepIndex;
}

export default function WorkflowStepper({ activeStep = 1 }: WorkflowStepperProps) {
  return (
    <div className="h-12 bg-[#f8f8f8] flex items-center justify-between px-6 border-b border-gray-200">
      <nav className="flex items-center min-h-full" aria-label="Survey workflow">
        {WORKFLOW_STEPS.map((label, i) => {
          const href = STEP_ROUTES[i as WorkflowStepIndex];
          const isActive = i === activeStep;
          return (
            <div key={label} className="flex items-center min-h-full">
              <Link
                href={href}
                className={`text-xs font-semibold tracking-wide py-3 block min-h-full flex items-center ${
                  isActive
                    ? "text-[#3aa666] border-b-2 border-[#3aa666] -mb-px"
                    : "text-[#6b7280] hover:text-[#282a2e] hover:bg-gray-100/80"
                }`}
              >
                {label}
              </Link>
              {i < WORKFLOW_STEPS.length - 1 && (
                <span className="text-gray-400 text-sm mx-2 select-none" aria-hidden>
                  →
                </span>
              )}
            </div>
          );
        })}
      </nav>
      <button
        type="button"
        className="px-4 py-2 rounded-md bg-white text-[#4a4d52] text-sm font-medium border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
      >
        Preview survey
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </button>
    </div>
  );
}
