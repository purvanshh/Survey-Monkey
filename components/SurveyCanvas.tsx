"use client";

import QuestionBlock from "./QuestionBlock";

export default function SurveyCanvas() {
  return (
    <div className="flex-1 min-w-0 flex flex-col bg-[#f5f6f7]">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <button type="button" className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#ebebeb] border border-gray-300 text-[#4a4d52] text-sm hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Upgrade to add a logo
              </button>
              <h1 className="text-2xl font-bold text-[#3aa666] text-center mt-6">Untitled</h1>
            </div>

            <div className="p-6">
              <QuestionBlock />
              <div className="text-center mt-6">
                <button type="button" className="text-sm text-[#007BFF] hover:underline">
                  Copy and paste questions
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 py-8 px-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-xs text-gray-500">Powered by</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3aa666] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor" aria-hidden>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      <circle cx="8" cy="10" r="1.5" />
                      <circle cx="16" cy="10" r="1.5" />
                      <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-[#3aa666]">SurveyMonkey</span>
                </div>
                <p className="text-xs text-gray-500">
                  See how easy it is to{" "}
                  <a href="#" className="text-[#007BFF] hover:underline">create surveys</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#007BFF] hover:underline">forms</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
