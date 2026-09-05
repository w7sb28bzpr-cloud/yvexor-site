export type AssistantState = "IDLE" | "ANALYSING" | "RESULT" | "FOLLOW_UP" | "ERROR";

export type AssistantResult = {
  needSummary: string;
  possibleSolution: string;
  usefulFirstVersion: string;
  priorityFeatures: string[];
  budgetCategory: keyof typeof import("../data/budget-categories").publicBudgetRanges;
  budgetRange: string;
  variationFactors: string[];
  possibleServices: string[];
  nextQuestions: string[];
};
