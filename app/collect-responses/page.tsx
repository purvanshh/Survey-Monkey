"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import SurveyLinkSection from "@/components/collect-responses/SurveyLinkSection";
import BuyTargetedResponsesCard from "@/components/collect-responses/BuyTargetedResponsesCard";
import MoreWaysToSendGrid from "@/components/collect-responses/MoreWaysToSendGrid";
import { useState, useEffect } from "react";
import { getSurvey, generateShareLink } from "@/lib/surveyApi";

const SURVEY_ID_KEY = "current-survey-id";

export default function CollectResponsesPage() {
  const [surveyLink, setSurveyLink] = useState<string>("");
  const [surveyName, setSurveyName] = useState("Untitled");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const surveyId = localStorage.getItem(SURVEY_ID_KEY);
        if (!surveyId) {
          setError("No survey found. Please create a survey first.");
          setLoading(false);
          return;
        }

        // Load survey from DB
        const survey = await getSurvey(surveyId);
        if (cancelled) return;
        setSurveyName(survey.title);

        // Generate (or reuse) share link
        const shareData = await generateShareLink(surveyId);
        if (cancelled) return;
        setSurveyLink(shareData.share_url);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load survey:", err);
          setError("Failed to load survey. Make sure the backend is running.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
            placeholder="Untitled"
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
      <WorkflowStepper activeStep={3} />
      <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#f5f6f7]">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Loading survey...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            ) : (
              <>
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
              </>
            )}
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
