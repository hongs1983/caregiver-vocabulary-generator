import React from 'react';
import type { VocabularyEntry } from '../types';

interface VocabularyTableProps {
  vocabularyList: VocabularyEntry[];
}

const VocabularyTable: React.FC<VocabularyTableProps> = ({ vocabularyList }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                한국어 단어
              </th>
              <th scope="col" className="px-6 py-3">
                베트남어 단어 (품사)
              </th>
              <th scope="col" className="px-6 py-3">
                설명 (베트남어 / 한국어)
              </th>
            </tr>
          </thead>
          <tbody>
            {vocabularyList.map((entry, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {entry.koreanWord}
                </th>
                <td className="px-6 py-4">
                  {entry.vietnameseWord} <span className="text-gray-400 italic">[{entry.vietnamesePOS}]</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-blue-600 dark:text-blue-400">{entry.vietnameseExplanation}</p>
                  <p className="mt-1 text-green-600 dark:text-green-400">{entry.koreanExplanation}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VocabularyTable;
