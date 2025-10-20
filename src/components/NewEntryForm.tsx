import React, { useState } from 'react';
import AuthorDropdown from './AuthorDropdown';

interface NewEntryFormProps {
  date: string;
  onSubmit: (author: string, content: string) => void;
  onCancel: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ date, onSubmit, onCancel }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (author && content.trim()) {
      onSubmit(author, content.trim());
      setAuthor('');
      setContent('');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 mb-3 animate-slide-in">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <AuthorDropdown
            value={author}
            onChange={setAuthor}
            placeholder="작성자를 선택하세요"
          />
        </div>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 압정을 기록해주세요..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none h-24"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            작성하기
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-all"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryForm;