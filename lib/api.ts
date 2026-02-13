const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type PredictableType = "Single text box" | "Multiple choice" | "Checkboxes";

export interface PredictAnswerTypeResponse {
  answer_type: PredictableType | null;
}

/**
 * Calls the backend to predict answer type from question text.
 * Returns the suggested type or null. Throws on network/parse errors.
 */
export async function predictAnswerTypeApi(questionText: string): Promise<PredictableType | null> {
  const res = await fetch(`${API_BASE}/api/predict-answer-type`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_text: questionText.trim() }),
  });
  if (!res.ok) throw new Error("Predict request failed");
  const data: PredictAnswerTypeResponse = await res.json();
  return data.answer_type ?? null;
}
