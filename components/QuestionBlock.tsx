"use client";

import { useState, useRef, useEffect } from "react";
import QuestionTypeModal from "./QuestionTypeModal";
import { QuestionTypeIcon } from "./QuestionTypeIcons";
import { predictAnswerType } from "@/lib/predictAnswerType";

const DEFAULT_TYPE = "Multiple choice";

const DROPDOWN_TYPES = [
  { label: "Multiple choice", icon: "list", locked: false },
  { label: "Single text box", icon: "text", locked: false },
  { label: "Checkboxes", icon: "checkbox", locked: false },
  { label: "Star rating", icon: "star", locked: true },
  { label: "Matrix / Rating scale", icon: "grid", locked: true },
  { label: "Slider", icon: "slider", locked: true },
  { label: "Ranking", icon: "ranking", locked: true },
] as const;

const TYPE_LABELS = DROPDOWN_TYPES.map((t) => t.label);

export default function QuestionBlock() {
  const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedType, setSelectedType] = useState(DEFAULT_TYPE);
  const [answerGeniusEnabled, setAnswerGeniusEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setQuestionTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (answerGeniusEnabled && value.trim()) {
      const predicted = predictAnswerType(value);
      if (predicted && TYPE_LABELS.includes(predicted)) {
        setSelectedType(predicted);
      }
    }
  };

  const rowHeight = "h-11";

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-sm flex flex-nowrap items-center gap-2">
        <div className={`${rowHeight} min-w-[44px] px-2.5 rounded-lg bg-[#4a4d52] flex items-center justify-center shrink-0`}>
          <span className="text-sm font-medium text-white">Q1</span>
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Enter your question"
          className={`flex-1 min-w-0 ${rowHeight} px-3 text-base rounded-lg focus:outline-none focus:ring-0 placeholder:text-gray-400 border ${inputFocused ? "border-2 border-[#4a9b6e]" : "border border-gray-300 bg-gray-50"}`}
        />
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setQuestionTypeOpen(!questionTypeOpen)}
            className={`${rowHeight} min-w-[140px] flex items-center justify-between gap-2 px-3 text-sm text-[#282a2e] bg-white rounded-lg hover:bg-gray-50 border border-gray-300 ${questionTypeOpen ? "border-b-2 border-b-[#4a9b6e]" : ""}`}
          >
            <span className="truncate">{selectedType}</span>
            <svg className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${questionTypeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {questionTypeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[240px] overflow-hidden">
              <div className="py-2">
                {DROPDOWN_TYPES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedType(item.label);
                      setQuestionTypeOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#282a2e] hover:bg-gray-50 ${item.label === selectedType ? "bg-gray-100" : ""}`}
                  >
                    <QuestionTypeIcon icon={item.icon as any} />
                    <span className="flex-1 min-w-0">{item.label}</span>
                    {item.locked && (
                      <svg className="w-4 h-4 text-[#fcc107] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 p-2 text-center bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setQuestionTypeOpen(false);
                    setShowModal(true);
                  }}
                  className="text-sm text-[#007BFF] hover:underline font-medium"
                >
                  View more
                </button>
              </div>
            </div>
          )}
        </div>
        <button type="button" className={`${rowHeight} w-10 rounded-full bg-[#e8e9eb] flex items-center justify-center shrink-0 text-[#4a4d52] hover:bg-[#dfe0e2]`} aria-label="Help">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#282a2e]">Answer genius</span>
          <button type="button" className="p-0.5 rounded text-[#6b7280] hover:text-[#282a2e] hover:bg-gray-100" aria-label="Learn about Answer genius">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6b7280]">Select type</span>
          <button
            type="button"
            role="switch"
            aria-checked={answerGeniusEnabled}
            onClick={() => setAnswerGeniusEnabled(!answerGeniusEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:ring-offset-2 ${answerGeniusEnabled ? "bg-[#4a9b6e]" : "bg-gray-200"}`}
          >
            <span className="sr-only">Toggle Answer genius</span>
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${answerGeniusEnabled ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>
      {showModal && <QuestionTypeModal onClose={() => setShowModal(false)} />}
    </>
  );
}
