"use client";

import { useState, useMemo } from "react";
import { QUESTION_BANK_CATEGORIES, getQuestionsForCategory, type BankQuestion } from "@/data/questionBank";
import type { SavedQuestionData } from "@/types/survey";

interface QuestionBankModalProps {
  category: string;
  onClose: () => void;
  onAddQuestion: (data: SavedQuestionData) => void;
}

export default function QuestionBankModal({ category, onClose, onAddQuestion }: QuestionBankModalProps) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);

  const allQuestions = useMemo(() => getQuestionsForCategory(selectedCategory), [selectedCategory]);
  const filtered = useMemo(() => {
    if (!search.trim()) return allQuestions;
    const q = search.toLowerCase();
    return allQuestions.filter(
      (item) =>
        item.text.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [allQuestions, search]);

  const handleAdd = (item: BankQuestion) => {
    onAddQuestion({
      text: item.text,
      type: item.type,
      answerChoices: item.answerChoices ?? [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7e9] shrink-0">
          <h2 className="text-lg font-semibold text-[#282a2e]">Question Bank</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-[#e5e7e9] space-y-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 min-w-[180px] px-3 py-2.5 text-sm text-[#3d4146] bg-white border border-[#d1d5da] rounded-lg hover:bg-[#f9fafb]"
              >
                <span className="truncate">{selectedCategory}</span>
                <svg className={`w-4 h-4 text-[#6b7280] shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-[#e5e7e9] rounded-lg shadow-lg py-1 z-10">
                  {QUESTION_BANK_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#3d4146] hover:bg-[#f9fafb]"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recommended questions"
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-[#d1d5da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:border-[#4a9b6e] placeholder:text-[#9ca3af]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
            </div>
            <button type="button" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#3d4146] border border-[#d1d5da] rounded-lg bg-white hover:bg-[#f9fafb]">
              <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </button>
            <span className="text-sm text-[#6b7280] shrink-0">{filtered.length} questions</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="border border-[#e5e7e9] rounded-lg p-4 bg-white hover:border-[#4a9b6e]/30 transition-colors min-h-[120px] h-[120px] flex flex-col overflow-hidden"
              >
                <div className="flex items-start gap-2 flex-1 min-h-0">
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="shrink-0 w-8 h-8 rounded-full bg-[#4a9b6e] text-white flex items-center justify-center hover:opacity-90 mt-0.5"
                    aria-label="Add question"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                  <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
                    <p className="text-sm text-[#282a2e] leading-snug line-clamp-3 break-words">{item.text}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 min-h-0 overflow-hidden">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs rounded bg-[#f2f3f5] text-[#6b7280] shrink-0">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <button type="button" className="text-xs text-[#2563eb] hover:underline font-medium shrink-0">
                          Show More
                        </button>
                      )}
                    </div>
                    {item.answerChoices && item.answerChoices.length > 0 && (
                      <button type="button" className="mt-auto pt-1 text-xs text-[#2563eb] hover:underline font-medium shrink-0">
                        Show Answers
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-[#6b7280] py-8">No questions match your search.</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#e5e7e9] text-center shrink-0">
          <p className="text-sm text-[#6b7280]">
            See how easy it is to create surveys and forms.
          </p>
        </div>
      </div>
    </div>
  );
}
