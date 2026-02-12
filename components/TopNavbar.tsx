"use client";

export default function TopNavbar() {
  return (
    <header className="h-[60px] bg-[#282a2e] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-8">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#282a2e]" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <circle cx="8" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
            <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
          </svg>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-white text-sm font-medium hover:opacity-90">Home</a>
          <a href="#" className="text-white text-sm font-medium hover:opacity-90">Plans & Pricing</a>
          <a href="#" className="text-white text-sm font-medium hover:opacity-90">Multi-survey Analysis</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="px-4 py-2 rounded-md bg-[#fcc107] text-[#282a2e] text-sm font-medium hover:opacity-95">
          Upgrade
        </button>
        <button type="button" className="px-4 py-2 rounded-md bg-[#00B36B] text-white text-sm font-medium hover:opacity-95">
          Create survey
        </button>
        <button type="button" className="p-2 text-white/90 hover:text-white" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <button type="button" className="p-2 text-white/90 hover:text-white" aria-label="Help">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-[#3aa666] flex items-center justify-center text-white text-sm font-medium">
          PU
        </div>
      </div>
    </header>
  );
}
