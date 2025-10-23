import React, { useState, useRef } from 'react';
import { HappinessPost, Comment } from '../types';
import { getAuthorColor } from '../constants/authors';

interface HappinessArchiveProps {
  posts: HappinessPost[];
  currentUserId: string;
  onAddPost: (post: Omit<HappinessPost, 'id'>) => void;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: Omit<Comment, 'id'>) => void;
}

const HappinessArchive: React.FC<HappinessArchiveProps> = ({
  posts,
  currentUserId,
  onAddPost,
  onLike,
  onAddComment
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentForms, setCommentForms] = useState<Record<string, { content: string; show: boolean }>>({});

  // Format timestamp to KST
  const formatKSTTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return formatKSTTime(timestamp);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || imagePreview) {
      const newPost: any = {
        author: '익명', // Default anonymous author
        content: content.trim(),
        timestamp: Date.now(),
        likes: [],
        comments: []
      };

      // Only add imageUrl if there's an image
      if (imagePreview) {
        newPost.imageUrl = imagePreview;
      }

      onAddPost(newPost);
      // Reset form
      setContent('');
      setImagePreview(null);
      setShowUploadForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setShowUploadForm(false);
    setContent('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const form = commentForms[postId];
    if (form && form.content.trim()) {
      onAddComment(postId, {
        author: '익명',
        content: form.content.trim(),
        timestamp: Date.now()
      });
      setCommentForms({
        ...commentForms,
        [postId]: { content: '', show: false }
      });
    }
  };

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex-1 flex flex-col h-screen max-w-full md:max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-2.5 sm:p-4 md:p-6 mb-2 sm:mb-4 md:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            행복 아카이브
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium">
            행복이란 무엇일까?
          </p>
        </div>
      </div>

      {/* Upload Button */}
      {!showUploadForm && (
        <button
          onClick={() => setShowUploadForm(true)}
          className="w-full mb-3 sm:mb-4 md:mb-6 p-3 sm:p-3.5 md:p-4 bg-white rounded-xl hover:bg-primary-light transition-all group"
          style={{
            border: '1.5px dashed #d1d5db'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#E91E63';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        >
          <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-primary">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="font-medium text-lg">행복 업로드하기</span>
          </div>
        </button>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-soft animate-slide-up">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="행복에 대하여"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none h-24"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 text-sm">사진 추가</span>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded-lg bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                type="submit"
                className="py-2 px-5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-all transform active:scale-[0.98]"
              >
                공유하기
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-5 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
        {sortedPosts.length > 0 ? (
          <div className="space-y-4 pb-4">
            {sortedPosts.map((post) => {
              // Ensure likes is an array
              const likes = post.likes || [];
              const hasLiked = likes.includes(currentUserId);
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-soft hover:shadow-hover transition-all"
                >
                  {/* Post Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm" title={formatKSTTime(post.timestamp)}>
                          {formatRelativeTime(post.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    {post.content && (
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  {post.imageUrl && (
                    <div className="px-4 pb-3">
                      <img
                        src={post.imageUrl}
                        alt="Happiness moment"
                        className="w-full rounded-lg object-contain max-h-96 bg-gray-50"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLike(post.id)}
                        className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                          transition-all duration-200 transform active:scale-95
                          ${hasLiked
                            ? 'bg-primary-light text-primary border border-primary/20'
                            : likes.length > 0
                              ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className={`text-base ${hasLiked ? 'animate-scale-in' : ''}`}>
                          📍
                        </span>
                        <span>악</span>
                        {likes.length > 0 && (
                          <span className="font-semibold text-xs">{likes.length}</span>
                        )}
                      </button>

                      <button
                        onClick={() => setCommentForms({
                          ...commentForms,
                          [post.id]: {
                            content: '',
                            show: !commentForms[post.id]?.show
                          }
                        })}
                        className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                          transition-all duration-200 transform active:scale-95
                          ${commentForms[post.id]?.show
                            ? 'bg-primary-light text-primary border border-primary/20'
                            : post.comments && post.comments.length > 0
                              ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="text-base">
                          💬
                        </span>
                        <span>댓글</span>
                        {post.comments && post.comments.length > 0 && (
                          <span className="font-semibold text-xs">{post.comments.length}</span>
                        )}
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="space-y-2">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex gap-2">
                              <span className="font-medium text-xs text-gray-900">{comment.author}:</span>
                              <span className="text-xs text-gray-700 flex-1">{comment.content}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comment Form */}
                    {commentForms[post.id]?.show && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentForms[post.id]?.content || ''}
                            onChange={(e) => setCommentForms({
                              ...commentForms,
                              [post.id]: { ...commentForms[post.id], content: e.target.value }
                            })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleCommentSubmit(post.id);
                              }
                            }}
                            placeholder="익명으로 댓글을 입력하세요..."
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            게시
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">아직 행복의 기록이 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HappinessArchive;