"use client";

export default function ActionButtons() {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        type="button"
        className="px-5 py-2.5 rounded-md bg-[#d3d3d3] text-white text-sm font-medium hover:bg-[#c0c0c0]"
      >
        New page
      </button>
    </div>
  );
}
