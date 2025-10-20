import React, { useState, useRef, useEffect } from 'react';
import { AUTHORS, getAuthorColor } from '../constants/authors';

interface AuthorDropdownProps {
  value: string;
  onChange: (author: string) => void;
  placeholder?: string;
}

const AuthorDropdown: React.FC<AuthorDropdownProps> = ({
  value,
  onChange,
  placeholder = "작성자를 선택하세요"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
          text-left text-white focus:outline-none focus:border-white/40
          focus:bg-white/15 transition-all duration-200
          ${value ? '' : 'text-white/50'}
          hover:bg-white/15
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {value && (
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getAuthorColor(value)}`} />
            )}
            <span>{value || placeholder}</span>
          </div>
          <svg
            className={`w-4 h-4 text-white/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 glass-card rounded-xl border border-white/20 overflow-hidden animate-fade-in">
          <div className="py-1 max-h-60 overflow-y-auto">
            {AUTHORS.map((author) => (
              <button
                key={author}
                type="button"
                onClick={() => {
                  onChange(author);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left transition-all duration-150
                  hover:bg-white/20 flex items-center gap-3
                  ${value === author ? 'bg-white/15 text-white' : 'text-white/80'}
                `}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getAuthorColor(author)}
                  flex items-center justify-center text-white text-sm font-medium shadow-sm`}>
                  {author[0]}
                </div>
                <span className="font-medium">{author}</span>
                {value === author && (
                  <svg
                    className="w-4 h-4 ml-auto text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDropdown;