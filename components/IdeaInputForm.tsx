import React from 'react';

interface IdeaInputFormProps {
  idea: string;
  onIdeaChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ idea: terms, onIdeaChange: onTermsChange, onGenerate, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="korean-terms" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        한국어 단어 입력 (쉼표 또는 줄바꿈으로 구분)
      </label>
      <textarea
        id="korean-terms"
        value={terms}
        onChange={(e) => onTermsChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="예: 65세 이상, 노인장기요양보험, 식사 도움..."
        className="w-full h-32 p-4 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        aria-label="Enter Korean terms for vocabulary generation"
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !terms.trim()}
        className="w-full md:w-auto self-end px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
        aria-live="polite"
      >
        {isLoading ? '생성 중...' : '단어장 생성'}
      </button>
    </div>
  );
};

export default IdeaInputForm;
