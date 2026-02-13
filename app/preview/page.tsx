"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PREVIEW_STORAGE_KEY = "survey-preview-data";

interface PreviewQuestion {
  id: string;
  text: string;
  type: string;
  answerChoices?: string[];
}

interface PreviewData {
  surveyName: string;
  questions: PreviewQuestion[];
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PreviewData>;
        setData({
          surveyName: parsed.surveyName ?? "Untitled",
          questions: Array.isArray(parsed.questions) ? parsed.questions : [],
        });
      } else {
        setData({ surveyName: "Untitled", questions: [] });
      }
    } catch {
      setData({ surveyName: "Untitled", questions: [] });
    }
  }, []);

  if (data === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[#6b7280]">Loading preview...</p>
      </div>
    );
  }

  const { surveyName, questions } = data;
  const savedQuestions = questions.filter((q) => q.text?.trim());

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center px-6 py-12 md:py-16">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Survey title - green, centered */}
          <h1 className="text-2xl md:text-3xl font-bold text-[#4a9b6e] text-center mb-10 md:mb-12">
            {surveyName || "Untitled"}
          </h1>

          {savedQuestions.length === 0 ? (
            <p className="text-center text-[#6b7280] text-sm">No questions yet. Add and save questions in the survey builder.</p>
          ) : (
            <>
              {/* Questions - centered content block */}
              <div className="w-full max-w-xl space-y-8">
                {savedQuestions.map((q, index) => (
                  <div key={q.id} className="flex flex-col items-center">
                    <p className="w-full text-base md:text-lg font-medium text-[#282a2e] mb-4 text-left">
                      {index + 1}. {q.text}
                    </p>
                    {(q.type === "Multiple choice" || q.type === "Checkboxes") && q.answerChoices?.length ? (
                      <ul className="w-full space-y-2">
                        {q.answerChoices.map((choice, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {q.type === "Checkboxes" ? (
                              <span className="w-4 h-4 rounded border-2 border-[#d1d5da] bg-white shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border-2 border-[#d1d5da] bg-white shrink-0" />
                            )}
                            <span className="text-sm md:text-base text-[#3d4146]">{choice || "(Empty)"}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter your answer"
                        className="w-full py-3 px-4 text-base border border-[#d1d5da] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#4a9b6e] focus:border-[#4a9b6e] placeholder:text-[#9ca3af] text-[#282a2e]"
                      />
                    )}
                  </div>
                ))}

                {/* Done button - green, centered */}
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    className="px-8 py-3 rounded-md bg-[#4a9b6e] text-white text-base font-medium hover:opacity-95 shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SurveyMonkey branding - centered, light grey */}
          <div className="mt-14 md:mt-20 text-center w-full max-w-xl">
            <p className="text-sm text-[#6b7280] mb-2">
              Powered by{" "}
              <span className="inline-flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#4a9b6e] flex items-center justify-center inline-flex">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <circle cx="8" cy="10" r="1.5" />
                    <circle cx="16" cy="10" r="1.5" />
                    <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
                  </svg>
                </span>
                <a
                  href="https://www.surveymonkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4a9b6e] font-semibold hover:underline"
                >
                  SurveyMonkey®
                </a>
              </span>
            </p>
            <p className="text-sm text-[#6b7280] mb-4">
              See how easy it is to create{" "}
              <a href="https://www.surveymonkey.com" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] underline hover:opacity-80">surveys</a>
              {" "}and{" "}
              <a href="https://www.surveymonkey.com" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] underline hover:opacity-80">forms</a>.
            </p>
            <Link href="#" className="text-sm text-[#6b7280] hover:underline">
              Privacy &amp; Cookie Notice
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
