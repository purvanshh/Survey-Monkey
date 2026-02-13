"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import Sidebar from "@/components/Sidebar";
import SurveyCanvas from "@/components/SurveyCanvas";
import ActionButtons from "@/components/ActionButtons";
import { DEFAULT_THEME_ID, type ThemeId } from "@/constants/themes";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SurveyQuestion } from "@/types/survey";

const DEFAULT_SURVEY_NAME = "Untitled";
const PREVIEW_STORAGE_KEY = "survey-preview-data";

function setPreviewData(surveyName: string, questions: SurveyQuestion[]) {
  if (typeof window === "undefined") return;
  const payload = {
    surveyName,
    questions: questions
      .filter((q) => q.savedData?.text?.trim())
      .map((q) => ({ id: q.id, ...q.savedData })),
  };
  window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

const DESIGN_TABS = [
  { id: "build", label: "Build", icon: "plus" },
  { id: "style", label: "Style", icon: "pen" },
  { id: "logic", label: "Logic", icon: "nodes" },
  { id: "question-bank", label: "Question bank", icon: "folder" },
] as const;

export default function SurveyBuilderPage() {
  const [surveyName, setSurveyName] = useState(DEFAULT_SURVEY_NAME);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([{ id: "1", savedData: null }]);
  const [activeTab, setActiveTab] = useState<string>("style");
  const [stylePanelOpen, setStylePanelOpen] = useState(true);
  const [buildPanelOpen, setBuildPanelOpen] = useState(false);
  const [questionBankPanelOpen, setQuestionBankPanelOpen] = useState(false);
  const [logicPanelOpen, setLogicPanelOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);
  const router = useRouter();

  const handlePreview = useCallback(() => {
    if (typeof window === "undefined") return;
    setPreviewData(surveyName, questions);
    const newWindow = window.open("/preview", "_blank", "noopener,noreferrer");
    if (!newWindow) {
      router.push("/preview");
    }
  }, [surveyName, questions, router]);

  const handleDesignTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setBuildPanelOpen(tabId === "build");
    setQuestionBankPanelOpen(tabId === "question-bank");
    setLogicPanelOpen(tabId === "logic");
    setStylePanelOpen(tabId === "style");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <div className="bg-white border-b border-[#e5e7e9] px-6 py-2.5 shrink-0">
        <div className="flex items-center justify-between gap-3 min-h-[32px]">
          <input
            type="text"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
            placeholder={DEFAULT_SURVEY_NAME}
            className="text-lg font-semibold text-[#3d4146] bg-transparent border-none outline-none focus:ring-0 p-0 min-w-0 flex-1 placeholder:text-[#9ca3af] h-8 leading-8"
            aria-label="Survey name"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" className="w-8 h-8 rounded-[6px] border border-[#d1d5da] bg-white flex items-center justify-center hover:bg-[#f9fafb] shrink-0 text-[#6b7280]" aria-label="Comments">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
            <button type="button" className="flex items-center gap-1.5 h-8 rounded-[6px] border border-[#d1d5da] bg-white hover:bg-[#f9fafb] shrink-0 pl-2 pr-2.5 text-[#3d4146] text-sm font-medium" aria-label="Share">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </button>
            <button type="button" className="w-8 h-8 rounded-[6px] border border-[#d1d5da] bg-white flex items-center justify-center hover:bg-[#f9fafb] shrink-0 text-[#6b7280]" aria-label="Collaborate">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>
          </div>
        </div>
      </div>
      <WorkflowStepper onPreviewClick={handlePreview} />
      <div className="bg-white border-b border-[#e5e7e9] px-6 py-0 flex items-center justify-between gap-2 flex-nowrap min-h-[40px]">
        <div className="flex items-center gap-0 flex-1 min-w-0">
          {DESIGN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleDesignTabClick(tab.id)}
              className={`flex items-center gap-1 py-2.5 px-2.5 text-xs font-medium shrink-0 border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "text-[#4a9b6e] border-[#4a9b6e] bg-[#f8faf8]"
                  : "text-[#6b7280] border-transparent hover:bg-[#f2f3f5] hover:text-[#3d4146]"
              }`}
            >
              {tab.icon === "plus" && <span className="text-sm leading-none">+</span>}
              {tab.icon === "pen" && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              )}
              {tab.icon === "nodes" && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
              {tab.icon === "folder" && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              )}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-nowrap shrink-0 py-1.5">
          <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb] shrink-0">
            <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Options
          </button>
          <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb] shrink-0">
            <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Format
          </button>
          <button type="button" className="h-8 w-8 rounded-[6px] border border-[#d1d5da] bg-white text-[#6b7280] hover:bg-[#f9fafb] flex items-center justify-center shrink-0" aria-label="Delete">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          <button type="button" className="h-8 w-8 rounded-[6px] border border-[#d1d5da] bg-white text-[#6b7280] hover:bg-[#f9fafb] flex items-center justify-center shrink-0" aria-label="Print">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 flex min-h-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleDesignTabClick}
          stylePanelOpen={stylePanelOpen}
          setStylePanelOpen={setStylePanelOpen}
          buildPanelOpen={buildPanelOpen}
          questionBankPanelOpen={questionBankPanelOpen}
          logicPanelOpen={logicPanelOpen}
          selectedThemeId={selectedThemeId}
          onThemeChange={setSelectedThemeId}
        />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <SurveyCanvas
            surveyName={surveyName}
            onSurveyNameChange={setSurveyName}
            themeId={selectedThemeId}
            questions={questions}
            onQuestionsChange={setQuestions}
          />
          <div className="bg-white border-t border-[#e5e7e9] px-6 py-2.5 flex items-center justify-between">
            <div className="flex-1" />
            <ActionButtons />
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={handlePreview}
                className="px-4 py-2.5 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95 flex items-center gap-2"
              >
                Preview survey
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
            </div>
          </div>
        </main>
      </div>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30" style={{ writingMode: "vertical-rl" }}>
        <button type="button" className="py-2 px-2 bg-[#4a4d52] text-white text-xs font-medium rounded-l-md shadow-md hover:bg-[#374151]">
          Feedback!
        </button>
      </div>
    </div>
  );
}
