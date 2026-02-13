"use client";

import { QuestionTypeIcon } from "./QuestionTypeIcons";

const SELECTION_TYPES = [
    { label: "Multiple choice", icon: "list", locked: false },
    { label: "Checkboxes", icon: "checkbox", locked: false },
    { label: "Dropdown", icon: "dropdown", locked: false },
    { label: "Matrix of dropdown menus", icon: "matrix", locked: true },
    { label: "Image choice", icon: "image", locked: false },
] as const;

const RATING_TYPES = [
    { label: "Star rating", icon: "star", locked: true },
    { label: "Slider", icon: "slider", locked: true },
    { label: "Ranking", icon: "ranking", locked: true },
    { label: "Matrix / Rating scale", icon: "grid", locked: true },
    { label: "Best worst scale", icon: "ranking", locked: true }, // Using ranking icon for now
] as const;

const TEXTBOX_TYPES = [
    { label: "Comment box", icon: "comment", locked: true },
    { label: "Single text box", icon: "text", locked: false },
    { label: "Multiple textboxes", icon: "text", locked: true },
] as const;

const FORM_TYPES = [
    { label: "Name", icon: "name", locked: false },
    { label: "Email address", icon: "email", locked: false },
    { label: "Phone", icon: "phone", locked: false },
    { label: "Address", icon: "address", locked: false },
    { label: "Date / Time", icon: "date", locked: false },
] as const;

interface QuestionTypeModalProps {
    onClose: () => void;
}

export default function QuestionTypeModal({ onClose }: QuestionTypeModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-[#282a2e]">Choose a question type</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-3 gap-12 mb-12">
                        {/* Selection Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-[#282a2e] mb-4">Selection</h3>
                            <div className="space-y-1">
                                {SELECTION_TYPES.map((type) => (
                                    <button key={type.label} type="button" className="w-full flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded group">
                                        <QuestionTypeIcon icon={type.icon as any} className="w-5 h-5 text-gray-800" />
                                        <span className="flex-1 text-left text-sm text-[#282a2e]">{type.label}</span>
                                        {type.locked && (
                                            <svg className="w-4 h-4 text-[#fcc107]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-[#282a2e] mb-4">Rating</h3>
                            <div className="space-y-1">
                                {RATING_TYPES.map((type) => (
                                    <button key={type.label} type="button" className="w-full flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded group">
                                        <QuestionTypeIcon icon={type.icon as any} className="w-5 h-5 text-gray-800" />
                                        <span className="flex-1 text-left text-sm text-[#282a2e]">{type.label}</span>
                                        {type.locked && (
                                            <svg className="w-4 h-4 text-[#fcc107]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Textbox Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-[#282a2e] mb-4">Textbox</h3>
                            <div className="space-y-1">
                                {TEXTBOX_TYPES.map((type) => (
                                    <button key={type.label} type="button" className="w-full flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded group">
                                        <QuestionTypeIcon icon={type.icon as any} className="w-5 h-5 text-gray-800" />
                                        <span className="flex-1 text-left text-sm text-[#282a2e]">{type.label}</span>
                                        {type.locked && (
                                            <svg className="w-4 h-4 text-[#fcc107]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Forms Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#282a2e] mb-4">Forms</h3>
                        <div className="grid grid-cols-3 gap-12">
                            <div className="space-y-1">
                                {FORM_TYPES.slice(0, 5).map((type) => (
                                    <button key={type.label} type="button" className="w-full flex items-center gap-3 py-2 px-2 hover:bg-gray-50 rounded group">
                                        <QuestionTypeIcon icon={type.icon as any} className="w-5 h-5 text-gray-800" />
                                        <span className="flex-1 text-left text-sm text-[#282a2e]">{type.label}</span>
                                        {type.locked && (
                                            <svg className="w-4 h-4 text-[#fcc107]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
                    <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00B36B]">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                    <span className="text-sm text-[#282a2e]">Show tooltips</span>
                </div>
            </div>
        </div>
    );
}
