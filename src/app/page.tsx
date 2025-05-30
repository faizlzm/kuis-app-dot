"use client";

import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import LoginForm from '@/components/LoginForm';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import ResultsScreen from '@/components/ResultsScreen';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function QuizPage() {
  const {
    username,
    setUsername,
    isLoggedIn,
    quizState,
    loading,
    error,
    timeLeft,
    loadQuestions,
    handleLogin,
    handleAnswerSelect,
    calculateResults,
    resetQuiz,
    currentQuestion,
    setError,
  } = useQuiz();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <LoadingSpinner message="Menyiapkan aplikasi..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Memuat soal..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              if (isLoggedIn) {
                loadQuestions();
              }
            }}
            variant="primary"
          >
            Coba Lagi
          </Button>
          {isLoggedIn && (
             <Button onClick={() => { resetQuiz(); setError(null); }} variant="secondary" className="mt-2">
                Kembali ke Login
             </Button>
          )}
        </Card>
      </div>
    );
  }

  if (!isLoggedIn || (quizState.questions.length === 0 && !quizState.isFinished)) {
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onStartQuiz={loadQuestions}
        currentUsername={username}
        setCurrentUsername={setUsername}
      />
    );
  }

  if (quizState.isFinished) {
    return (
      <ResultsScreen
        results={calculateResults()}
        username={username}
        onRestart={resetQuiz}
      />
    );
  }

  if (!currentQuestion) {
    return <LoadingSpinner message="Menyiapkan pertanyaan..." />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Header
          username={username}
          timeLeft={timeLeft}
          currentQuestionNumber={quizState.currentQuestionIndex + 1}
          totalQuestions={quizState.questions.length}
        />
        <QuestionCard
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>
    </div>
  );
}