import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const getOptionStyle = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#FF6B35]';
    }
    if (option === questions[currentQuestion].correctAnswer) {
      return 'bg-white border-2 border-green-500 text-green-600';
    }
    if (option === selectedAnswer && option !== questions[currentQuestion].correctAnswer) {
      return 'bg-white border-2 border-red-500 text-red-600';
    }
    return 'bg-white border-2 border-gray-200 text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-lg font-medium text-gray-700">
            Score: {score}
          </span>
        </div>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-medium text-gray-700 mb-6"
        >
          {questions[currentQuestion].question}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all
              ${!selectedAnswer 
                ? 'bg-white hover:bg-[#ebfdf1] text-[#1f4b43] border-2 border-gray-100' 
                : option === questions[currentQuestion].correctAnswer
                  ? 'bg-white border-2 border-green-500 text-green-600'
                  : option === selectedAnswer
                    ? 'bg-white border-2 border-red-500 text-red-600'
                    : 'bg-gray-100 text-gray-400'
              }`}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                {selectedAnswer && (
                  option === questions[currentQuestion].correctAnswer ? '✓' : 
                  option === selectedAnswer ? '×' : ''
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};