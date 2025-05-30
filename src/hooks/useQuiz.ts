import { useState, useCallback, useEffect } from 'react';
import { QuizState, Results } from '@/types/quiz';
import { fetchTriviaQuestions } from '@/services/triviaService';

const INITIAL_QUIZ_STATE: QuizState = {
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  isFinished: false,
};

const QUIZ_DURATION = 300;

export const useQuiz = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0 && !quizState.isFinished) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            setQuizState(s => ({ ...s, isFinished: true }));
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !quizState.isFinished) {
        setQuizState(s => ({ ...s, isFinished: true }));
        setIsTimerRunning(false);
    }
  }, [isTimerRunning, timeLeft, quizState.isFinished]);


  const loadQuestions = useCallback(async () => {
    if (!username.trim()) {
        setError("Nama pengguna tidak boleh kosong.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const questions = await fetchTriviaQuestions();
      setQuizState({
        questions,
        answers: new Array(questions.length).fill(null),
        currentQuestionIndex: 0,
        isFinished: false,
      });
      setTimeLeft(QUIZ_DURATION);
      setIsTimerRunning(true);
      setIsLoggedIn(true); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'error di useQuiz');
      setIsTimerRunning(false);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleLogin = useCallback((name: string) => {
    if (name.trim()) {
        setUsername(name);
    } else {
        setError("Nama pengguna tidak boleh kosong.");
    }
  }, []);

  const startQuiz = useCallback(() => {
    if (username.trim()) {
        loadQuestions();
    } else {
        setError("Silakan masukkan nama pengguna terlebih dahulu.");
    }
  }, [username, loadQuestions]);


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
  }, []);

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
    setQuizState(INITIAL_QUIZ_STATE);
    setTimeLeft(QUIZ_DURATION);
    setIsTimerRunning(false);
    setError(null);
    setLoading(false);
  }, []);
  
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

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