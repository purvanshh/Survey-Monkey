"use client";

import TopNavbar from "@/components/TopNavbar";
import WorkflowStepper from "@/components/WorkflowStepper";
import Sidebar from "@/components/Sidebar";
import SurveyCanvas from "@/components/SurveyCanvas";
import ActionButtons from "@/components/ActionButtons";
import { useState } from "react";

export default function SurveyBuilderPage() {
  const [pageLogicOpen, setPageLogicOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />
      <WorkflowStepper />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f5f6f7]">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-[#282a2e]">Untitled</h1>
              <div className="flex items-center gap-2">
                <button type="button" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 shrink-0" aria-label="Comments">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </button>
                <button type="button" className="flex items-center gap-2 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 shrink-0 pl-2 pr-3" aria-label="Share">
                  <svg className="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span className="text-sm text-[#282a2e] font-medium">Share</span>
                </button>
                <button type="button" className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 shrink-0" aria-label="Collaborate">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </button>
                <button type="button" className="ml-2 px-4 py-2 rounded-md bg-white text-[#4a4d52] text-sm font-medium border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                  Preview survey
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <button type="button" className="flex items-center gap-2 py-2 px-3 rounded border border-gray-200 hover:bg-gray-50 text-sm text-[#282a2e]">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Options
              </button>
              <button type="button" className="flex items-center gap-2 py-2 px-3 rounded border border-gray-200 hover:bg-gray-50 text-sm text-[#282a2e]">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Format
              </button>
              <button type="button" className="p-2 rounded border border-gray-200 hover:bg-gray-50" aria-label="Delete">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button type="button" className="p-2 rounded border border-gray-200 hover:bg-gray-50" aria-label="Print">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setPageLogicOpen(!pageLogicOpen); setMoreActionsOpen(false); }}
                  className="flex items-center gap-2 py-2 px-3 rounded bg-gray-100 border border-gray-200 text-sm text-[#282a2e] hover:bg-gray-200"
                >
                  Page logic
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {pageLogicOpen && (
                  <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[160px]">
                    <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Add logic</button>
                    <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Edit logic</button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setMoreActionsOpen(!moreActionsOpen); setPageLogicOpen(false); }}
                  className="flex items-center gap-2 py-2 px-3 rounded bg-gray-100 border border-gray-200 text-sm text-[#282a2e] hover:bg-gray-200"
                >
                  More actions
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {moreActionsOpen && (
                  <div className="absolute top-full left-0 mt-1 py-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[160px]">
                    <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Duplicate</button>
                    <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Move</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <SurveyCanvas />
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex-1" />
            <ActionButtons />
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                className="px-4 py-2.5 rounded-md bg-[#d3d3d3] text-white text-sm font-medium hover:bg-[#c0c0c0] flex items-center gap-2"
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
