"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPublicSurvey, submitSurveyResponse } from "@/lib/surveyApi";
import type { ApiSurvey, ApiQuestion } from "@/types/survey";

type AnswerMap = Record<string, { text?: string; optionId?: string; optionIds?: string[] }>;

export default function PublicSurveyPage() {
    const params = useParams();
    const token = params.token as string;

    const [survey, setSurvey] = useState<ApiSurvey | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<AnswerMap>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const data = await getPublicSurvey(token);
                if (!cancelled) setSurvey(data);
            } catch {
                if (!cancelled) setError("Survey not found or link is invalid.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [token]);

    const handleTextChange = useCallback((questionId: string, text: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
    }, []);

    const handleRadioChange = useCallback((questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { optionId } }));
    }, []);

    const handleCheckboxChange = useCallback((questionId: string, optionId: string, checked: boolean) => {
        setAnswers((prev) => {
            const existing = prev[questionId]?.optionIds ?? [];
            const updated = checked
                ? [...existing, optionId]
                : existing.filter((id) => id !== optionId);
            return { ...prev, [questionId]: { optionIds: updated } };
        });
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!survey) return;
        setSubmitting(true);
        try {
            const payload = survey.questions.map((q) => {
                const ans = answers[q.id];
                if (q.type === "text" || q.type === "Single text box") {
                    return { question_id: q.id, answer_text: ans?.text ?? "" };
                }
                if (q.type === "multiple_choice" || q.type === "Multiple choice") {
                    return { question_id: q.id, selected_option_id: ans?.optionId ?? null };
                }
                if (q.type === "checkbox" || q.type === "Checkboxes") {
                    return {
                        question_id: q.id,
                        value_json: ans?.optionIds ?? [],
                    };
                }
                return { question_id: q.id, answer_text: ans?.text ?? "" };
            });

            await submitSurveyResponse(token, payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Submit failed:", err);
            setError("Failed to submit response. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }, [survey, answers, token]);

    // ---------------------------------------------------------------
    // Loading state
    // ---------------------------------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#f5f6f7]">
                <div className="flex items-center gap-3 text-[#6b7280]">
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-base font-medium">Loading survey...</span>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------
    // Error state
    // ---------------------------------------------------------------
    if (error && !survey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef2f2] to-[#f5f6f7]">
                <div className="max-w-md text-center space-y-4 px-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[#282a2e]">Survey Not Found</h1>
                    <p className="text-sm text-[#6b7280]">{error}</p>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------
    // Thank-you / submitted state
    // ---------------------------------------------------------------
    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#f5f6f7]">
                <div className="max-w-md text-center space-y-4 px-6">
                    <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-[#4a9b6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#282a2e]">Thank You!</h1>
                    <p className="text-sm text-[#6b7280]">Your response has been recorded successfully.</p>
                    <div className="pt-4">
                        <p className="text-xs text-gray-500">
                            Powered by{" "}
                            <span className="text-[#4a9b6e] font-semibold">SurveyMonkey®</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!survey) return null;

    const sortedQuestions = [...survey.questions].sort((a, b) => a.order_index - b.order_index);

    // ---------------------------------------------------------------
    // Survey form
    // ---------------------------------------------------------------
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f0fdf4] to-[#f5f6f7]">
            {/* Header */}
            <header className="bg-[#2d3238] text-white px-6 py-3 flex items-center gap-3 shrink-0">
                <span className="w-8 h-8 rounded-full bg-[#4a9b6e] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <circle cx="8" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                        <path d="M12 17c-2.5 0-4.5-1.5-5.5-3.5l1.5-.9c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2l1.5.9c-1 2-3 3.5-5.5 3.5z" />
                    </svg>
                </span>
                <span className="font-semibold text-lg">{survey.title}</span>
            </header>

            {/* Form */}
            <main className="flex-1 overflow-auto py-10 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Survey card */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        {/* Title bar */}
                        <div className="bg-[#4a9b6e] px-8 py-6">
                            <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
                            {survey.description && (
                                <p className="mt-2 text-white/80 text-sm">{survey.description}</p>
                            )}
                        </div>

                        {/* Questions */}
                        <div className="divide-y divide-gray-100">
                            {sortedQuestions.map((q, index) => (
                                <QuestionRenderer
                                    key={q.id}
                                    question={q}
                                    index={index}
                                    answer={answers[q.id]}
                                    onTextChange={handleTextChange}
                                    onRadioChange={handleRadioChange}
                                    onCheckboxChange={handleCheckboxChange}
                                />
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="px-8 py-6 bg-[#fafafa] border-t border-gray-100">
                            {error && (
                                <p className="text-red-600 text-sm mb-3">{error}</p>
                            )}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-8 py-3 rounded-lg bg-[#4a9b6e] text-white font-medium hover:bg-[#3d8a5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            Powered by{" "}
                            <span className="text-[#4a9b6e] font-semibold">SurveyMonkey®</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ================================================================== */
/*  Question renderer sub-component                                    */
/* ================================================================== */

interface QuestionRendererProps {
    question: ApiQuestion;
    index: number;
    answer?: { text?: string; optionId?: string; optionIds?: string[] };
    onTextChange: (qId: string, text: string) => void;
    onRadioChange: (qId: string, optionId: string) => void;
    onCheckboxChange: (qId: string, optionId: string, checked: boolean) => void;
}

function QuestionRenderer({
    question,
    index,
    answer,
    onTextChange,
    onRadioChange,
    onCheckboxChange,
}: QuestionRendererProps) {
    const sortedOptions = [...question.options].sort((a, b) => a.order_index - b.order_index);
    const isTextType = question.type === "text" || question.type === "Single text box";
    const isCheckbox = question.type === "checkbox" || question.type === "Checkboxes";

    return (
        <div className="px-8 py-6">
            <p className="text-base font-medium text-[#282a2e] mb-4">
                <span className="text-[#6b7280] mr-1">{index + 1}.</span>
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </p>

            {isTextType ? (
                <input
                    type="text"
                    value={answer?.text ?? ""}
                    onChange={(e) => onTextChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full py-3 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:border-[#4a9b6e] placeholder:text-gray-400 transition-colors"
                />
            ) : isCheckbox ? (
                <div className="space-y-3">
                    {sortedOptions.map((opt) => {
                        const checked = answer?.optionIds?.includes(opt.id) ?? false;
                        return (
                            <label
                                key={opt.id}
                                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg border cursor-pointer transition-colors ${checked
                                        ? "border-[#4a9b6e] bg-[#f0fdf4]"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => onCheckboxChange(question.id, opt.id, e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#4a9b6e] focus:ring-[#4a9b6e]"
                                />
                                <span className="text-sm text-[#3d4146]">{opt.label}</span>
                            </label>
                        );
                    })}
                </div>
            ) : (
                /* Default: radio / multiple choice */
                <div className="space-y-3">
                    {sortedOptions.map((opt) => {
                        const selected = answer?.optionId === opt.id;
                        return (
                            <label
                                key={opt.id}
                                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg border cursor-pointer transition-colors ${selected
                                        ? "border-[#4a9b6e] bg-[#f0fdf4]"
                                        : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={`q-${question.id}`}
                                    checked={selected}
                                    onChange={() => onRadioChange(question.id, opt.id)}
                                    className="w-4 h-4 border-gray-300 text-[#4a9b6e] focus:ring-[#4a9b6e]"
                                />
                                <span className="text-sm text-[#3d4146]">{opt.label}</span>
                            </label>
                        );
                    })}
                    {sortedOptions.length === 0 && (
                        <input
                            type="text"
                            value={answer?.text ?? ""}
                            onChange={(e) => onTextChange(question.id, e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full py-3 px-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9b6e] focus:border-[#4a9b6e] placeholder:text-gray-400 transition-colors"
                        />
                    )}
                </div>
            )}
        </div>
    );
}
