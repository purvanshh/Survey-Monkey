"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ApiCollector } from "@/types/survey";

interface CollectorsDashboardProps {
    collectors: ApiCollector[];
    totalResponses: number;
    onRefresh?: () => void;
}

export default function CollectorsDashboard({
    collectors,
    totalResponses,
    onRefresh,
}: CollectorsDashboardProps) {
    return (
        <div className="space-y-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-[#282a2e] leading-tight">
                        Survey collectors
                    </h1>
                    <p className="text-base text-[#6b7280] mt-1">
                        {totalResponses === 0
                            ? "0 responses"
                            : totalResponses === 1
                                ? "1 response"
                                : `${totalResponses} responses`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#e5a100] bg-[#e5a100] text-white text-sm font-semibold hover:bg-[#cc9000] transition-colors"
                    >
                        Manage notifications
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#e5a100] bg-[#e5a100] text-white text-sm font-semibold hover:bg-[#cc9000] transition-colors"
                    >
                        Choose an audience
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d32f2f] text-white text-sm font-semibold hover:bg-[#b71c1c] transition-colors"
                    >
                        Add new collector
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-6">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_120px_120px_140px_48px] items-center px-5 py-3.5 bg-[#fafafa] border-b border-gray-200 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1">
                        Collector name
                        <svg className="w-3.5 h-3.5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1">
                        Status
                        <svg className="w-3.5 h-3.5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1">
                        Responses
                        <svg className="w-3.5 h-3.5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1">
                        Date modified
                        <svg className="w-3.5 h-3.5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div />
                </div>

                {/* Collector rows */}
                {collectors.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-[#6b7280]">
                        No collectors yet. Click &quot;Add new collector&quot; to get started.
                    </div>
                ) : (
                    collectors.map((c, idx) => (
                        <CollectorRow key={idx} collector={c} />
                    ))
                )}
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-center gap-4 mt-5 text-sm text-[#6b7280]">
                <span>
                    Showing 1 – {collectors.length} of {collectors.length}
                </span>
                <div className="flex items-center gap-2">
                    <select className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white">
                        <option>10 per page</option>
                        <option>25 per page</option>
                        <option>50 per page</option>
                    </select>
                    <select className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white">
                        <option>Page 1</option>
                    </select>
                    <div className="flex items-center gap-1 ml-2">
                        <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50" disabled>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                        <select className="border border-gray-300 rounded px-2.5 py-1.5 text-sm text-[#3d4146] bg-white">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                        <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <div className="text-xs text-[#6b7280] leading-relaxed">
                    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <a href="#" className="hover:underline">About SurveyMonkey</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Careers</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Developers</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Privacy Notice</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">California Privacy Notice</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Email Opt-In</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Help</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <a href="#" className="hover:underline">Cookies Notice</a>
                        <span className="text-[#d1d5da]">&bull;</span>
                        <span>Copyright &copy; 1999-2026 SurveyMonkey</span>
                    </span>
                </div>
            </footer>
        </div>
    );
}

/* ================================================================== */
/*  Collector row sub-component                                        */
/* ================================================================== */

const MENU_ITEMS = [
    { label: "Close collector", hasHelp: true },
    { label: "Edit collector", hasHelp: false },
    { label: "Rename collector", hasHelp: false },
    { label: "Delete collector", hasHelp: true },
    { label: "Delete all responses", hasHelp: true },
];

function CollectorRow({ collector }: { collector: ApiCollector }) {
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(collector.share_url);
            setCopyStatus("copied");
            setTimeout(() => setCopyStatus("idle"), 2000);
        } catch {
            setCopyStatus("idle");
        }
    }, [collector.share_url]);

    const handleOpen = useCallback(() => {
        window.open(collector.share_url, "_blank");
    }, [collector.share_url]);

    return (
        <div className="grid grid-cols-[40px_1fr_120px_120px_140px_48px] items-center px-5 py-4 border-b border-gray-100 hover:bg-[#fafbfc] transition-colors group">
            {/* Link icon */}
            <div className="flex items-center">
                <svg className="w-5 h-5 text-[#e5a100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </div>

            {/* Collector name + URL + actions */}
            <div className="min-w-0">
                <a href="#" className="text-sm font-semibold text-[#007c89] hover:underline">
                    {collector.collector_name}
                </a>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#6b7280] truncate max-w-[280px]">
                        {collector.share_url}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center px-2.5 py-1 rounded border border-[#e5a100] text-[#e5a100] text-xs font-semibold hover:bg-[#fffbea] transition-colors shrink-0"
                    >
                        {copyStatus === "copied" ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                        onClick={handleOpen}
                        className="inline-flex items-center px-2.5 py-1 rounded border border-gray-300 text-[#6b7280] text-xs font-medium hover:bg-gray-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    >
                        Open
                    </button>
                </div>
                <p className="text-xs text-[#9ca3af] mt-1">
                    Created {collector.date_modified}
                </p>
            </div>

            {/* Status */}
            <div>
                <span className="inline-block px-3 py-1 rounded text-xs font-bold bg-[#e0f7e9] text-[#007c3a]">
                    {collector.status}
                </span>
            </div>

            {/* Responses */}
            <div className="text-sm font-medium text-[#282a2e]">
                {collector.responses}
            </div>

            {/* Date modified */}
            <div className="text-sm text-[#6b7280]">{collector.date_modified}</div>

            {/* More actions dropdown */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b7280] hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                    </svg>
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1.5 overflow-hidden">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#3d4146] hover:bg-[#f9fafb] transition-colors text-left"
                            >
                                <span>{item.label}</span>
                                {item.hasHelp && (
                                    <svg className="w-4 h-4 text-[#9ca3af] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
