import React from 'react';
import { Brain, GraduationCap, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuizConfig } from '../types';

interface QuizSetupProps {
  onStart: (config: QuizConfig) => void;
  isLoading?: boolean;
}

const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
const grades = ['1st', '2nd', '3rd', '4th', '5th'];

export const QuizSetup: React.FC<QuizSetupProps> = ({ onStart, isLoading = false }) => {
  const [grade, setGrade] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [numberOfQuestions, setNumberOfQuestions] = React.useState(5);
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ grade, subject, numberOfQuestions, difficulty });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[900px] mx-auto p-4 md:p-6"
    >
      <div className="bg-white rounded-3xl shadow-lg p-6 w-full">
        <h2 className="text-[#111] text-2xl font-bold mb-6">Quiz Setup</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-lg font-medium text-gray-700">
              <GraduationCap className="mr-2 text-[#FF6B35]" />
              What grade are you in?
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="w-full p-3 bg-[#f6f6f6] text-[#111] border-2 border-[#e8e8e8] rounded-xl 
              focus:border-[#1f4b43] focus:ring focus:ring-[#1f4b43]/20 transition-all"
            >
              <option value="">Choose your grade</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g} Grade</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-lg font-medium text-gray-700">
              <Brain className="mr-2 text-[#FF6B35]" />
              What would you like to learn?
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full p-3 bg-[#f6f6f6] text-[#111] border-2 border-[#e8e8e8] rounded-xl 
              focus:border-[#1f4b43] focus:ring focus:ring-[#1f4b43]/20 transition-all"
            >
              <option value="">Pick a subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-lg font-medium text-gray-700">
              <Hash className="mr-2 text-[#FF6B35]" />
              How many questions would you like?
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center text-gray-700 font-bold">{numberOfQuestions} questions</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
                  className={`py-2 px-4 rounded-lg text-sm font-medium capitalize
                    ${difficulty === level
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-[#FF6B35] text-white rounded-xl text-xl font-bold 
            shadow-[0_6px_0_rgb(200,65,20)] 
            active:shadow-[0_2px_0_rgb(200,65,20)]
            active:translate-y-[4px]
            transition-all
            hover:brightness-110
            disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing Questions...
              </div>
            ) : (
              "Start Learning! 🚀"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};