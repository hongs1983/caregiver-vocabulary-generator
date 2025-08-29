import React, { useState, useCallback } from 'react';
import type { VocabularyEntry } from './types';
import { generateVocabulary } from './services/geminiService';
import IdeaInputForm from './components/IdeaInputForm';
import VocabularyTable from './components/VocabularyTable';
import LoadingSpinner from './components/LoadingSpinner';
import BookIcon from './components/icons/BookIcon';

const App: React.FC = () => {
  const [terms, setTerms] = useState<string>('');
  const [vocabularyList, setVocabularyList] = useState<VocabularyEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!terms.trim()) {
      setError('Please enter Korean terms first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVocabularyList([]);

    try {
      const result = await generateVocabulary(terms);
      setVocabularyList(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate vocabulary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [terms]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/50 p-3 rounded-full mb-4">
            <BookIcon className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            요양보호사 외국어 단어장 생성기
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            요양보호사를 위한 한국어-베트남어 필수 단어 및 설명을 생성합니다.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <IdeaInputForm
            idea={terms}
            onIdeaChange={setTerms}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="mt-8 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">단어장을 생성하는 중입니다...</p>
          </div>
        )}

        {vocabularyList.length > 0 && !isLoading && (
          <div className="mt-8">
            <VocabularyTable vocabularyList={vocabularyList} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;