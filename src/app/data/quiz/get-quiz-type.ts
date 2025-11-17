import "server-only";

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestionTypeType =
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER";

export type ChoiceType = {
  id: string;
  text: string;
  isCorrect: boolean;
  imageKey?: string;
};
