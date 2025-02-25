import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trophy, Clock } from 'lucide-react';
import { QuizConfig } from '../types';

interface DashboardProps {
  onStartNewQuiz: () => void;
  quizHistory: {
    date: string;
    subject: string;
    grade: string;
    score: number;
    totalQuestions: number;
  }[];
  isLoading?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartNewQuiz, quizHistory, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1f4b43] mb-4"></div>
          <p className="text-xl text-white">Loading your quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] mx-auto p-4 md:p-6">
      {/* Start New Quiz Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <button
          onClick={onStartNewQuiz}
          className="text-[#1f4b43] font-medium flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-lg">Start New Quiz</span>
        </button>
      </div>

      {/* Quiz History */}
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-[#1f4b43]">Quiz History</h2>
          <span className="text-sm text-gray-500">
            Total Quizzes: {quizHistory.length}
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Date</th>
                <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Grade</th>
                <th className="text-left py-3 px-4 text-[#1f4b43] font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.slice(0, 10).map((quiz, index) => (
                <tr 
                  key={index} 
                  className="border-t border-gray-100"
                >
                  <td className="py-3 px-4 text-gray-600">{quiz.date}</td>
                  <td className="py-3 px-4 text-gray-600">{quiz.subject}</td>
                  <td className="py-3 px-4 text-gray-600">{quiz.grade}</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`font-medium ${
                        Math.round((quiz.score / quiz.totalQuestions) * 100) >= 50
                          ? 'text-[#1f4b43]'
                          : 'text-red-500'
                      }`}
                    >
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {quizHistory.length === 0 && (
        <div className="text-center text-white mt-8">
          <p className="text-xl">No quizzes taken yet</p>
          <p className="mt-2">Start your first quiz to begin learning!</p>
        </div>
      )}
    </div>
  );
}; 