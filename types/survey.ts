/* ------------------------------------------------------------------ */
/*  Local (in-builder) types – kept for backward compat               */
/* ------------------------------------------------------------------ */

export interface SavedQuestionData {
  text: string;
  type: string;
  answerChoices: string[];
}

export interface SurveyQuestion {
  id: string;
  savedData: SavedQuestionData | null;
  /** Backend question id – set after persisting */
  backendId?: string;
}

/* ------------------------------------------------------------------ */
/*  API response types – mirrors backend Pydantic schemas              */
/* ------------------------------------------------------------------ */

export interface ApiOption {
  id: string;
  question_id: string;
  label: string;
  value: string | null;
  order_index: number;
}

export interface ApiQuestion {
  id: string;
  survey_id: string;
  type: string;
  title: string;
  description: string | null;
  required: boolean;
  order_index: number;
  options: ApiOption[];
}

export interface ApiSurvey {
  id: string;
  title: string;
  description: string | null;
  share_token: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  questions: ApiQuestion[];
}

export interface ApiShareResponse {
  share_token: string;
  share_url: string;
}

export interface ApiSubmitResponse {
  id: string;
  submitted_at: string;
  respondent_id: string | null;
  answers: {
    id: string;
    question_id: string;
    answer_text: string | null;
    selected_option_id: string | null;
    value_json: unknown;
  }[];
}
