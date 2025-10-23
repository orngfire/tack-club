// 작성자별 고유 색상 정의
const AUTHOR_COLORS: Record<string, string> = {
  '응곤': 'bg-gradient-to-br from-blue-400 to-blue-600',
  '민성': 'bg-gradient-to-br from-green-400 to-green-600',
  '성현': 'bg-gradient-to-br from-purple-400 to-purple-600',
  '한준': 'bg-gradient-to-br from-orange-400 to-orange-600',
  '이바': 'bg-gradient-to-br from-pink-400 to-pink-600',
  '예림': 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  '익명': 'bg-gradient-to-br from-gray-400 to-gray-600'
};

// 작성자 이름에서 이니셜 추출
export const getInitials = (name: string): string => {
  // 한글 이름의 경우 첫 글자만
  if (/[가-힣]/.test(name)) {
    return name.charAt(0);
  }
  // 영문 이름의 경우 첫 두 글자
  return name.slice(0, 2).toUpperCase();
};

// 작성자별 아바타 색상 가져오기
export const getAvatarColor = (author: string): string => {
  return AUTHOR_COLORS[author] || AUTHOR_COLORS['익명'];
};

// 작성자별 아바타 이미지 URL
const AUTHOR_IMAGES: Record<string, string> = {
  '응곤': '/images/avatars/eungkon.png',
  '민성': '/images/avatars/minsung.png',
  '성현': '/images/avatars/sunghyun.png',
  '한준': '/images/avatars/hanjun.png',
  '이바': '/images/avatars/eva.png',
  '예림': '/images/avatars/yelim.png'
};

export const getAvatarImage = (author: string): string | null => {
  return AUTHOR_IMAGES[author] || null;
};