import { Question } from '@/types/quiz';

const API_URL = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

interface ApiResponse {
  response_code: number;
  results: Question[];
}

export const fetchTriviaQuestions = async (): Promise<Question[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Gagal mengambil data soal dari server.');
  }
  const data: ApiResponse = await response.json();

  if (data.response_code !== 0) {
    throw new Error('Gagal memuat soal (API response code error).');
  }
  return data.results;
};