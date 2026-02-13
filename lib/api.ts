/**
 * Centralized API helper for SurveyMonkey frontend.
 * Uses NEXT_PUBLIC_API_URL for the backend base URL.
 * Compatible with Next.js App Router (client and server components).
 */

const DEFAULT_API_BASE = "https://surveymonkey-backend-production.up.railway.app";

/**
 * Returns the API base URL. Uses NEXT_PUBLIC_API_URL when set.
 * In production (Vercel), set NEXT_PUBLIC_API_URL in environment variables.
 * For local dev with a different backend, set it in .env.local.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE;
}

/**
 * Builds a full API URL for the given path.
 * Path should start with / (e.g. "/api/surveys").
 */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/** Thrown when an API request fails (network, 4xx, 5xx). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Centralized fetch wrapper. Handles base URL, JSON, and errors.
 * @param path - API path (e.g. "/api/surveys")
 * @param options - fetch options; body will be JSON-stringified if object
 * @returns Parsed JSON response
 * @throws ApiError on network failure, 4xx, or 5xx
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, headers = {}, ...rest } = options;
  const url = apiUrl(path);

  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body !== undefined && body !== null) {
    fetchOptions.body =
      typeof body === "string" ? body : JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network request failed";
    throw new ApiError(`API request failed: ${message}`);
  }

  const responseText = await res.text();

  if (!res.ok) {
    throw new ApiError(
      `API ${res.status}: ${responseText || res.statusText}`,
      res.status,
      responseText
    );
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new ApiError("Invalid JSON response", res.status, responseText);
  }
}

/* ------------------------------------------------------------------ */
/*  Predict answer type (Answer Genius)                                */
/* ------------------------------------------------------------------ */

export type PredictableType =
  | "Single text box"
  | "Multiple choice"
  | "Checkboxes";

export interface PredictAnswerTypeResponse {
  answer_type: PredictableType | null;
}

/**
 * Calls the backend to predict answer type from question text.
 * Returns the suggested type or null. Throws ApiError on failure.
 */
export async function predictAnswerTypeApi(
  questionText: string
): Promise<PredictableType | null> {
  const data = await apiRequest<PredictAnswerTypeResponse>(
    "/api/predict-answer-type",
    {
      method: "POST",
      body: { question_text: questionText.trim() },
    }
  );
  return data.answer_type ?? null;
}
