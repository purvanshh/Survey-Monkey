export interface SavedQuestionData {
  text: string;
  type: string;
  answerChoices: string[];
}

export interface SurveyQuestion {
  id: string;
  savedData: SavedQuestionData | null;
}
