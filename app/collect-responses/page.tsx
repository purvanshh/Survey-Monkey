"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import SurveyLinkSection from "@/components/collect-responses/SurveyLinkSection";
import BuyTargetedResponsesCard from "@/components/collect-responses/BuyTargetedResponsesCard";
import MoreWaysToSendGrid from "@/components/collect-responses/MoreWaysToSendGrid";
import { useState } from "react";

const MOCK_SURVEY_LINK = "https://www.surveymonkey.com/r/L6C6XCL";
const DEFAULT_SURVEY_NAME = "Untitled";

export default function CollectResponsesPage() {
  const [surveyLink, setSurveyLink] = useState(MOCK_SURVEY_LINK);
  const [surveyName, setSurveyName] = useState(DEFAULT_SURVEY_NAME);

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <WorkflowStepper activeStep={3} />
      <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#f5f6f7]">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={surveyName}
              onChange={(e) => setSurveyName(e.target.value)}
              placeholder={DEFAULT_SURVEY_NAME}
              className="text-xl font-bold text-[#282a2e] bg-transparent border-none outline-none focus:ring-0 p-0 min-w-0 max-w-full placeholder:text-gray-400"
              aria-label="Survey name"
            />
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 shrink-0"
              aria-label="Add collaborators"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SurveyLinkSection
                  surveyLink={surveyLink}
                  onLinkChange={setSurveyLink}
                />
              </div>
              <div className="lg:col-span-1">
                <BuyTargetedResponsesCard />
              </div>
            </div>

            <MoreWaysToSendGrid />
          </div>
        </div>
      </main>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30" style={{ writingMode: "vertical-rl" }}>
        <button
          type="button"
          className="py-2 px-2 bg-[#4a4d52] text-white text-xs font-medium rounded-l-md shadow-md hover:bg-[#374151]"
        >
          Feedback!
        </button>
      </div>
    </div>
  );
}
