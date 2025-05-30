import React from 'react';
import TimerDisplay from './TimerDisplay';
import ProgressBar from './ui/ProgressBar';
import Card from './ui/Card';

interface HeaderProps {
  username: string;
  timeLeft: number;
  currentQuestionNumber: number;
  totalQuestions: number;
}

const Header: React.FC<HeaderProps> = ({ username, timeLeft, currentQuestionNumber, totalQuestions }) => {
  const progressPercentage = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Kuis App</h1>
            <p className="text-gray-600">Halo, {username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <TimerDisplay timeLeft={timeLeft} />
          <div className="text-gray-600">
            <span className="font-medium">
              {currentQuestionNumber} / {totalQuestions}
            </span>
          </div>
        </div>
      </div>
      
      {totalQuestions > 0 && (
        <div className="mt-4">
          <ProgressBar value={progressPercentage} />
        </div>
      )}
    </Card>
  );
};

export default Header;