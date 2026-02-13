/**
 * Frontend API client for the SurveyMonkey backend.
 *
 * Every function maps 1-to-1 to a backend endpoint.
 * Throws on non-2xx responses so callers can catch and handle.
 */

import type {
    ApiSurvey,
    ApiQuestion,
    ApiShareResponse,
    ApiSubmitResponse,
} from "@/types/survey";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${body}`);
    }
    // 204 No Content
    if (res.status === 204) return undefined as unknown as T;
    return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Survey CRUD                                                        */
/* ------------------------------------------------------------------ */

export async function createSurvey(
    title = "Untitled"
): Promise<ApiSurvey> {
    return request<ApiSurvey>(`${API_BASE}/api/surveys`, {
        method: "POST",
        body: JSON.stringify({ title }),
    });
}

export async function getSurvey(surveyId: string): Promise<ApiSurvey> {
    return request<ApiSurvey>(`${API_BASE}/api/surveys/${surveyId}`);
}

export async function updateSurvey(
    surveyId: string,
    data: { title?: string; description?: string }
): Promise<ApiSurvey> {
    return request<ApiSurvey>(`${API_BASE}/api/surveys/${surveyId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

/* ------------------------------------------------------------------ */
/*  Question CRUD                                                      */
/* ------------------------------------------------------------------ */

export interface AddQuestionPayload {
    type: string;
    title: string;
    description?: string;
    required?: boolean;
    order_index?: number;
    options: { label: string; value?: string; order_index?: number }[];
}

export async function addQuestion(
    surveyId: string,
    data: AddQuestionPayload
): Promise<ApiQuestion> {
    return request<ApiQuestion>(
        `${API_BASE}/api/surveys/${surveyId}/questions`,
        { method: "POST", body: JSON.stringify(data) }
    );
}

export async function updateQuestion(
    questionId: string,
    data: Partial<AddQuestionPayload>
): Promise<ApiQuestion> {
    return request<ApiQuestion>(`${API_BASE}/api/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteQuestion(questionId: string): Promise<void> {
    return request<void>(`${API_BASE}/api/questions/${questionId}`, {
        method: "DELETE",
    });
}

/* ------------------------------------------------------------------ */
/*  Share link                                                         */
/* ------------------------------------------------------------------ */

export async function generateShareLink(
    surveyId: string
): Promise<ApiShareResponse> {
    return request<ApiShareResponse>(
        `${API_BASE}/api/surveys/${surveyId}/share`,
        { method: "POST" }
    );
}

/* ------------------------------------------------------------------ */
/*  Public / Hosted survey                                             */
/* ------------------------------------------------------------------ */

export async function getPublicSurvey(
    shareToken: string
): Promise<ApiSurvey> {
    return request<ApiSurvey>(`${API_BASE}/s/${shareToken}`);
}

export interface SubmitAnswerPayload {
    question_id: string;
    answer_text?: string | null;
    selected_option_id?: string | null;
    value_json?: unknown;
}

export async function submitSurveyResponse(
    shareToken: string,
    answers: SubmitAnswerPayload[],
    respondentId?: string
): Promise<ApiSubmitResponse> {
    return request<ApiSubmitResponse>(`${API_BASE}/s/${shareToken}/submit`, {
        method: "POST",
        body: JSON.stringify({
            respondent_id: respondentId ?? null,
            metadata_: null,
            answers,
        }),
    });
}
