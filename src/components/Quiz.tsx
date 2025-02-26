import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';
import { saveAnsweredQuestion } from '../lib/firestore';
import { auth } from '../lib/firebase';

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
  currentQuiz: {
    subject: string;
    grade: string;
  };
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, currentQuiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Add error handling for empty or invalid questions
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <p className="text-center text-red-600">No questions available. Please try again.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Add validation for current question
  if (!currentQuestion || !currentQuestion.options || !currentQuestion.correctAnswer) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <p className="text-center text-red-600">Invalid question format. Please try again.</p>
      </div>
    );
  }

  const handleAnswer = async (answer: string) => {
    if (isAnswered) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Save the answered question to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await saveAnsweredQuestion(
          user.uid,
          currentQuestion.question,
          currentQuiz.subject,
          currentQuiz.grade,
          isCorrect
        );
      } catch (error) {
        console.error('Error saving answered question:', error);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(score);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#FF6B35]';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-white border-2 border-green-500 text-green-600';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
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
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-lg font-medium text-gray-700">
            Score: {score}
          </span>
        </div>
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-medium text-gray-700 mb-6"
        >
          {currentQuestion.question}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all
              ${!selectedAnswer 
                ? 'bg-white hover:bg-[#ebfdf1] text-[#1f4b43] border-2 border-gray-100' 
                : option === currentQuestion.correctAnswer
                  ? 'bg-white border-2 border-green-500 text-green-600'
                  : option === selectedAnswer
                    ? 'bg-white border-2 border-red-500 text-red-600'
                    : 'bg-gray-100 text-gray-400'
              }`}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {isAnswered && (
                <div className="w-6 h-6 flex items-center justify-center">
                  {option === currentQuestion.correctAnswer ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : option === selectedAnswer ? (
                    <XCircle className="text-red-500" size={24} />
                  ) : null}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full mt-6 bg-[#FF6B35] text-white py-3 rounded-xl hover:bg-[#FF8B35] transition-colors font-medium"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
        </motion.button>
      )}
    </motion.div>
  );
};