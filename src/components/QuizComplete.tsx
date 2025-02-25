import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface QuizCompleteProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToDashboard: () => void;
}

// Custom animated trophy SVG
const AnimatedTrophy = () => (
  <motion.svg 
    initial={{ scale: 0.8 }}
    animate={{ 
      scale: [0.8, 1.1, 1],
      rotate: [0, -10, 10, 0]
    }}
    transition={{ 
      duration: 1,
      ease: "easeOut",
      times: [0, 0.5, 0.8, 1]
    }}
    className="w-16 h-16 mx-auto mb-6"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      d="M48 18V8H16v10c0 8.84 7.16 16 16 16s16-7.16 16-16z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
      d="M32 34v22M22 56h20"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
      d="M48 18h8v8c0 4.42-3.58 8-8 8M16 18H8v8c0 4.42 3.58 8 8 8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

export const QuizComplete: React.FC<QuizCompleteProps> = ({
  score,
  totalQuestions,
  onRestart,
  onBackToDashboard
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Trophy className="w-16 h-16 text-[#FF6B35]" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
        <p className="text-xl text-gray-600 mb-8">
          Your score: <span className="font-bold text-[#FF6B35]">{percentage}%</span>
          <br />
          ({score} out of {totalQuestions} correct)
        </p>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full py-3 px-6 bg-[#FF6B35] text-white rounded-xl font-bold
            shadow-[0_4px_0_rgb(200,65,20)] 
            active:shadow-[0_2px_0_rgb(200,65,20)]
            active:translate-y-[2px]
            transition-all
            hover:brightness-110
            flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Another Quiz
          </button>

          <button
            onClick={onBackToDashboard}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold
            shadow-[0_4px_0_rgb(200,200,200)] 
            active:shadow-[0_2px_0_rgb(200,200,200)]
            active:translate-y-[2px]
            transition-all
            hover:bg-gray-200
            flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};