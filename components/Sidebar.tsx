"use client";

import { useState } from "react";
import ThemeCard from "./ThemeCard";
import { QuestionTypeIcon } from "./QuestionTypeIcons";
import { QUESTION_TYPES } from "@/constants/questionTypes";
import { STANDARD_THEMES, type ThemeId } from "@/constants/themes";
import { QUESTION_BANK_CATEGORIES } from "@/data/questionBank";

export type SidebarTabId = "build" | "style" | "logic" | "question-bank";

export interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  stylePanelOpen: boolean;
  setStylePanelOpen: (open: boolean) => void;
  buildPanelOpen: boolean;
  questionBankPanelOpen: boolean;
  logicPanelOpen: boolean;
  selectedThemeId?: ThemeId;
  onThemeChange?: (themeId: ThemeId) => void;
  onQuestionBankCategorySelect?: (category: string) => void;
}


const LOGIC_FEATURES = [
  { label: "Page skip logic", icon: "headphone" },
  { label: "Page randomization", icon: "arrows" },
  { label: "Question randomization", icon: "arrows" },
  { label: "Block randomization", icon: "arrows" },
  { label: "Quota", icon: "check" },
  { label: "Custom variables", icon: "brackets" },
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
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
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

function QuestionBankPanel({ onClose, onCategorySelect }: { onClose: () => void; onCategorySelect?: (category: string) => void }) {
  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
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
            className="w-full pl-3 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#4a9b6e]"
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
            onClick={() => onCategorySelect?.(category)}
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
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
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

export default function Sidebar({
  activeTab,
  onTabChange,
  stylePanelOpen,
  setStylePanelOpen,
  buildPanelOpen,
  questionBankPanelOpen,
  logicPanelOpen,
  selectedThemeId,
  onThemeChange,
  onQuestionBankCategorySelect,
}: SidebarProps) {
  const [styleSubTab, setStyleSubTab] = useState<"settings" | "themes">("themes");

  const isStylePanelOpen = activeTab === "style" && stylePanelOpen;
  const isBuildPanelOpen = activeTab === "build" && buildPanelOpen;
  const isQuestionBankPanelOpen = activeTab === "question-bank" && questionBankPanelOpen;
  const isLogicPanelOpen = activeTab === "logic" && logicPanelOpen;
  const sidebarWidth = isStylePanelOpen || isBuildPanelOpen || isLogicPanelOpen || isQuestionBankPanelOpen ? 320 : 0;

  const closePanel = () => onTabChange("style");

  if (sidebarWidth === 0) return null;

  return (
    <aside
      className="shrink-0 border-r border-[#e5e7e9] flex flex-col h-full overflow-hidden bg-white"
      style={{ width: sidebarWidth }}
    >
      {isBuildPanelOpen && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <BuildPanel onClose={closePanel} />
        </div>
      )}

      {isQuestionBankPanelOpen && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <QuestionBankPanel onClose={closePanel} onCategorySelect={onQuestionBankCategorySelect} />
        </div>
      )}

      {isLogicPanelOpen && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <LogicPanel onClose={closePanel} />
        </div>
      )}

      {isStylePanelOpen && (
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7e9] shrink-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-medium text-[#3d4146]">Style</h2>
              <button type="button" className="w-4 h-4 rounded-full bg-[#e6e8ea] flex items-center justify-center text-[#6b7280] hover:bg-[#dfe0e2]" aria-label="Help">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
            <button type="button" onClick={() => setStylePanelOpen(false)} className="p-1 rounded text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Close">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex border-b border-[#e5e7e9] bg-white shrink-0">
            <button
              type="button"
              onClick={() => setStyleSubTab("settings")}
              className={`flex-1 py-2 text-sm font-medium ${styleSubTab === "settings"
                ? "text-[#4a9b6e] border-b-2 border-[#4a9b6e] -mb-px"
                : "text-[#6b7280]"
                }`}
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setStyleSubTab("themes")}
              className={`flex-1 py-2 text-sm font-medium ${styleSubTab === "themes"
                ? "text-[#4a9b6e] border-b-2 border-[#4a9b6e] -mb-px"
                : "text-[#6b7280]"
                }`}
            >
              Themes
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 bg-white min-h-0">
            <div className="rounded-lg bg-[#e0f7fa] p-4 mb-4 border border-dashed border-[#b2ebf2]">
              <div className="flex gap-3 mb-3">
                <div className="mt-0.5 text-[#4a4d52] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#282a2e] mb-1">Brand your survey</h3>
                  <p className="text-xs text-[#4a4d52] leading-relaxed">
                    Generate a theme based on your uploaded logo or any image you choose.
                  </p>
                </div>
              </div>
              <button type="button" className="w-full py-2.5 rounded-md bg-[#fcc107] text-[#282a2e] text-sm font-semibold hover:opacity-95">
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
                      <svg className="w-8 h-8 text-[#4a9b6e]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><circle cx="8" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" /><path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" /></svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#282a2e] mb-1.5">Fonts</p>
                    <div className="aspect-[2/1] rounded border border-gray-200 bg-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#4a9b6e]">Aa</span>
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
                    <div key={i} className={`rounded border ${i === 0 ? "border-[#4a9b6e] border-2" : "border-gray-200"}`}>
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
                <h3 className="text-sm font-medium text-[#282a2e] mb-2">My themes</h3>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md bg-[#fff8e1] border border-[#ffecb3] mb-4">
                  <p className="text-xs text-[#4a4d52]">Upgrade to unlock custom themes.</p>
                  <button type="button" className="py-1.5 px-3 rounded-md bg-[#fcc107] text-[#282a2e] text-xs font-medium hover:opacity-95 shrink-0">
                    Upgrade
                  </button>
                </div>
                <h3 className="text-sm font-medium text-[#282a2e] mb-3">Standard themes</h3>
                <div className="space-y-0">
                  {STANDARD_THEMES.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      id={theme.id}
                      name={theme.name}
                      selected={selectedThemeId === theme.id}
                      thumbnailClass={theme.thumbnailClass}
                      showAccessibility={theme.showAccessibility}
                      onClick={() => onThemeChange?.(theme.id)}
                    />
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-[#e5e7e9]">
                  <p className="text-xs text-[#999999]">Premium themes</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </aside>
  );
}
