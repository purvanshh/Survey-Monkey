"use client";

export default function BuyTargetedResponsesCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-[#f8f8f8] p-5 shadow-sm">
      <div className="flex justify-center mb-3">
        <svg className="w-12 h-12 text-[#14b8a6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <line x1="9" y1="11" x2="15" y2="11" />
          <line x1="12" y1="8" x2="12" y2="14" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-[#282a2e] text-center mb-2">
        Buy targeted responses
      </h3>
      <p className="text-sm text-[#6b7280] text-center leading-relaxed">
        Select the criteria of your ideal audience. We&apos;ll provide the respondents. Start getting data in minutes.
      </p>
    </div>
  );
}
