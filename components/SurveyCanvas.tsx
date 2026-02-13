"use client";

import { useState, useRef, useEffect } from "react";
import QuestionBlock from "./QuestionBlock";
import { STANDARD_THEMES, DEFAULT_THEME_ID, type ThemeId } from "@/constants/themes";
import type { SurveyQuestion, SavedQuestionData } from "@/types/survey";

interface SurveyCanvasProps {
  surveyName?: string;
  onSurveyNameChange?: (name: string) => void;
  themeId?: ThemeId;
  questions?: SurveyQuestion[];
  onQuestionsChange?: (questions: SurveyQuestion[]) => void;
}

export default function SurveyCanvas({
  surveyName = "Untitled",
  onSurveyNameChange,
  themeId = DEFAULT_THEME_ID,
  questions: questionsProp = [],
  onQuestionsChange,
}: SurveyCanvasProps) {
  const theme = STANDARD_THEMES.find((t) => t.id === themeId) ?? STANDARD_THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
  const canvasClass = theme.canvasClass;
  const [addContentOpen, setAddContentOpen] = useState(false);
  const addContentRef = useRef<HTMLDivElement>(null);

  const questions = questionsProp.length > 0 ? questionsProp : [{ id: "1", savedData: null }];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addContentRef.current && !addContentRef.current.contains(e.target as Node)) {
        setAddContentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddQuestion = () => {
    setAddContentOpen(false);
    const newQuestion: SurveyQuestion = {
      id: crypto.randomUUID(),
      savedData: null,
    };
    onQuestionsChange?.([...questions, newQuestion]);
  };

  const handleSaveQuestion = (index: number, data: SavedQuestionData) => {
    const next = [...questions];
    if (next[index]) {
      next[index] = { ...next[index], savedData: data };
      onQuestionsChange?.(next);
    }
  };

  return (
    <div className={`flex-1 min-w-0 flex flex-col min-h-0 ${canvasClass}`} id="livePreview">
      <div className="flex-1 overflow-auto p-8 md:p-10">
        <div className="max-w-6xl mx-auto w-full min-h-full flex flex-col">
          <article
            className="survey-page rounded-xl shadow-md overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-[min(720px,calc(100vh-220px))]"
            data-layout="text-center"
          >
            <div
              className="theme-inner-wrapper flex-1 flex flex-col"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <div className="addLogoHere border-b border-gray-200 px-8 py-6">
                <button
                  type="button"
                  className="w-fit flex items-center justify-center gap-2 py-2 px-3 rounded border border-[#282a2e] bg-white text-[#282a2e] text-sm font-semibold hover:bg-gray-50 transition-colors"
                  title="Upgrade to add a logo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upgrade to add a logo
                </button>
              </div>

              <header className="survey-page-header" aria-hidden="true">
                <span className="sr-only">Survey header</span>
              </header>

              <section className="survey-page-body p-0 flex-1 flex flex-col">
                <div className="titles-container-wrapper px-8 pt-8">
                  <div className="survey-title-container flex justify-center">
                    <input
                      type="text"
                      value={surveyName}
                      onChange={(e) => onSurveyNameChange?.(e.target.value)}
                      placeholder="Untitled"
                      className="survey-title text-2xl font-bold text-[#4a9b6e] text-center notranslate bg-transparent border-none outline-none focus:ring-0 w-full max-w-2xl placeholder:text-[#4a9b6e]/60"
                      aria-label="Survey title"
                    />
                  </div>
                </div>

                <div className="questions-container px-8 flex-1 flex flex-col">
                  <div className="questions pt-10 pb-6">
                    {questions.map((q, index) => (
                      <div key={q.id} className="question-row clearfix mb-6">
                        <div className="question-container" data-question-type="single_choice_vertical">
                          <QuestionBlock
                            questionNumber={index + 1}
                            savedData={q.savedData}
                            onSave={(data) => handleSaveQuestion(index, data)}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center my-6" ref={addContentRef}>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setAddContentOpen(!addContentOpen)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add content
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {addContentOpen && (
                          <div className="absolute top-full left-0 mt-1 min-w-[220px] bg-white border border-[#e5e7e9] rounded-lg shadow-lg py-2 z-20">
                            <button
                              type="button"
                              onClick={handleAddQuestion}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3d4146] hover:bg-[#f9fafb]"
                            >
                              <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Question
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddContentOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3d4146] hover:bg-[#f9fafb]"
                            >
                              <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                              </svg>
                              Text
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddContentOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3d4146] hover:bg-[#f9fafb]"
                            >
                              <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy and paste questions
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-center mt-6 mb-0">
                      <button
                        type="button"
                        className="text-sm text-[#2563eb] hover:underline font-medium"
                      >
                        Copy and paste questions
                      </button>
                    </p>
                  </div>
                </div>

                <footer className="survey-footer upgrade border-t border-gray-200 mt-auto py-10 px-8">
                  <div className="footerVisible footerDisplay">
                    <div className="standard-footer text-center">
                      <p className="survey-footer-title text-xs text-gray-500 mb-1">
                        Powered by{" "}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.surveymonkey.com"
                          className="footer-brand-name survey-footer-link text-[#4a9b6e] font-semibold hover:underline"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-full bg-[#4a9b6e] flex items-center justify-center inline-flex">
                              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor" aria-hidden>
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                <circle cx="8" cy="10" r="1.5" />
                                <circle cx="16" cy="10" r="1.5" />
                                <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
                              </svg>
                            </span>
                            SurveyMonkey®
                          </span>
                        </a>
                      </p>
                      <p className="text-xs text-gray-500">
                        See how easy it is to{" "}
                        <a target="_blank" rel="noopener noreferrer" href="https://www.surveymonkey.com" className="survey-footer-link create-a-survey text-[#007BFF] hover:underline">
                          create surveys
                        </a>{" "}
                        and{" "}
                        <a target="_blank" rel="noopener noreferrer" href="https://www.surveymonkey.com" className="survey-footer-link create-a-form text-[#007BFF] hover:underline">
                          forms
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </footer>
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
