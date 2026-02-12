"use client";

import { useState } from "react";
import ThemeCard from "./ThemeCard";
import { QuestionTypeIcon } from "./QuestionTypeIcons";
import { QUESTION_TYPES } from "@/constants/questionTypes";

const SIDEBAR_TABS = [
  { id: "build", label: "Build", icon: "plus" },
  { id: "style", label: "Style", icon: "pen" },
  { id: "logic", label: "Logic", icon: "nodes" },
  { id: "question-bank", label: "Question bank", icon: "folder" },
] as const;

const QUESTION_BANK_CATEGORIES = [
  "Recommended Questions",
  "Previously Used Questions",
  "All Categories",
  "Community",
  "Customer Feedback",
  "Customer Satisfaction",
  "Demographics",
  "Education",
  "Events",
  "Healthcare",
  "Human Resources",
  "Industry Specific",
  "Just for Fun",
  "Market Research",
  "Non-Profit",
  "Political",
];

const LOGIC_FEATURES = [
  { label: "Page skip logic", icon: "headphone" },
  { label: "Page randomization", icon: "arrows" },
  { label: "Question randomization", icon: "arrows" },
  { label: "Block randomization", icon: "arrows" },
  { label: "Quota", icon: "check" },
  { label: "Custom variables", icon: "brackets" },
];

const THEMES = [
  { name: "Heritage", selected: true, thumbnail: "bg-gradient-to-br from-emerald-600 to-emerald-800", accessibility: true },
  { name: "Simple", selected: false, thumbnail: "bg-gray-100", accessibility: false },
  { name: "Full Color", selected: false, thumbnail: "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400", accessibility: false },
  { name: "Highrise", selected: false, thumbnail: "bg-gradient-to-b from-slate-600 to-slate-800", accessibility: false },
  { name: "Dewdrop", selected: false, thumbnail: "bg-gradient-to-br from-cyan-200 to-blue-300", accessibility: false },
  { name: "Pastel", selected: false, thumbnail: "bg-gradient-to-r from-pink-200 to-purple-200", accessibility: true },
  { name: "Arctic", selected: false, thumbnail: "bg-gradient-to-br from-sky-100 to-blue-100", accessibility: true },
];

const PRESET_SWATCHES = [
  ["#166534", "#22c55e", "#171717"],
  ["#1e3a8a", "#3b82f6", "#93c5fd"],
  ["#eab308", "#171717", "#4a4d52"],
  ["#fed7aa", "#ea580c", "#e5e7eb"],
  ["#bfdbfe", "#2563eb", "#e5e7eb"],
  ["#7c3aed", "#a78bfa", "#e5e7eb"],
  ["#db2777", "#ec4899", "#e5e7eb"],
  ["#2563eb", "#1e40af", "#e5e7eb"],
  ["#374151", "#6b7280", "#e5e7eb"],
];

function BuildPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-0 top-full mt-0 z-50 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
      <div className="flex items-center justify-end p-2 border-b border-gray-100">
        <button type="button" onClick={onClose} className="p-1.5 rounded text-[#4a4d52] hover:bg-gray-100" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="py-2 max-h-[360px] overflow-y-auto">
        {QUESTION_TYPES.map((item) => (
          <button key={item.label} type="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#282a2e] hover:bg-gray-50">
            <QuestionTypeIcon icon={item.icon} />
            <span className="flex-1 min-w-0">{item.label}</span>
            {item.locked && (
              <svg className="w-4 h-4 text-[#fcc107] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            )}
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 text-center">
        <button type="button" className="text-sm text-[#007BFF] hover:underline font-medium">
          View more
        </button>
      </div>
    </div>
  );
}

function QuestionBankPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-0 top-full mt-0 z-50 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#282a2e]">Question bank</h2>
          <button type="button" className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[#4a4d52] hover:bg-gray-300" aria-label="Help">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded text-[#4a4d52] hover:bg-gray-100" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for questions"
            className="w-full pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#3aa666]"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {QUESTION_BANK_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-[#282a2e] hover:bg-gray-50 border-b border-gray-100 last:border-0"
          >
            <span>{category}</span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function LogicPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-0 top-full mt-0 z-50 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#282a2e]">Logic</h2>
          <button type="button" className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[#4a4d52] hover:bg-gray-300" aria-label="Help">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 rounded text-[#4a4d52] hover:bg-gray-100" aria-label="Close">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="py-2">
        {LOGIC_FEATURES.map((feature) => (
          <div key={feature.label} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3 min-w-0">
              {feature.icon === "headphone" && (
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              )}
              {feature.icon === "arrows" && (
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              )}
              {feature.icon === "check" && (
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {feature.icon === "brackets" && (
                <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              )}
              <span className="text-sm text-[#282a2e]">{feature.label}</span>
            </div>
            <button type="button" className="py-1.5 px-3 rounded-md bg-[#fcc107] text-[#282a2e] text-xs font-medium hover:opacity-95 shrink-0">
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<string>("style");
  const [styleSubTab, setStyleSubTab] = useState<"settings" | "themes">("themes");
  const [buildPanelOpen, setBuildPanelOpen] = useState(false);
  const [questionBankPanelOpen, setQuestionBankPanelOpen] = useState(false);
  const [logicPanelOpen, setLogicPanelOpen] = useState(false);

  const isPanelOpen = buildPanelOpen || questionBankPanelOpen || logicPanelOpen;

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setBuildPanelOpen(tabId === "build");
    setQuestionBankPanelOpen(tabId === "question-bank");
    setLogicPanelOpen(tabId === "logic");
  };

  return (
    <aside className={`w-[280px] shrink-0 bg-[#f0f0f0] border-r border-gray-200 flex flex-col h-full relative ${isPanelOpen ? "overflow-visible" : "overflow-hidden"}`}>
      <div className="flex border-b border-gray-200 bg-white">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium ${
              activeTab === tab.id
                ? "bg-gray-50 text-[#3aa666] border-b-2 border-[#3aa666] -mb-px"
                : "text-[#4a4d52] hover:bg-gray-50"
            }`}
          >
            {tab.icon === "plus" && <span className="text-base leading-none">+</span>}
            {tab.icon === "pen" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            )}
            {tab.icon === "nodes" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            )}
            {tab.icon === "folder" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "build" && buildPanelOpen && (
        <div className="absolute left-0 top-[49px] z-40">
          <BuildPanel onClose={() => handleTabClick("style")} />
        </div>
      )}

      {activeTab === "question-bank" && questionBankPanelOpen && (
        <div className="absolute left-0 top-[49px] z-40">
          <QuestionBankPanel onClose={() => handleTabClick("style")} />
        </div>
      )}

      {activeTab === "logic" && logicPanelOpen && (
        <div className="absolute left-0 top-[49px] z-40">
          <LogicPanel onClose={() => handleTabClick("style")} />
        </div>
      )}

      {activeTab === "style" && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#282a2e]">Style</h2>
              <button type="button" className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[#4a4d52] hover:bg-gray-300" aria-label="Help">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
            <button type="button" className="text-[#4a4d52] hover:text-[#282a2e]" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex border-b border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setStyleSubTab("settings")}
              className={`flex-1 py-2.5 text-sm font-medium ${
                styleSubTab === "settings"
                  ? "text-[#3aa666] border-b-2 border-[#3aa666] -mb-px"
                  : "text-[#4a4d52]"
              }`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setStyleSubTab("themes")}
              className={`flex-1 py-2.5 text-sm font-medium ${
                styleSubTab === "themes"
                  ? "text-[#3aa666] border-b-2 border-[#3aa666] -mb-px"
                  : "text-[#4a4d52]"
              }`}
            >
              Themes
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
            <div className="rounded-lg bg-[#d6f5f2] p-4 mb-4">
              <button type="button" className="w-full py-2.5 rounded-md bg-[#fcc107] text-[#282a2e] text-sm font-medium hover:opacity-95">
                Upgrade to generate theme
              </button>
            </div>

            {styleSubTab === "settings" && (
              <>
                <h3 className="text-sm font-semibold text-[#282a2e] mb-3">Heritage</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Your logo</p>
                    <div className="aspect-[2/1] rounded border border-gray-200 bg-white flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl">+</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Footer</p>
                    <div className="aspect-[2/1] rounded border border-gray-200 bg-white flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#3aa666]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="8" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" /><path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Fonts</p>
                    <div className="aspect-[2/1] rounded border border-gray-200 bg-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#3aa666]">Aa</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Layout</p>
                    <div className="aspect-[2/1] rounded border border-gray-200 bg-white flex items-center justify-center">
                      <button type="button" className="w-full h-full flex items-center justify-center bg-[#4a4d52] rounded border border-[#4a4d52]">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Background</p>
                    <div className="rounded border border-gray-200 bg-white h-10" />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#282a2e]">Preset colors</h3>
                  <button type="button" className="text-sm text-[#007BFF] hover:underline font-medium">Edit</button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_SWATCHES.map((colors, i) => (
                    <div key={i} className={`rounded border ${i === 0 ? "border-[#3aa666] border-2" : "border-gray-200"}`}>
                      <div className="flex flex-col h-8 rounded overflow-hidden">
                        {colors.map((c, j) => (
                          <div key={j} className="flex-1 min-h-[2px]" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="rounded border border-gray-200 border-dashed h-8 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg leading-none">+</span>
                  </div>
                </div>
              </>
            )}

            {styleSubTab === "themes" && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#282a2e]">My themes</span>
                    <button type="button" className="py-1.5 px-3 rounded-md bg-[#fcc107] text-[#282a2e] text-xs font-medium hover:opacity-95 shadow-sm">
                      Upgrade
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Upgrade to unlock custom themes.</p>
                </div>
                <h3 className="text-sm font-medium text-[#282a2e] mb-3">Standard themes</h3>
                <div className="space-y-0">
                  {THEMES.map((theme) => (
                    <ThemeCard
                      key={theme.name}
                      name={theme.name}
                      selected={theme.selected}
                      thumbnailStyle={theme.thumbnail}
                      showAccessibility={theme.accessibility}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {activeTab !== "style" && !isPanelOpen && (
        <div className="flex-1 flex items-center justify-center p-6 text-sm text-gray-500 bg-[#f0f0f0]">
          {activeTab === "logic" && "Logic"}
          {activeTab === "question-bank" && "Question bank"}
        </div>
      )}
    </aside>
  );
}
