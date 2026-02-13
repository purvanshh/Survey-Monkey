"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getSurvey,
  getResponses,
  deleteSurvey,
  getResponseCount,
} from "@/lib/surveyApi";
import type {
  ApiSurvey,
  ApiResponseEntry,
  ApiQuestion,
} from "@/types/survey";

const SURVEY_ID_KEY = "current-survey-id";

/** Resolve answer display text for a given answer object */
function resolveAnswerText(
  answer: ApiResponseEntry["answers"][number],
  question: ApiQuestion | undefined
): string {
  if (answer.answer_text) return answer.answer_text;

  if (answer.selected_option_id && question) {
    const opt = question.options.find((o) => o.id === answer.selected_option_id);
    if (opt) return opt.label;
  }

  if (answer.value_json) {
    if (Array.isArray(answer.value_json)) {
      // Checkbox: array of option IDs
      if (question) {
        const labels = (answer.value_json as string[])
          .map((id) => question.options.find((o) => o.id === id)?.label ?? id)
          .filter(Boolean);
        if (labels.length) return labels.join(", ");
      }
      return (answer.value_json as string[]).join(", ");
    }
    return JSON.stringify(answer.value_json);
  }

  return "—";
}

export default function AnalyzeResultsPage() {
  const router = useRouter();
  const [survey, setSurvey] = useState<ApiSurvey | null>(null);
  const [responses, setResponses] = useState<ApiResponseEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const surveyIdRef = useRef<string | null>(null);

  // ---------------------------------------------------------------
  // Load survey + responses
  // ---------------------------------------------------------------
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

        const [surveyData, responseData] = await Promise.all([
          getSurvey(surveyId),
          getResponses(surveyId),
        ]);

        if (cancelled) return;
        setSurvey(surveyData);
        setResponses(responseData.responses);
        setTotalCount(responseData.total);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load results:", err);
          setError("Failed to load survey results.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  // ---------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------
  const handleRefresh = useCallback(async () => {
    const sid = surveyIdRef.current;
    if (!sid) return;
    try {
      const [responseData, countData] = await Promise.all([
        getResponses(sid),
        getResponseCount(sid),
      ]);
      setResponses(responseData.responses);
      setTotalCount(countData.count);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, []);

  // ---------------------------------------------------------------
  // Delete survey
  // ---------------------------------------------------------------
  const handleDeleteSurvey = useCallback(async () => {
    const sid = surveyIdRef.current;
    if (!sid) return;
    setDeleting(true);
    try {
      await deleteSurvey(sid);
      localStorage.removeItem(SURVEY_ID_KEY);
      router.push("/survey-builder");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete survey. Please try again.");
      setDeleting(false);
    }
  }, [router]);

  // Build a question lookup map
  const questionMap = new Map<string, ApiQuestion>();
  if (survey) {
    for (const q of survey.questions) {
      questionMap.set(q.id, q);
    }
  }

  const sortedQuestions = survey
    ? [...survey.questions].sort((a, b) => a.order_index - b.order_index)
    : [];

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <WorkflowStepper activeStep={4} />

      <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#f5f6f7]">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-[#6b7280]">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Loading results...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                {error}
              </div>
            ) : (
              <>
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl font-bold text-[#282a2e]">{survey?.title ?? "Survey Results"}</h1>
                    <p className="text-sm text-[#6b7280] mt-1">
                      {totalCount} {totalCount === 1 ? "response" : "responses"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="h-9 px-4 rounded-lg border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="h-9 px-4 rounded-lg border border-red-300 bg-white text-red-600 text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete survey
                    </button>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-5">
                    <p className="text-sm text-[#6b7280] font-medium">Total Responses</p>
                    <p className="text-3xl font-bold text-[#282a2e] mt-1">{totalCount}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-5">
                    <p className="text-sm text-[#6b7280] font-medium">Questions</p>
                    <p className="text-3xl font-bold text-[#282a2e] mt-1">{sortedQuestions.length}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-5">
                    <p className="text-sm text-[#6b7280] font-medium">Completion Rate</p>
                    <p className="text-3xl font-bold text-[#4a9b6e] mt-1">
                      {totalCount > 0 ? "100%" : "—"}
                    </p>
                  </div>
                </div>

                {/* No responses */}
                {responses.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#e5e7e9] p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#f2f3f5] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h2 className="text-lg font-semibold text-[#282a2e]">No responses yet</h2>
                    <p className="text-sm text-[#6b7280] mt-2">Share your survey link to start collecting responses.</p>
                  </div>
                ) : (
                  <>
                    {/* Question-by-question summary */}
                    <div className="space-y-4 mb-8">
                      <h2 className="text-base font-semibold text-[#282a2e]">Question Summary</h2>
                      {sortedQuestions.map((q, qi) => {
                        const answersForQ = responses.flatMap((r) =>
                          r.answers.filter((a) => a.question_id === q.id)
                        );
                        const isChoice = q.type === "multiple_choice" || q.type === "checkbox";
                        return (
                          <div key={q.id} className="bg-white rounded-xl border border-[#e5e7e9] overflow-hidden">
                            <div className="px-5 py-4 border-b border-[#e5e7e9] bg-[#fafafa]">
                              <p className="text-sm font-semibold text-[#282a2e]">
                                <span className="text-[#6b7280] mr-1">Q{qi + 1}.</span>
                                {q.title}
                              </p>
                              <p className="text-xs text-[#9ca3af] mt-0.5">{answersForQ.length} answers</p>
                            </div>
                            <div className="p-5">
                              {isChoice && q.options.length > 0 ? (
                                <div className="space-y-2.5">
                                  {q.options
                                    .sort((a, b) => a.order_index - b.order_index)
                                    .map((opt) => {
                                      const count = answersForQ.filter((a) => {
                                        if (a.selected_option_id === opt.id) return true;
                                        if (Array.isArray(a.value_json) && (a.value_json as string[]).includes(opt.id)) return true;
                                        return false;
                                      }).length;
                                      const pct = answersForQ.length > 0 ? Math.round((count / answersForQ.length) * 100) : 0;
                                      return (
                                        <div key={opt.id}>
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-[#3d4146]">{opt.label}</span>
                                            <span className="text-xs font-medium text-[#6b7280]">
                                              {count} ({pct}%)
                                            </span>
                                          </div>
                                          <div className="h-2.5 bg-[#f2f3f5] rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-[#4a9b6e] rounded-full transition-all"
                                              style={{ width: `${pct}%` }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {answersForQ.length > 0 ? (
                                    answersForQ.map((a, ai) => (
                                      <div key={ai} className="py-2 px-3 bg-[#f9fafb] rounded-lg text-sm text-[#3d4146] border border-[#e5e7e9]">
                                        {a.answer_text || "—"}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-[#9ca3af]">No answers for this question.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Individual response table */}
                    <div className="bg-white rounded-xl border border-[#e5e7e9] overflow-hidden">
                      <div className="px-5 py-4 border-b border-[#e5e7e9] flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[#282a2e]">Individual Responses</h2>
                        <span className="text-xs text-[#6b7280]">{responses.length} total</span>
                      </div>
                      <div className="divide-y divide-[#e5e7e9]">
                        {responses.map((resp, ri) => (
                          <div key={resp.id}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedResponse(selectedResponse === resp.id ? null : resp.id)
                              }
                              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f9fafb] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#4a9b6e] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                                  {ri + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#282a2e]">
                                    Response #{ri + 1}
                                  </p>
                                  <p className="text-xs text-[#9ca3af]">
                                    {new Date(resp.submitted_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <svg
                                className={`w-4 h-4 text-[#6b7280] transition-transform ${selectedResponse === resp.id ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {selectedResponse === resp.id && (
                              <div className="px-5 pb-4 space-y-3 bg-[#fafafa]">
                                {sortedQuestions.map((q, qi) => {
                                  const answer = resp.answers.find((a) => a.question_id === q.id);
                                  return (
                                    <div key={q.id} className="py-2">
                                      <p className="text-xs font-medium text-[#6b7280] mb-1">
                                        Q{qi + 1}. {q.title}
                                      </p>
                                      <p className="text-sm text-[#282a2e]">
                                        {answer ? resolveAnswerText(answer, q) : "—"}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
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
                This will permanently delete <strong>{survey?.title}</strong> and all its questions, responses, and data. This action cannot be undone.
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

      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30"
        style={{ writingMode: "vertical-rl" }}
      >
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
