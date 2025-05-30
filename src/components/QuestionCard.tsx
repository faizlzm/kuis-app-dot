import React, { useMemo } from 'react';
import { Question } from '@/types/quiz';
import { decodeHtml } from '@/utils/decodeHtml';
import { shuffleArray } from '@/utils/shuffleArray';
import Card from './ui/Card';
import Button from './ui/Button';

interface QuestionCardProps {
  question: Question;
  onAnswerSelect: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswerSelect }) => {
  const shuffledAnswers = useMemo(() => {
    return shuffleArray([...question.incorrect_answers, question.correct_answer]);
  }, [question]);

  return (
    <Card>
      <div className="mb-8">
        <div className="text-sm text-indigo-600 font-medium mb-2">
          {decodeHtml(question.category)} • {question.difficulty}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
          {decodeHtml(question.question)}
        </h2>
      </div>
      
      <div className="space-y-4">
        {shuffledAnswers.map((answer, index) => (
          <Button
            key={answer}
            onClick={() => onAnswerSelect(answer)}
            variant="secondary" // atau style lain yang sesuai untuk pilihan jawaban
            fullWidth
            className="text-left !bg-gray-50 hover:!bg-indigo-50 !border-2 !border-transparent hover:!border-indigo-200 !text-gray-800 !font-medium p-4"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-4 font-medium">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-gray-800 font-medium">
                {decodeHtml(answer)}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuestionCard;