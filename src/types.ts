export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizConfig {
  subject: string;
  grade: string;
  difficulty: string;
  numberOfQuestions: number;
}

export interface QuizHistory {
  date: string;
  subject: string;
  grade: string;
  score: number;
  totalQuestions: number;
}

export interface AnsweredQuestion {
  id: string;
  question: string;
  subject: string;
  grade: string;
  isCorrect: boolean;
  timestamp: string;
}

// Add this to store used questions
export interface QuestionBank {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  subject: string;
  grade: string;
  usedBy: string[]; // array of userIds who have seen this question
}