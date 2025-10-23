import React, { useState, useEffect } from 'react';
import AuthorDropdown from './AuthorDropdown';
import { setOneSignalTag } from '../config/onesignal';

interface NewEntryFormProps {
  date: string;
  onSubmit: (author: string, content: string) => void;
  onCancel: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ date, onSubmit, onCancel }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // Load saved author name on mount
  useEffect(() => {
    const savedName = localStorage.getItem('myName');
    if (savedName) {
      setAuthor(savedName);
    }
  }, []);

  const handleAuthorChange = async (newAuthor: string) => {
    setAuthor(newAuthor);

    // Update localStorage and OneSignal tag if author changes
    if (newAuthor) {
      localStorage.setItem('myName', newAuthor);
      await setOneSignalTag('author', newAuthor);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author && content.trim()) {
      onSubmit(author, content.trim());
      // Don't clear author, keep it for next entry
      setContent('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-soft animate-slide-up">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <AuthorDropdown
            value={author}
            onChange={handleAuthorChange}
            placeholder="작성자"
          />
        </div>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 압정을 기록해주세요"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none h-24"
          />
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="submit"
            className="py-2 px-5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-all transform active:scale-[0.98]"
          >
            작성하기
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryForm;