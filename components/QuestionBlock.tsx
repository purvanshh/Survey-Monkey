"use client";

import { useState, useRef, useEffect } from "react";
import { QUESTION_TYPES } from "@/constants/questionTypes";
import { QuestionTypeIcon } from "./QuestionTypeIcons";

const DEFAULT_TYPE = "Multiple choice";

export default function QuestionBlock() {
  const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedType, setSelectedType] = useState(DEFAULT_TYPE);
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

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="min-w-[32px] h-8 px-2 rounded bg-[#4a4d52] flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-white">Q1</span>
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Enter your question"
              className={`w-full px-3 py-2.5 text-base rounded-md focus:outline-none focus:ring-0 placeholder:text-gray-400 border ${
                inputFocused ? "border-2 border-[#3aa666]" : "border border-gray-300 bg-gray-50"
              }`}
            />
          </div>
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setQuestionTypeOpen(!questionTypeOpen)}
              className={`flex-1 flex items-center justify-between px-3 py-2.5 text-sm text-[#282a2e] bg-white rounded-md hover:bg-gray-50 border border-gray-300 ${
                questionTypeOpen ? "border-b-2 border-b-[#3aa666]" : ""
              }`}
            >
              <span>{selectedType}</span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${questionTypeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button type="button" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-600 hover:bg-gray-300" aria-label="Help">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            {questionTypeOpen && (
              <div className="absolute top-full left-0 right-12 mt-1 py-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[240px]">
                {QUESTION_TYPES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedType(item.label);
                      setQuestionTypeOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#282a2e] hover:bg-gray-50 ${
                      item.label === selectedType ? "bg-gray-100" : ""
                    }`}
                  >
                    <QuestionTypeIcon icon={item.icon} />
                    <span className="flex-1 min-w-0">{item.label}</span>
                    {item.locked && (
                      <svg className="w-4 h-4 text-[#fcc107] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
