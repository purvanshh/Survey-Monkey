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
    <div className="h-11 min-h-[44px] bg-[#f2f3f5] flex items-center justify-between px-6 border-b border-[#e5e7e9]">
      <nav className="flex items-center gap-1" aria-label="Survey workflow">
        {WORKFLOW_STEPS.map((label, i) => {
          const href = STEP_ROUTES[i as WorkflowStepIndex];
          const isActive = i === activeStep;
          return (
            <div key={label} className="flex items-center">
              <Link
                href={href}
                className={`text-xs font-semibold tracking-wide py-2.5 px-1 flex items-center border-b-2 -mb-px ${
                  isActive
                    ? "text-[#4a9b6e] border-[#4a9b6e]"
                    : "text-[#6b7280] border-transparent hover:text-[#3d4146]"
                }`}
              >
                {label}
              </Link>
              {i < WORKFLOW_STEPS.length - 1 && (
                <span className="text-[#a0a4a8] mx-2.5 select-none flex items-center" aria-hidden>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              )}
            </div>
          );
        })}
      </nav>
      <button
        type="button"
        className="h-8 px-3 rounded-md bg-white text-[#4a4d52] text-sm font-medium border border-[#d1d5da] hover:bg-gray-50 flex items-center gap-1.5 shrink-0"
      >
        Preview survey
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </button>
    </div>
  );
}
