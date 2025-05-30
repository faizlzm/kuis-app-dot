import React, { useState } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface LoginFormProps {
  onLogin: (username: string) => void;
  onStartQuiz: () => void;
  currentUsername: string; 
  setCurrentUsername: (name: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onStartQuiz, currentUsername, setCurrentUsername }) => {
  const [localUsername, setLocalUsername] = useState(currentUsername);

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (localUsername.trim()) {
      onLogin(localUsername);
      onStartQuiz();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUsername(e.target.value);
    setCurrentUsername(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kuis App</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label="Nama User"
              type="text"
              value={localUsername}
              onChange={handleInputChange}
              placeholder="Masukkan nama Anda"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && localUsername.trim()) {
                  handleSubmit(e);
                }
              }}
              aria-label="Nama Pengguna"
            />
          </div>
          
          <Button type="submit" fullWidth disabled={!localUsername.trim()}>
            Mulai Kuis
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;