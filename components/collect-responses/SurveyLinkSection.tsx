"use client";

import { useState, useCallback } from "react";

const MOCK_SURVEY_LINK = "https://www.surveymonkey.com/r/L6C6XCL";

interface SurveyLinkSectionProps {
  surveyLink?: string;
  onLinkChange?: (link: string) => void;
}

export default function SurveyLinkSection({
  surveyLink = MOCK_SURVEY_LINK,
  onLinkChange,
}: SurveyLinkSectionProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(surveyLink);
      setCopyStatus("copied");
      if (onLinkChange) onLinkChange(surveyLink);
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("idle");
    }
  }, [surveyLink, onLinkChange]);

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-[#282a2e]">
        Survey published! Here&apos;s your link:
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={surveyLink}
          className="flex-1 min-w-0 px-4 py-3 text-sm text-[#4a4d52] bg-[#f0f0f0] border border-gray-200 rounded-lg focus:outline-none"
          aria-label="Survey link"
        />
        <button
          type="button"
          className="px-4 py-2.5 rounded-lg bg-white text-[#282a2e] text-sm font-medium border border-gray-300 hover:bg-gray-50 shrink-0"
        >
          Settings
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="relative px-4 py-2.5 rounded-lg bg-[#3aa666] text-white text-sm font-medium hover:opacity-95 shrink-0"
        >
          {copyStatus === "copied" ? "Copied!" : "Copy"}
          {copyStatus === "copied" && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#282a2e] text-white text-xs rounded whitespace-nowrap">
              Link copied
            </span>
          )}
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <a href="#" className="w-10 h-10 rounded-lg bg-[#1877f2] flex items-center justify-center text-white shrink-0" aria-label="Share on Facebook">
          <span className="text-lg font-bold">f</span>
        </a>
        <a href="#" className="w-10 h-10 rounded-lg bg-[#0a66c2] flex items-center justify-center text-white shrink-0" aria-label="Share on LinkedIn">
          <span className="text-xs font-bold">in</span>
        </a>
        <a href="#" className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white shrink-0" aria-label="Share on X">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
        </a>
        <a href="#" className="w-10 h-10 rounded-lg bg-[#25d366] flex items-center justify-center text-white shrink-0" aria-label="Share on WhatsApp">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        </a>
        <a href="#" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#7c3aed] shrink-0" aria-label="More share options">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
        </a>
        <a href="#" className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#4a4d52] shrink-0" aria-label="QR or more options">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </a>
      </div>
    </div>
  );
}
