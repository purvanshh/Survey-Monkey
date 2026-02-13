"use client";

import { useRouter } from "next/navigation";

const SURVEY_ID_KEY = "current-survey-id";

export default function TopNavbar() {
  const router = useRouter();

  const handleCreateSurvey = () => {
    // Clear old survey so the builder creates a fresh one
    localStorage.removeItem(SURVEY_ID_KEY);
    router.push("/survey-builder");
  };

  return (
    <header className="h-14 min-h-[56px] bg-[#2d3238] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-6">
        <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center shrink-0" aria-hidden>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="9" cy="10" r="1.25" fill="currentColor" />
            <circle cx="15" cy="10" r="1.25" fill="currentColor" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          </svg>
        </div>
        <nav className="flex items-center gap-5">
          <a href="#" className="text-[#b0b4b8] text-sm font-medium hover:text-white">Home</a>
          <a href="#" className="text-[#b0b4b8] text-sm font-medium hover:text-white">Plans & Pricing</a>
          <a href="#" className="text-[#b0b4b8] text-sm font-medium hover:text-white">Multi-survey Analysis</a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="h-8 px-3 rounded bg-[#f0c14b] text-[#1e1e1e] text-sm font-medium hover:opacity-92">
          Upgrade
        </button>
        <button type="button" onClick={handleCreateSurvey} className="h-8 px-3 rounded bg-white text-[#4a4d52] text-sm font-medium border border-[#c8cbce] hover:bg-gray-50">
          Create survey
        </button>
        <button type="button" className="p-1.5 text-[#b0b4b8] hover:text-white" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <button type="button" className="p-1.5 text-[#b0b4b8] hover:text-white" aria-label="Help">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#5a9b7a] flex items-center justify-center text-white text-xs font-semibold">
          PU
        </div>
      </div>
    </header>
  );
}
