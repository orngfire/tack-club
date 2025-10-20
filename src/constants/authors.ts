export const AUTHORS = [
  '응곤',
  '민성',
  '성현',
  '한준',
  '이바',
  '예림'
] as const;

export type Author = typeof AUTHORS[number];

export const getAuthorColor = (author: string): string => {
  const colors = {
    '응곤': 'from-blue-400 to-cyan-400',
    '민성': 'from-green-400 to-emerald-400',
    '성현': 'from-purple-400 to-pink-400',
    '한준': 'from-orange-400 to-red-400',
    '이바': 'from-yellow-400 to-amber-400',
    '예림': 'from-indigo-400 to-purple-400'
  };
  return colors[author as Author] || 'from-gray-400 to-gray-500';
};