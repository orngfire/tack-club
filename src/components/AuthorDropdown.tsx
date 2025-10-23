import React, { useState, useRef, useEffect } from 'react';
import { AUTHORS, getAuthorColor } from '../constants/authors';
import { getInitials, getAvatarColor, getAvatarImage } from '../utils/avatarHelpers';

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
          w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg
          text-left text-gray-700 focus:outline-none focus:border-primary focus:bg-white
          transition-all duration-200 text-sm
          ${value ? '' : 'text-gray-400'}
          hover:bg-white hover:border-gray-300
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {value && (
              <div className={`w-6 h-6 rounded-full ${getAvatarColor(value)} flex items-center justify-center shadow-sm`}>
                {getAvatarImage(value) ? (
                  <img
                    src={getAvatarImage(value)!}
                    alt={value}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-[10px]">
                    {getInitials(value)}
                  </span>
                )}
              </div>
            )}
            <span>{value || placeholder}</span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
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
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-gray-200 shadow-hover overflow-hidden animate-fade-in">
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
                  w-full px-3 py-2 text-left transition-all duration-150 text-sm
                  hover:bg-gray-50 flex items-center gap-2
                  ${value === author ? 'bg-primary-light text-primary' : 'text-gray-700'}
                `}
              >
                <div className={`w-6 h-6 rounded-full ${getAvatarColor(author)} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  {getAvatarImage(author) ? (
                    <img
                      src={getAvatarImage(author)!}
                      alt={author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-[10px]">
                      {getInitials(author)}
                    </span>
                  )}
                </div>
                <span className="font-medium">{author}</span>
                {value === author && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary"
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