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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <p className="text-[#6b7280]">Loading preview...</p>
      </div>
    );
  }

  const { surveyName, questions } = data;
  const savedQuestions = questions.filter((q) => q.text?.trim());

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#3d4146] text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#4a9b6e] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <circle cx="8" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
              <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
            </svg>
          </span>
          <span className="font-semibold text-lg">{surveyName || "Untitled"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="p-2 rounded hover:bg-white/10" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button type="button" className="p-2 rounded hover:bg-white/10" aria-label="Chat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
          <button type="button" className="px-3 py-1.5 rounded text-sm font-medium bg-white/10 hover:bg-white/20">
            Share
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 border-r border-[#e5e7e9] bg-white shrink-0 hidden md:block">
          <div className="p-4 border-b border-[#e5e7e9]">
            <h2 className="text-sm font-semibold text-[#3d4146]">Survey overview</h2>
          </div>
          <div className="p-3">
            <button type="button" className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#3d4146] bg-white border border-[#d1d5da] rounded-lg hover:bg-[#f9fafb]">
              Showing all pages
              <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="px-3 pb-4">
            <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-2">Page 1</p>
            <ul className="space-y-1">
              {savedQuestions.map((q, i) => (
                <li key={q.id} className="text-sm text-[#4a9b6e] flex items-center gap-1.5">
                  <span className="text-[#6b7280]">&gt;</span>
                  Q{i + 1}: {q.text.length > 30 ? `${q.text.slice(0, 30)}...` : q.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-8 md:p-10">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#4a9b6e] text-center mb-8">
              {surveyName || "Untitled"}
            </h1>

            {savedQuestions.length === 0 ? (
              <p className="text-center text-[#6b7280]">No questions yet. Add and save questions in the survey builder.</p>
            ) : (
              <div className="space-y-8">
                {savedQuestions.map((q, index) => (
                  <div key={q.id}>
                    <p className="text-base font-medium text-[#282a2e] mb-3">
                      {index + 1}. {q.text}
                    </p>
                    {(q.type === "Multiple choice" || q.type === "Checkboxes") && q.answerChoices?.length ? (
                      <ul className="space-y-2">
                        {q.answerChoices.map((choice, i) => (
                          <li key={i} className="flex items-center gap-2">
                            {q.type === "Checkboxes" ? (
                              <span className="w-4 h-4 rounded border-2 border-[#d1d5da] bg-white shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border-2 border-[#d1d5da] bg-white shrink-0" />
                            )}
                            <span className="text-sm text-[#3d4146]">{choice || "(Empty)"}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter your answer"
                        className="w-full py-2.5 px-3 text-base border border-[#d1d5da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:border-[#4a9b6e] placeholder:text-[#9ca3af]"
                      />
                    )}
                  </div>
                ))}

                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Powered by{" "}
                <a
                  href="https://www.surveymonkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4a9b6e] font-semibold hover:underline"
                >
                  SurveyMonkey®
                </a>
              </p>
              <p className="text-xs text-gray-500">
                See how easy it is to{" "}
                <a href="https://www.surveymonkey.com" className="text-[#2563eb] hover:underline">create surveys</a>
                {" "}and{" "}
                <a href="https://www.surveymonkey.com" className="text-[#2563eb] hover:underline">forms</a>.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                <Link href="#" className="text-[#2563eb] hover:underline">Privacy &amp; Cookie Notice</Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-[#e5e7e9] bg-[#f9fafb] px-6 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4a9b6e] text-white text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Ready to send
          </span>
          <span className="text-sm text-[#6b7280]">
            86% of respondents will finish. It&apos;ll take about <span className="text-[#2563eb] font-medium">1 minute</span>.{" "}
            <button type="button" className="text-[#2563eb] hover:underline">View tips</button>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/survey-builder"
            className="px-4 py-2 rounded-md border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb]"
          >
            Edit survey
          </Link>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95"
          >
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
