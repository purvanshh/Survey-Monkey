/**
 * Frontend API client for the SurveyMonkey backend.
 *
 * Every function maps 1-to-1 to a backend endpoint.
 * Uses centralized apiRequest from lib/api.ts.
 * Throws ApiError on non-2xx responses so callers can catch and handle.
 */

import { apiRequest } from "@/lib/api";
import type {
  ApiSurvey,
  ApiQuestion,
  ApiShareResponse,
  ApiSubmitResponse,
  ApiCollectorList,
  ApiResponseCount,
  ApiCollector,
  ApiResponseList,
} from "@/types/survey";

/* ------------------------------------------------------------------ */
/*  Survey CRUD                                                        */
/* ------------------------------------------------------------------ */

export async function createSurvey(title = "Untitled"): Promise<ApiSurvey> {
  return apiRequest<ApiSurvey>("/api/surveys", {
    method: "POST",
    body: { title },
  });
}

export async function getSurvey(surveyId: string): Promise<ApiSurvey> {
  return apiRequest<ApiSurvey>(`/api/surveys/${surveyId}`);
}

export async function updateSurvey(
  surveyId: string,
  data: { title?: string; description?: string }
): Promise<ApiSurvey> {
  return apiRequest<ApiSurvey>(`/api/surveys/${surveyId}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  return apiRequest<void>(`/api/surveys/${surveyId}`, {
    method: "DELETE",
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
  return apiRequest<ApiQuestion>(
    `/api/surveys/${surveyId}/questions`,
    { method: "POST", body: data }
  );
}

export async function updateQuestion(
  questionId: string,
  data: Partial<AddQuestionPayload>
): Promise<ApiQuestion> {
  return apiRequest<ApiQuestion>(`/api/questions/${questionId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteQuestion(questionId: string): Promise<void> {
  return apiRequest<void>(`/api/questions/${questionId}`, {
    method: "DELETE",
  });
}

/* ------------------------------------------------------------------ */
/*  Share link                                                         */
/* ------------------------------------------------------------------ */

export async function generateShareLink(
  surveyId: string
): Promise<ApiShareResponse> {
  return apiRequest<ApiShareResponse>(`/api/surveys/${surveyId}/share`, {
    method: "POST",
  });
}

/* ------------------------------------------------------------------ */
/*  Public / Hosted survey                                             */
/* ------------------------------------------------------------------ */

export async function getPublicSurvey(
  shareToken: string
): Promise<ApiSurvey> {
  return apiRequest<ApiSurvey>(`/s/${shareToken}`);
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
  return apiRequest<ApiSubmitResponse>(`/s/${shareToken}/submit`, {
    method: "POST",
    body: {
      respondent_id: respondentId ?? null,
      metadata_: null,
      answers,
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Collectors                                                         */
/* ------------------------------------------------------------------ */

export async function generateCollectorLink(
  surveyId: string
): Promise<ApiCollector> {
  return apiRequest<ApiCollector>(
    `/api/surveys/${surveyId}/generate-link`,
    { method: "POST" }
  );
}

export async function getCollectors(
  surveyId: string
): Promise<ApiCollectorList> {
  return apiRequest<ApiCollectorList>(
    `/api/surveys/${surveyId}/collectors`
  );
}

export async function getResponseCount(
  surveyId: string
): Promise<ApiResponseCount> {
  return apiRequest<ApiResponseCount>(
    `/api/surveys/${surveyId}/responses/count`
  );
}

/* ------------------------------------------------------------------ */
/*  Responses (creator analytics)                                      */
/* ------------------------------------------------------------------ */

export async function getResponses(
  surveyId: string
): Promise<ApiResponseList> {
  return apiRequest<ApiResponseList>(
    `/api/surveys/${surveyId}/responses`
  );
}

