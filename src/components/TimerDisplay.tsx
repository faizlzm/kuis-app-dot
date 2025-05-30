import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '@/utils/formatTime';

interface TimerDisplayProps {
  timeLeft: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => {
  return (
    <div className="flex items-center text-gray-600">
      <Clock className="w-5 h-5 mr-2" />
      <span className="font-medium">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default TimerDisplay;