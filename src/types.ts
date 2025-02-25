export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizConfig {
  grade: string;
  subject: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizHistory {
  date: string;
  subject: string;
  grade: string;
  score: number;
  totalQuestions: number;
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