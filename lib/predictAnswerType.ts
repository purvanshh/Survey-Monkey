/**
 * Predicts a suitable question/answer type from the question text (e.g. "Answer genius").
 * Uses keyword and phrase matching; only suggests unlocked types so we can auto-apply.
 */

export const PREDICTABLE_TYPES = [
  "Single text box",
  "Multiple choice",
  "Checkboxes",
] as const;

export type PredictableType = (typeof PREDICTABLE_TYPES)[number];

const RULES: { type: PredictableType; patterns: (string | RegExp)[] }[] = [
  {
    type: "Single text box",
    patterns: [
      /enter\s+your\s+name/i,
      /what\s+is\s+your\s+name/i,
      /your\s+name/i,
      /enter\s+name/i,
      /name\s*$/i,
      /email\s*(address)?/i,
      /enter\s+your\s+email/i,
      /what\s+is\s+your\s+email/i,
      /phone\s*(number)?/i,
      /enter\s+your\s+phone/i,
      /address/i,
      /enter\s+your\s+address/i,
      /company\s+name/i,
      /job\s+title/i,
      /how\s+old\s+are\s+you/i,
      /age\s*$/i,
      /enter\s+your/i,
      /please\s+provide\s+your/i,
      /type\s+your/i,
      /write\s+your/i,
    ],
  },
  {
    type: "Multiple choice",
    patterns: [
      /select\s+your\s+preference/i,
      /select\s+(one|a)\s+option/i,
      /choose\s+(one|your)/i,
      /which\s+one\s+(do\s+you|would\s+you)/i,
      /pick\s+(one|your)/i,
      /what\s+is\s+your\s+preference/i,
      /prefer/i,
      /select\s+from\s+the/i,
      /choose\s+from/i,
      /which\s+(option|choice)/i,
      /how\s+would\s+you\s+rate/i,
      /rate\s+your\s+experience/i,
      /select\s+the\s+(best|option)/i,
      /choose\s+the\s+(best|option)/i,
      /one\s+of\s+the\s+following/i,
      /select\s+one/i,
      /choose\s+one/i,
      /pick\s+one/i,
      /which\s+of\s+these/i,
      /select\s+your/i,
      /choose\s+your/i,
    ],
  },
  {
    type: "Checkboxes",
    patterns: [
      /select\s+all\s+that\s+apply/i,
      /check\s+all\s+that\s+apply/i,
      /which\s+of\s+the\s+following/i,
      /select\s+all/i,
      /check\s+all/i,
      /select\s+any/i,
      /choose\s+all/i,
      /which\s+apply/i,
      /tick\s+all/i,
      /mark\s+all/i,
    ],
  },
];

function match(text: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") return text.toLowerCase().includes(pattern.toLowerCase());
  return pattern.test(text);
}

/**
 * Returns the best matching answer type for the question text, or null if no match.
 */
export function predictAnswerType(questionText: string): PredictableType | null {
  const trimmed = questionText.trim();
  if (!trimmed) return null;

  for (const { type, patterns } of RULES) {
    for (const pattern of patterns) {
      if (match(trimmed, pattern)) return type;
    }
  }

  return null;
}
