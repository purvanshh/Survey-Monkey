"use client";

import QuestionBlock from "./QuestionBlock";
import { STANDARD_THEMES, DEFAULT_THEME_ID, type ThemeId } from "@/constants/themes";

interface SurveyCanvasProps {
  surveyName?: string;
  onSurveyNameChange?: (name: string) => void;
  themeId?: ThemeId;
}

export default function SurveyCanvas({ surveyName = "Untitled", onSurveyNameChange, themeId = DEFAULT_THEME_ID }: SurveyCanvasProps) {
  const theme = STANDARD_THEMES.find((t) => t.id === themeId) ?? STANDARD_THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
  const canvasClass = theme.canvasClass;

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
                    <div className="addContentCTAWrapper mb-4" data-position="1" title="Add content">
                      <button
                        type="button"
                        className="add-content-cta w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-[rgba(0,0,0,0.05)] flex items-center justify-center text-[#4a4d52]"
                        title="Add content"
                        aria-label="Add content"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <div className="question-row clearfix mb-6">
                      <div className="question-container" data-question-type="single_choice_vertical">
                        <QuestionBlock />
                      </div>
                    </div>

                    <div className="add-content-btn zero-state-hide mb-4">
                      <button
                        type="button"
                        className="text-sm text-[#007BFF] hover:underline font-medium"
                      >
                        Add content
                      </button>
                    </div>

                    <p className="add-bulk-questions zero-state-show text-center mt-6 mb-0">
                      <button
                        type="button"
                        className="text-sm text-[#007BFF] hover:underline font-medium"
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
