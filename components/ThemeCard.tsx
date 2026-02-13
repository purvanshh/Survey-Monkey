"use client";

interface ThemeCardProps {
  id: string;
  name: string;
  selected?: boolean;
  thumbnailClass: string;
  showAccessibility?: boolean;
  onClick?: () => void;
}

export default function ThemeCard({ id, name, selected, thumbnailClass, showAccessibility, onClick }: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-2.5 px-0 border-b border-[#eeeeee] last:border-0 text-left group rounded-none ${
        selected ? "bg-[#f5f5f5]" : "bg-transparent hover:bg-[#fafafa]"
      }`}
    >
      <div className="relative w-12 h-8 rounded border border-gray-200 shrink-0 overflow-hidden bg-white shadow-sm">
        <div className={`w-full h-full ${thumbnailClass}`} />
        {selected && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/20" aria-hidden>
            <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-medium text-[#333333]">{name}</span>
        {showAccessibility && (
          <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0" aria-hidden>
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </span>
        )}
      </div>
      <span className="p-1 rounded text-gray-400 group-hover:text-gray-600" aria-hidden>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </span>
    </button>
  );
}
