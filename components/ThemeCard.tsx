"use client";

interface ThemeCardProps {
  name: string;
  selected?: boolean;
  thumbnailStyle: string;
  showAccessibility?: boolean;
}

export default function ThemeCard({ name, selected, thumbnailStyle, showAccessibility }: ThemeCardProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-0 border-b border-gray-200 last:border-0 group">
      <div className="relative w-10 h-[25px] rounded border border-gray-200 shrink-0 overflow-hidden bg-white">
        {selected ? (
          <div className="w-full h-full bg-[#4a4d52] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
        ) : (
          <div className={`w-full h-full ${thumbnailStyle}`} />
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-medium text-[#282a2e]">{name}</span>
        {showAccessibility && (
          <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
          </span>
        )}
      </div>
      <button type="button" className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="More actions">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
      </button>
    </div>
  );
}
