import React, { useState, useEffect } from 'react';
import { QuizSetup } from './components/QuizSetup';
import { Quiz } from './components/Quiz';
import { QuizComplete } from './components/QuizComplete';
import { Question, QuizConfig } from './types';
import { Brain, AlertCircle } from 'lucide-react';
import { Auth } from './components/Auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getQuestions } from './utils/api';
import { Dashboard } from './components/Dashboard';
import { saveQuizResult, getQuizHistory } from './lib/firestore';

// Create a new component for the routed content
const AppContent: React.FC<{ user: User | null }> = ({ user }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showDashboard, setShowDashboard] = React.useState(true);
  const [quizHistory, setQuizHistory] = React.useState<{
    date: string;
    subject: string;
    grade: string;
    score: number;
    totalQuestions: number;
  }[]>([]);
  const [currentQuiz, setCurrentQuiz] = React.useState<QuizConfig | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = React.useState(false);
  const [completionLoading, setCompletionLoading] = React.useState(false);

  React.useEffect(() => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError('OpenAI API key not configured. Please add your API key to the .env file.');
    }
  }, []);

  // Load quiz history when user logs in
  React.useEffect(() => {
    const loadQuizHistory = async () => {
      if (user?.uid) {
        try {
          setIsDashboardLoading(true);
          const history = await getQuizHistory(user.uid);
          setQuizHistory(history);
        } catch (error) {
          console.error('Error loading quiz history:', error);
        } finally {
          setIsDashboardLoading(false);
        }
      }
    };

    loadQuizHistory();
  }, [user]);

  const handleStart = async (config: QuizConfig) => {
    try {
      console.log('Starting quiz with config:', config);
      setError(null);
      setLoading(true);
      setCurrentQuiz(config);
      const generatedQuestions = await getQuestions(
        user!.uid,
        config.subject,
        config.grade,
        config.difficulty,
        config.numberOfQuestions
      );
      console.log('Generated questions:', generatedQuestions);
      setQuestions(generatedQuestions);
      setQuizStarted(true);
      navigate('/quiz');
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (score: number) => {
    setCompletionLoading(true);
    setFinalScore(score);
    setQuizCompleted(true);
    navigate('/quiz-complete');
    
    if (!user?.uid) {
      console.error('No user ID found');
      setCompletionLoading(false);
      return;
    }
    
    if (!currentQuiz) {
      console.error('No current quiz config found');
      setCompletionLoading(false);
      return;
    }

    const quizResult = {
      date: new Date().toLocaleDateString(),
      subject: currentQuiz.subject,
      grade: currentQuiz.grade,
      score,
      totalQuestions: questions.length
    };

    try {
      await saveQuizResult(user.uid, quizResult);
      setQuizHistory(prev => [quizResult, ...prev]);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      setError('Failed to save quiz result. Please try again.');
    } finally {
      setCompletionLoading(false);
    }
  };

  const handleRestart = () => {
    setShowDashboard(false);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setFinalScore(0);
    setError(null);
    navigate('/quiz-setup');
  };

  const handleBackToDashboard = () => {
    setShowDashboard(true);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuestions([]);
    setFinalScore(0);
    setError(null);
    navigate('/dashboard');
  };

  if (!user) {
    return <Auth />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 text-center mb-6">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 mb-2">To fix this:</p>
            <ol className="list-decimal list-inside">
              <li>Create a <code className="bg-red-100 px-1 rounded">.env</code> file in the project root</li>
              <li>Add your OpenAI API key: <code className="bg-red-100 px-1 rounded">VITE_OPENAI_API_KEY=your_api_key_here</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f4b43] p-0">
      <Navbar onHome={handleBackToDashboard} />
      <div className="flex justify-center items-start min-h-[calc(100vh-80px)] pt-4 px-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                onStartNewQuiz={handleRestart} 
                quizHistory={quizHistory} 
                isLoading={isDashboardLoading}
              />
            } 
          />
          <Route 
            path="/quiz-setup" 
            element={<QuizSetup onStart={handleStart} isLoading={loading} />} 
          />
          <Route 
            path="/quiz" 
            element={
              loading ? (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                  <p className="text-xl text-gray-700">Preparing your questions...</p>
                </div>
              ) : quizStarted && !quizCompleted ? (
                <Quiz 
                  questions={questions} 
                  onComplete={handleComplete}
                  currentQuiz={currentQuiz!}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/quiz-complete" 
            element={
              completionLoading ? (
                <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                  <p className="text-xl text-gray-700">Saving your results...</p>
                </div>
              ) : quizCompleted ? (
                <QuizComplete
                  score={finalScore}
                  totalQuestions={questions.length}
                  onRestart={handleRestart}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

// Main App component just wraps the content with BrowserRouter
function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1f4b43] to-[#006466] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent user={user} />
    </BrowserRouter>
  );
}

export default App; 