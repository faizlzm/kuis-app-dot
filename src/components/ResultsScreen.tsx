import React from 'react';
import { BarChart3, CheckCircle, XCircle } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Results } from '@/types/quiz';

interface ResultsScreenProps {
  results: Results;
  username: string;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, username, onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hasil Kuis</h1>
          <p className="text-gray-600">Selamat {username}!</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Jawaban Benar</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{results.correct}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">Jawaban Salah</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{results.wrong}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800">Total Dijawab</span>
            <span className="text-2xl font-bold text-gray-600">{results.answered}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
            <span className="font-medium text-indigo-800">Skor</span>
            <span className="text-2xl font-bold text-indigo-600">
              {results.score}
            </span>
          </div>
        </div>
        
        <Button onClick={onRestart} fullWidth>
          Mulai Kuis Baru
        </Button>
      </Card>
    </div>
  );
};

export default ResultsScreen;