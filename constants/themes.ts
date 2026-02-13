export type ThemeId =
  | "heritage"
  | "simple"
  | "full-color"
  | "highrise"
  | "dewdrop"
  | "pastel"
  | "walnut"
  | "stone"
  | "porch-lights"
  | "scribble"
  | "arctic";

export interface Theme {
  id: ThemeId;
  name: string;
  /** Tailwind classes for the small thumbnail in the sidebar */
  thumbnailClass: string;
  /** Class name applied to the survey canvas wrapper (defined in globals.css) */
  canvasClass: string;
  showAccessibility?: boolean;
}

export const STANDARD_THEMES: Theme[] = [
  { id: "heritage", name: "Heritage", thumbnailClass: "bg-gradient-to-br from-emerald-600 to-emerald-800", canvasClass: "theme-canvas-heritage", showAccessibility: true },
  { id: "simple", name: "Simple", thumbnailClass: "bg-gray-100", canvasClass: "theme-canvas-simple", showAccessibility: false },
  { id: "full-color", name: "Full Color", thumbnailClass: "bg-[#0097a7]", canvasClass: "theme-canvas-full-color", showAccessibility: false },
  { id: "highrise", name: "Highrise", thumbnailClass: "bg-gradient-to-b from-slate-600 to-slate-800", canvasClass: "theme-canvas-highrise", showAccessibility: false },
  { id: "dewdrop", name: "Dewdrop", thumbnailClass: "bg-gradient-to-br from-emerald-400/80 to-teal-500", canvasClass: "theme-canvas-dewdrop", showAccessibility: false },
  { id: "pastel", name: "Pastel", thumbnailClass: "bg-[#94D0C5]", canvasClass: "theme-canvas-pastel", showAccessibility: true },
  { id: "walnut", name: "Walnut", thumbnailClass: "bg-[#5c4033]", canvasClass: "theme-canvas-walnut", showAccessibility: false },
  { id: "stone", name: "Stone", thumbnailClass: "bg-[#9e9e9e]", canvasClass: "theme-canvas-stone", showAccessibility: false },
  { id: "porch-lights", name: "Porch Lights", thumbnailClass: "bg-[#1a1a1a]", canvasClass: "theme-canvas-porch-lights", showAccessibility: false },
  { id: "scribble", name: "Scribble", thumbnailClass: "bg-white", canvasClass: "theme-canvas-scribble", showAccessibility: false },
  { id: "arctic", name: "Arctic", thumbnailClass: "bg-gradient-to-br from-sky-100 to-blue-100", canvasClass: "theme-canvas-arctic", showAccessibility: true },
];

export const DEFAULT_THEME_ID: ThemeId = "simple";
