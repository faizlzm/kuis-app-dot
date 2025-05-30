import { useState, useCallback, useEffect } from 'react';
import { QuizState, Results } from '@/types/quiz';
import { fetchTriviaQuestions } from '@/services/triviaService';
import { useLocalStorage } from './useLocalStorage';

const getInitialQuizState = (): QuizState => ({
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  isFinished: false,
});

const QUIZ_DURATION = 300;

export const useQuiz = () => {
  const [username, setUsername] = useLocalStorage<string>('quizUsername', '');
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('quizIsLoggedIn', false);
  const [quizState, setQuizState] = useLocalStorage<QuizState>('quizState', getInitialQuizState());
  const [timeLeft, setTimeLeft] = useLocalStorage<number>('quizTimeLeft', QUIZ_DURATION);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isLoggedIn && quizState.questions.length > 0 && !quizState.isFinished && timeLeft > 0) {
      setIsTimerRunning(true);
    } else if (quizState.isFinished || timeLeft <= 0) {
      setIsTimerRunning(false);
      if (timeLeft <= 0 && !quizState.isFinished) {
        setQuizState(s => ({ ...s, isFinished: true }));
      }
    } else if (!isLoggedIn) {
       setIsTimerRunning(false);
    }
  }, [isLoggedIn, quizState.isFinished, quizState.questions.length, timeLeft, setQuizState]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && !quizState.isFinished) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            setQuizState(s => ({ ...s, isFinished: true }));
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [isTimerRunning, timeLeft, quizState.isFinished, setQuizState, setTimeLeft]);

  const fetchAndSetNewQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newQuestions = await fetchTriviaQuestions();
      setQuizState({
        questions: newQuestions,
        answers: new Array(newQuestions.length).fill(null),
        currentQuestionIndex: 0,
        isFinished: false,
      }); 
      setTimeLeft(QUIZ_DURATION); 
      setIsTimerRunning(true); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat soal.');
      setIsTimerRunning(false);
    } finally {
      setLoading(false);
    }
  }, [setQuizState, setTimeLeft]);

  const handleLogin = useCallback((name: string) => {
    if (name.trim()) {
      setUsername(name);
      setIsLoggedIn(true); 
    } else {
      setError("Nama pengguna tidak boleh kosong.");
    }
  }, [setUsername, setIsLoggedIn]);

  const startQuiz = useCallback(() => {
    if (!username.trim()) {
      setError("Silakan masukkan nama pengguna terlebih dahulu.");
      return;
    }
    fetchAndSetNewQuestions();
  }, [username, fetchAndSetNewQuestions]);

  const handleAnswerSelect = useCallback((answer: string) => {
    setQuizState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answer;
      
      const isLastQuestion = prev.currentQuestionIndex === prev.questions.length - 1;
      
      if (isLastQuestion) {
        setIsTimerRunning(false);
        return {
          ...prev,
          answers: newAnswers,
          isFinished: true,
        };
      }
      
      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      };
    }); 
  }, [setQuizState]);

  const calculateResults = useCallback((): Results => {
    const correctAnswersCount = quizState.answers.filter((answer, index) => 
      quizState.questions[index] && answer === quizState.questions[index].correct_answer
    ).length;
    
    const totalAnswered = quizState.answers.filter(answer => answer !== null).length;
    const totalQuestions = quizState.questions.length;

    return {
      correct: correctAnswersCount,
      wrong: totalAnswered - correctAnswersCount,
      answered: totalAnswered,
      total: totalQuestions,
      score: totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0,
    };
  }, [quizState.answers, quizState.questions]);

  const resetQuiz = useCallback(() => {
    setUsername('');
    setIsLoggedIn(false); 
    setQuizState(getInitialQuizState()); 
    setTimeLeft(QUIZ_DURATION); 
    setIsTimerRunning(false);
    setError(null);
    setLoading(false);
  }, [setUsername, setIsLoggedIn, setQuizState, setTimeLeft]);
  
  const currentQuestion = quizState.questions.length > 0 && quizState.currentQuestionIndex < quizState.questions.length
    ? quizState.questions[quizState.currentQuestionIndex]
    : null;

  return {
    username,
    setUsername,
    isLoggedIn,
    quizState,
    loading,
    error,
    timeLeft,
    isTimerRunning,
    loadQuestions: startQuiz,
    handleLogin,
    handleAnswerSelect,
    calculateResults,
    resetQuiz,
    currentQuestion,
    setError,
  };
};