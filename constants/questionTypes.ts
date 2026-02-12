export const QUESTION_TYPES = [
  { label: "Multiple choice", icon: "list", locked: false },
  { label: "Comment box", icon: "comment", locked: true },
  { label: "Single text box", icon: "text", locked: false },
  { label: "Checkboxes", icon: "checkbox", locked: false },
  { label: "Star rating", icon: "star", locked: true },
  { label: "Matrix / Rating scale", icon: "grid", locked: true },
  { label: "Slider", icon: "slider", locked: true },
  { label: "Ranking", icon: "ranking", locked: true },
  { label: "Text", icon: "edit", locked: false },
] as const;
