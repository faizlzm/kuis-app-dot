export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizState {
  questions: Question[];
  answers: (string | null)[];
  currentQuestionIndex: number;
  isFinished: boolean;
}

export interface Results {
  correct: number;
  wrong: number;
  answered: number;
  total: number;
  score: number;
}