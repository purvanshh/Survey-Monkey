"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QuestionTypeModal from "./QuestionTypeModal";
import { QuestionTypeIcon } from "./QuestionTypeIcons";
import { predictAnswerTypeApi } from "@/lib/api";
import { predictAnswerType } from "@/lib/predictAnswerType";
import type { SavedQuestionData } from "@/types/survey";

const DEFAULT_TYPE = "Multiple choice";

export interface QuestionBlockProps {
  questionNumber?: number;
  savedData?: SavedQuestionData | null;
  onSave?: (data: SavedQuestionData) => void;
  onDelete?: () => void;
}
const DEBOUNCE_MS = 400;

const DROPDOWN_TYPES = [
  { label: "Multiple choice", icon: "list", locked: false },
  { label: "Single text box", icon: "text", locked: false },
  { label: "Checkboxes", icon: "checkbox", locked: false },
  { label: "Star rating", icon: "star", locked: true },
  { label: "Matrix / Rating scale", icon: "grid", locked: true },
  { label: "Slider", icon: "slider", locked: true },
  { label: "Ranking", icon: "ranking", locked: true },
] as const;

type QuestionTypeLabel = (typeof DROPDOWN_TYPES)[number]["label"];

const TYPE_LABELS: readonly QuestionTypeLabel[] = DROPDOWN_TYPES.map((t) => t.label);

function isValidQuestionType(s: string): s is QuestionTypeLabel {
  return (TYPE_LABELS as readonly string[]).includes(s);
}

function FormattingToolbar() {
  return (
    <div className="flex items-center gap-0.5 flex-wrap border border-[#e5e7e9] rounded bg-[#f9fafb] px-1.5 py-1">
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" title="Bold" aria-label="Bold">
        <span className="text-sm font-bold">B</span>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" title="Underline" aria-label="Underline">
        <span className="text-sm underline">U</span>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" title="Italic" aria-label="Italic">
        <span className="text-sm italic">I</span>
      </button>
      <span className="w-px h-4 bg-[#e5e7e9] mx-0.5" />
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146] flex items-center gap-0.5 text-xs" aria-label="Text color">
        A <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="Insert image">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="Insert video">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="Insert link">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </button>
      <span className="w-px h-4 bg-[#e5e7e9] mx-0.5" />
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="Undo">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="Redo">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m0-6l6-6" /></svg>
      </button>
      <button type="button" className="p-1.5 rounded hover:bg-[#f2f3f5] text-[#6b7280] hover:text-[#3d4146]" aria-label="More options">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
      </button>
    </div>
  );
}

export default function QuestionBlock({ questionNumber = 1, savedData = null, onSave, onDelete }: QuestionBlockProps) {
  const [questionTypeOpen, setQuestionTypeOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState(savedData?.text ?? "");
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionTypeLabel>(() => {
    const t = savedData?.type ?? DEFAULT_TYPE;
    return isValidQuestionType(t) ? t : DEFAULT_TYPE;
  });
  const [answerGeniusEnabled, setAnswerGeniusEnabled] = useState(true);
  const [editTab, setEditTab] = useState<"edit" | "options" | "logic" | "copy">("edit");
  const [answerChoices, setAnswerChoices] = useState<string[]>(savedData?.answerChoices?.length ? savedData.answerChoices : ["", "", ""]);
  const [isEditing, setIsEditing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestQuestionRef = useRef<string>("");

  useEffect(() => {
    if (savedData && isEditing) {
      setQuestion(savedData.text);
      if (isValidQuestionType(savedData.type)) setSelectedType(savedData.type);
      setAnswerChoices(savedData.answerChoices?.length ? savedData.answerChoices : ["", "", ""]);
    }
  }, [savedData, isEditing]);

  const handleSave = () => {
    const text = question.trim();
    if (!text) return;
    onSave?.({
      text,
      type: selectedType,
      answerChoices: answerChoices.filter((c) => c.trim() !== ""),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (savedData) {
      setIsEditing(false);
      setQuestion(savedData.text);
      if (isValidQuestionType(savedData.type)) setSelectedType(savedData.type);
      setAnswerChoices(savedData.answerChoices?.length ? savedData.answerChoices : ["", "", ""]);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setQuestionTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyPrediction = useCallback((value: string, predicted: string | null) => {
    if (predicted && isValidQuestionType(predicted)) {
      setSelectedType(predicted);
    }
  }, []);

  useEffect(() => {
    if (!answerGeniusEnabled || !question.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      debounceRef.current = null;
      const text = question.trim();
      lastRequestQuestionRef.current = text;
      try {
        const predicted = await predictAnswerTypeApi(text);
        if (lastRequestQuestionRef.current === text) {
          applyPrediction(text, predicted);
        }
      } catch {
        const fallback = predictAnswerType(text);
        if (lastRequestQuestionRef.current === text && fallback) {
          applyPrediction(text, fallback);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [question, answerGeniusEnabled, applyPrediction]);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
  };

  const rowHeight = "h-11";
  const showDialogue = question.trim().length > 0 || isEditing;
  const showSavedView = savedData && !isEditing;

  const hasChoiceAnswers = selectedType === "Multiple choice" || selectedType === "Checkboxes";
  const isCheckboxType = selectedType === "Checkboxes";

  const addAnswerChoice = () => setAnswerChoices((prev) => [...prev, ""]);
  const removeAnswerChoice = (i: number) => setAnswerChoices((prev) => prev.filter((_, idx) => idx !== i));
  const setChoice = (i: number, value: string) => setAnswerChoices((prev) => {
    const next = [...prev];
    next[i] = value;
    return next;
  });

  if (showSavedView) {
    const isChoiceType = savedData!.type === "Multiple choice" || savedData!.type === "Checkboxes";
    return (
      <div className="bg-white border border-[#e5e7e9] rounded-xl shadow-sm overflow-hidden h-[180px] flex flex-col">
        <div className="p-4 flex-1 min-h-0 overflow-y-auto flex flex-col">
          <p className="text-base font-medium text-[#282a2e] mb-3 line-clamp-2 break-words shrink-0">
            {questionNumber}. {savedData!.text}
          </p>
          {isChoiceType && savedData!.answerChoices?.length > 0 ? (
            <ul className="space-y-2 mb-3">
              {savedData!.answerChoices.map((choice, i) => (
                <li key={i} className="flex items-center gap-2">
                  {savedData!.type === "Checkboxes" ? (
                    <span className="w-4 h-4 rounded border border-[#d1d5da] bg-white shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-[#d1d5da] bg-white shrink-0" />
                  )}
                  <span className="text-sm text-[#3d4146] truncate">{choice || "(Empty choice)"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <input
              type="text"
              readOnly
              placeholder="Enter your answer"
              className="w-full py-2.5 px-3 text-sm border border-[#d1d5da] rounded-lg bg-[#f9fafb] text-[#3d4146] placeholder:text-[#9ca3af] shrink-0"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-[#e5e7e9] bg-[#f9fafb] flex-wrap">
          <button type="button" className="w-8 h-8 rounded-[6px] border border-[#d1d5da] bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#f9fafb]" aria-label="Comments">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
          <span className="text-xs text-[#6b7280]">0</span>
          <button type="button" onClick={() => setIsEditing(true)} className="px-3 py-1.5 rounded-[6px] bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95">
            Edit
          </button>
          <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb]">
            Options
          </button>
          <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb]">
            Copy
          </button>
          <button type="button" className="flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] bg-[#facc15] text-[#3d4146] text-sm font-medium hover:bg-[#eab308]">
            Library
          </button>
          <button type="button" onClick={onDelete} className="h-8 w-8 rounded-[6px] border border-[#d1d5da] bg-white text-[#6b7280] hover:bg-red-50 hover:text-red-500 hover:border-red-300 flex items-center justify-center" aria-label="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    );
  }

  if (showDialogue) {
    return (
      <>
        <div className="bg-white rounded-lg border border-[#e5e7e9] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Panel header: tabs + action icons */}
          <div className="flex items-end justify-between border-b border-[#e5e7e9] bg-white px-4 pt-3 pb-0 min-h-[44px]">
            <nav className="flex gap-0 border-b border-[#e5e7e9] -mb-px">
              {(["edit", "options", "logic", "copy"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setEditTab(tab)}
                  className={`pb-2.5 pt-0.5 px-3 text-sm font-medium border-b-2 border-l-2 transition-colors capitalize ${editTab === tab ? "text-[#4a9b6e] border-[#4a9b6e] border-l-[#4a9b6e] bg-white" : "text-[#6b7280] border-transparent border-l-transparent hover:text-[#3d4146]"}`}
                >
                  {tab === "edit" ? "Edit" : tab === "options" ? "Options" : tab === "logic" ? "Logic" : "Copy"}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-1 pb-2">
              <button type="button" className="p-1.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146]" aria-label="Options">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button type="button" className="p-1.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146]" aria-label="Format">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button type="button" onClick={onDelete} className="p-1.5 rounded text-[#6b7280] hover:bg-red-50 hover:text-red-500" aria-label="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button type="button" className="p-1.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146]" aria-label="Copy">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>

          <div className="p-5 bg-white min-h-[200px]">
            {editTab === "edit" && (
              <>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="text-sm font-medium text-[#3d4146] pt-2.5 shrink-0">Q{questionNumber}</span>
                  <div className="flex-1 min-w-[200px] flex flex-col gap-2">
                    <div className="flex flex-wrap items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => handleQuestionChange(e.target.value)}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          placeholder="Enter your question"
                          className={`w-full min-w-[200px] py-2.5 px-3 text-base text-[#282a2e] bg-white border rounded focus:outline-none focus:ring-0 placeholder:text-[#9ca3af] ${inputFocused ? "border-l-2 border-b-2 border-l-[#4a9b6e] border-b-[#4a9b6e] border-t border-r border-[#d1d5da]" : "border border-[#d1d5da]"}`}
                          aria-label="Question text"
                        />
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <button type="button" className="flex items-center gap-1.5 text-sm text-[#3d4146] hover:text-[#282a2e]">
                            <span className="w-5 h-5 rounded-full border border-[#d1d5da] bg-[#f2f3f5] flex items-center justify-center text-[#6b7280]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                            Insert text from...
                            <svg className="w-4 h-4 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                      </div>
                      <FormattingToolbar />
                      <div className="relative shrink-0" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setQuestionTypeOpen(!questionTypeOpen)}
                          className="h-9 min-w-[140px] flex items-center justify-between gap-2 px-3 text-sm text-[#3d4146] bg-white rounded border border-[#d1d5da] hover:bg-[#f9fafb]"
                        >
                          <span className="truncate">{selectedType}</span>
                          <svg className={`w-4 h-4 text-[#6b7280] shrink-0 transition-transform ${questionTypeOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {questionTypeOpen && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e7e9] rounded-lg shadow-lg z-10 min-w-[240px] overflow-hidden">
                            <div className="py-2">
                              {DROPDOWN_TYPES.map((item) => (
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={() => {
                                    setSelectedType(item.label);
                                    setQuestionTypeOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-[#3d4146] hover:bg-[#f9fafb] ${item.label === selectedType ? "bg-[#f2f3f5]" : ""}`}
                                >
                                  <QuestionTypeIcon icon={item.icon as any} className="w-5 h-5 text-[#6b7280] shrink-0" />
                                  <span className="flex-1 min-w-0">{item.label}</span>
                                  {item.locked && (
                                    <svg className="w-4 h-4 text-[#facc15] shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                  )}
                                </button>
                              ))}
                            </div>
                            <div className="border-t border-[#e5e7e9] p-2 text-center bg-[#f9fafb]">
                              <button
                                type="button"
                                onClick={() => { setQuestionTypeOpen(false); setShowModal(true); }}
                                className="text-sm text-[#2563eb] hover:underline font-medium"
                              >
                                View more
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button type="button" className="h-9 w-9 rounded-full border border-[#d1d5da] bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#f9fafb]" aria-label="Help">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {hasChoiceAnswers && (
                  <>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <svg className="w-5 h-5 text-[#6b7280] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      <span className="text-sm font-medium text-[#3d4146]">Answer genius</span>
                      <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146]" aria-label="Learn about Answer genius">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <select className="flex-1 min-w-0 h-8 px-2.5 text-sm text-[#3d4146] bg-white border border-[#d1d5da] rounded focus:outline-none focus:ring-0">
                          <option>Select type</option>
                        </select>
                        <svg className="w-4 h-4 text-[#6b7280] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={answerGeniusEnabled}
                        onClick={() => setAnswerGeniusEnabled(!answerGeniusEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:ring-offset-2 ${answerGeniusEnabled ? "bg-[#4a9b6e]" : "bg-[#d1d5da]"}`}
                      >
                        <span className="sr-only">Toggle Answer genius</span>
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${answerGeniusEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {answerChoices.map((choice, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {isCheckboxType ? (
                            <span className="w-4 h-4 rounded border border-[#d1d5da] bg-white shrink-0" aria-hidden />
                          ) : (
                            <span className="w-4 h-4 rounded-full border-2 border-[#d1d5da] bg-white shrink-0" aria-hidden />
                          )}
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) => setChoice(i, e.target.value)}
                            placeholder="Enter an answer choice"
                            className="flex-1 min-w-0 py-2 px-3 text-sm text-[#282a2e] border border-[#d1d5da] rounded focus:outline-none focus:ring-0 focus:border-[#4a9b6e] placeholder:text-[#9ca3af]"
                          />
                          <button type="button" onClick={addAnswerChoice} className="p-1.5 text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146] rounded" aria-label="Add choice">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                          <button type="button" onClick={() => removeAnswerChoice(i)} className="p-1.5 text-[#6b7280] hover:bg-[#f2f3f5] hover:text-[#3d4146] rounded" aria-label="Remove choice">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <button type="button" className="inline-flex items-center gap-1.5 text-sm text-[#2563eb] hover:underline font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Reverse answer order
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-sm text-[#2563eb] font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Bulk answers
                        <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                        <span className="text-sm text-[#3d4146]">Score this question (enable quiz mode)</span>
                        <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </label>
                      <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded bg-[#fef3c7] border border-[#fde68a]">
                        <label className="flex items-center gap-2 cursor-not-allowed opacity-90">
                          <input type="checkbox" disabled className="w-4 h-4 rounded border-[#d1d5da]" />
                          <span className="text-sm text-[#6b7280]">Use previous answer choices (carry forward responses)</span>
                        </label>
                        <button type="button" className="ml-auto px-3 py-1.5 text-sm font-medium text-[#3d4146] bg-[#facc15] border border-[#eab308] rounded hover:bg-[#eab308]">
                          Upgrade
                        </button>
                        <button type="button" className="p-0.5 rounded text-[#6b7280]" aria-label="Help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                        <span className="text-sm text-[#3d4146]">Add an &quot;Other&quot; answer option or comment field</span>
                        <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                        <span className="text-sm text-[#3d4146]">Add a &quot;None of the above&quot; answer option</span>
                        <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5]" aria-label="Help">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      </label>
                    </div>
                  </>
                )}
              </>
            )}
            {editTab === "options" && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                  <span className="text-sm text-[#3d4146]">Require an answer to this question</span>
                  <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] ml-auto" aria-label="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                  <span className="text-sm text-[#3d4146]">Change the layout for how choices are displayed</span>
                  <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] ml-auto" aria-label="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                  <span className="text-sm text-[#3d4146]">Randomize, sort, or flip choices (does not apply to &apos;Other&apos; or &apos;None of the above&apos; answer choices)</span>
                  <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] ml-auto" aria-label="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#d1d5da] text-[#4a9b6e] focus:ring-[#4a9b6e]" />
                  <span className="text-sm text-[#3d4146]">Adjust question layout</span>
                  <button type="button" className="p-0.5 rounded text-[#6b7280] hover:bg-[#f2f3f5] ml-auto" aria-label="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </label>
                <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded bg-[#fef3c7] border border-[#fde68a] mt-4">
                  <span className="text-sm text-[#3d4146]">Enable question text A/B test (Random Assignment)</span>
                  <button type="button" className="ml-auto px-3 py-1.5 text-sm font-medium text-[#3d4146] bg-[#facc15] border border-[#eab308] rounded hover:bg-[#eab308]">
                    Upgrade
                  </button>
                  <button type="button" className="p-0.5 rounded text-[#6b7280]" aria-label="Help">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </div>
              </div>
            )}
            {editTab === "logic" && (
              <div className="py-4 text-sm text-[#6b7280]">Logic for this question.</div>
            )}
            {editTab === "copy" && (
              <div className="py-4 text-sm text-[#6b7280]">Copy question settings.</div>
            )}
          </div>

          <div className="px-5 py-3 bg-white border-t border-[#e5e7e9] flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95"
            >
              <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs leading-none">+</span>
              Next question
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-md border border-[#d1d5da] bg-white text-[#3d4146] text-sm font-medium hover:bg-[#f9fafb]">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-4 py-2 rounded-md bg-[#4a9b6e] text-white text-sm font-medium hover:opacity-95">
                Save
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center">
          <button type="button" className="text-sm text-[#2563eb] hover:underline font-medium">
            Copy and paste questions
          </button>
        </p>

        {showModal && <QuestionTypeModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-xl p-3 shadow-sm flex flex-nowrap items-center gap-2">
        <div className={`${rowHeight} min-w-[44px] px-2.5 rounded-lg bg-[#4a4d52] flex items-center justify-center shrink-0`}>
          <span className="text-sm font-medium text-white">Q{questionNumber}</span>
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
