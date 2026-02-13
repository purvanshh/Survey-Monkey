"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getSurvey,
  getCollectors,
  getResponseCount,
  deleteSurvey,
} from "@/lib/surveyApi";
import type { ApiSurvey, ApiCollector } from "@/types/survey";

const SURVEY_ID_KEY = "current-survey-id";

export default function SummaryPage() {
  const router = useRouter();
  const [survey, setSurvey] = useState<ApiSurvey | null>(null);
  const [collectors, setCollectors] = useState<ApiCollector[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const surveyIdRef = useRef<string | null>(null);

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
        surveyIdRef.current = surveyId;

        const [surveyData, collectorsData, countData] = await Promise.all([
          getSurvey(surveyId),
          getCollectors(surveyId).catch(() => ({ collectors: [], total_responses: 0 })),
          getResponseCount(surveyId).catch(() => ({ count: 0 })),
        ]);

        if (cancelled) return;
        setSurvey(surveyData);
        setCollectors(collectorsData.collectors);
        setTotalResponses(countData.count);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load summary:", err);
          setError("Failed to load survey summary.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteSurvey = async () => {
    const sid = surveyIdRef.current;
    if (!sid) return;
    setDeleting(true);
    try {
      await deleteSurvey(sid);
      localStorage.removeItem(SURVEY_ID_KEY);
      router.push("/survey-builder");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete survey.");
      setDeleting(false);
    }
  };

  const questionCount = survey?.questions.length ?? 0;
  const hasQuestions = questionCount > 0;
  const hasCollector = collectors.length > 0;
  const createdDate = survey
    ? new Date(survey.created_at).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Completion ring: 86% if questions exist, 0% otherwise (matches reference)
  const completionPct = hasQuestions ? 86 : 0;
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (completionPct / 100) * ringCircumference;

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />

      {/* Survey name bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#282a2e]">{survey?.title ?? "Untitled"}</h1>
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

      <WorkflowStepper activeStep={0} />

      <main className="flex-1 overflow-auto bg-[#f5f6f7]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-[#6b7280]">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">Loading summary...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
          ) : (
            <>
              {/* ── Progress stepper ── */}
              <div className="bg-white rounded-xl border border-[#e5e7e9] px-8 py-6 mb-6">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {/* Step 1: Add questions */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasQuestions ? "bg-[#4a9b6e]" : "bg-[#e5e7e9]"}`}>
                      {hasQuestions ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="text-sm font-bold text-[#6b7280]">1</span>
                      )}
                    </div>
                    <button type="button" onClick={() => router.push("/survey-builder")} className="flex items-center gap-1.5 text-sm font-medium text-[#3d4146] hover:text-[#4a9b6e]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Add questions
                    </button>
                  </div>

                  {/* Line */}
                  <div className={`flex-1 h-1 rounded-full mx-2 ${hasQuestions ? "bg-[#4a9b6e]" : "bg-[#e5e7e9]"}`} />

                  {/* Step 2: Go to Collect */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasCollector ? "bg-[#4a9b6e]" : "bg-[#e5e7e9]"}`}>
                      {hasCollector ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="text-sm font-bold text-[#6b7280]">2</span>
                      )}
                    </div>
                    <button type="button" onClick={() => router.push("/collect-responses")} className="flex items-center gap-1.5 text-sm font-medium text-[#3d4146] hover:text-[#4a9b6e]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Go to Collect
                    </button>
                  </div>

                  {/* Line */}
                  <div className={`flex-1 h-1 rounded-full mx-2 ${totalResponses > 0 ? "bg-[#4a9b6e]" : "bg-[#e5e7e9]"}`} />

                  {/* Step 3: Analyze your results */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${totalResponses > 0 ? "bg-[#4a9b6e] border-[#4a9b6e]" : "bg-white border-[#4a9b6e]"}`}>
                      {totalResponses > 0 ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="text-sm font-bold text-[#4a9b6e]">3</span>
                      )}
                    </div>
                    <button type="button" onClick={() => router.push("/analyze-results")} className="flex items-center gap-1.5 text-sm font-medium text-[#3d4146] hover:text-[#4a9b6e]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Analyze your results
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Created + page info bar ── */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#6b7280]">
                  Created on {createdDate} | 1 page, {questionCount} {questionCount === 1 ? "question" : "questions"}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <button type="button" onClick={() => router.push("/survey-builder")} className="text-[#2563eb] hover:underline font-medium">Edit design</button>
                  <span className="text-[#d1d5da]">|</span>
                  <button type="button" onClick={() => router.push("/collect-responses")} className="text-[#2563eb] hover:underline font-medium">Send survey</button>
                  <span className="text-[#d1d5da]">|</span>
                  <button type="button" onClick={() => router.push("/analyze-results")} className="text-[#2563eb] hover:underline font-medium">Analyze results</button>
                </div>
              </div>

              {/* ── Main grid: left sidebar + right panel ── */}
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Left: SurveyMonkey Genius + completion ring */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-6">
                    <h3 className="text-sm font-semibold text-[#282a2e] text-center mb-4">SurveyMonkey Genius</h3>
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r={ringRadius} fill="none" stroke="#e5e7e9" strokeWidth="8" />
                          <circle
                            cx="60"
                            cy="60"
                            r={ringRadius}
                            fill="none"
                            stroke="#4a9b6e"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            strokeDashoffset={ringOffset}
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center border-t border-[#e5e7e9] pt-4">
                      <div>
                        <p className="text-xs text-[#6b7280]">Estimated completion rate</p>
                        <p className="text-xl font-bold text-[#282a2e] mt-1">{completionPct}%</p>
                        <p className="text-xs text-[#6b7280]">Completed</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6b7280]">Estimated time to complete</p>
                        <p className="text-xl font-bold text-[#282a2e] mt-1">0</p>
                        <p className="text-xs text-[#6b7280]">Minute</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-4 text-sm text-[#3d4146] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">Survey language:</span>
                      <span className="font-medium">English</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">Theme:</span>
                      <span className="font-medium">Heritage</span>
                    </div>
                  </div>

                  <div className="bg-[#fef3c7] rounded-xl border border-[#fde68a] p-4 flex items-center justify-between">
                    <span className="text-sm text-[#3d4146]">Upgrade to add your logo</span>
                    <button type="button" className="px-3 py-1.5 text-sm font-medium text-[#3d4146] bg-[#facc15] border border-[#eab308] rounded hover:bg-[#eab308]">
                      Upgrade
                    </button>
                  </div>

                  {/* Delete survey */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete survey
                  </button>
                </div>

                {/* Right: stats + collectors + response volume */}
                <div className="space-y-6">
                  {/* Stats row */}
                  <div className="bg-white rounded-xl border border-[#e5e7e9] overflow-hidden">
                    <div className="grid grid-cols-3 divide-x divide-[#e5e7e9]">
                      <div className="p-5">
                        <p className="text-sm text-[#6b7280] font-medium">Total responses</p>
                        <p className="text-3xl font-bold text-[#282a2e] mt-1">{totalResponses}</p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-[#6b7280] font-medium">Overall survey status</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4a9b6e]" />
                          <span className="text-lg font-semibold text-[#4a9b6e]">Open</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-[#6b7280] font-medium flex items-center gap-1">
                          Notifications
                          <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </p>
                        <p className="text-base font-medium text-[#282a2e] mt-2">Only you</p>
                        <button type="button" className="text-sm text-[#2563eb] hover:underline mt-1">Edit</button>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-[#f9fafb] border-t border-[#e5e7e9] text-sm text-[#3d4146] flex items-center justify-between">
                      <span>
                        Boost your survey response rate with a custom subdomain like{" "}
                        <strong>https://customdomain.surveymonkey.com/r/your_custom_ending</strong>
                      </span>
                      <a href="#" className="text-[#2563eb] hover:underline flex items-center gap-1 shrink-0 ml-4">
                        Get a demo
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* Collectors */}
                  <div className="bg-white rounded-xl border border-[#e5e7e9] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#e5e7e9]">
                      <h2 className="text-lg font-bold text-[#282a2e]">Collectors</h2>
                    </div>
                    {collectors.length > 0 ? (
                      <div className="divide-y divide-[#e5e7e9]">
                        {collectors.map((c, ci) => (
                          <div key={ci} className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#4a9b6e] text-white">Open</span>
                              <div>
                                <p className="text-sm font-semibold text-[#2563eb]">{c.collector_name}</p>
                                <p className="text-xs text-[#6b7280] mt-0.5">
                                  Created: {c.date_modified}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#282a2e]">{c.responses}</p>
                              <p className="text-xs text-[#6b7280]">Response{c.responses !== 1 ? "s" : ""} collected</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-8 text-center text-sm text-[#6b7280]">
                        No collectors yet.{" "}
                        <button type="button" onClick={() => router.push("/collect-responses")} className="text-[#2563eb] hover:underline">
                          Go to Collect
                        </button>{" "}
                        to create one.
                      </div>
                    )}
                  </div>

                  {/* Responses volume */}
                  <div className="bg-white rounded-xl border border-[#e5e7e9] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#e5e7e9]">
                      <h2 className="text-lg font-bold text-[#282a2e]">Responses volume</h2>
                    </div>
                    <div className="px-5 py-12 text-center">
                      {totalResponses > 0 ? (
                        <div>
                          <p className="text-4xl font-bold text-[#4a9b6e]">{totalResponses}</p>
                          <p className="text-sm text-[#6b7280] mt-2">total responses collected</p>
                          <button
                            type="button"
                            onClick={() => router.push("/analyze-results")}
                            className="mt-4 px-4 py-2 rounded-lg bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95"
                          >
                            View results
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-[#6b7280]">No survey responses yet</p>
                          <button type="button" className="text-sm text-[#2563eb] hover:underline mt-1">What is this?</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#282a2e] text-center">Delete this survey?</h3>
              <p className="text-sm text-[#6b7280] text-center mt-2">
                This will permanently delete <strong>{survey?.title}</strong> and all its data. This cannot be undone.
              </p>
            </div>
            <div className="flex border-t border-[#e5e7e9]">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3 text-sm font-medium text-[#3d4146] hover:bg-[#f9fafb] border-r border-[#e5e7e9] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSurvey}
                disabled={deleting}
                className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30" style={{ writingMode: "vertical-rl" as const }}>
        <button type="button" className="py-2 px-2 bg-[#4a4d52] text-white text-xs font-medium rounded-l-md shadow-md hover:bg-[#374151]">
          Feedback!
        </button>
      </div>
    </div>
  );
}
