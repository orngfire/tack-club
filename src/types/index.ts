export interface DiaryEntry {
  id: string;
  author: string;
  content: string;
  date: string;
  timestamp: number;
  reactions: {
    악: string[];  // Array of user IDs who reacted
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface HappinessPost {
  id: string;
  author: string;
  content: string;
  imageUrl?: string;  // Optional image URL
  timestamp: number;  // Unix timestamp for KST display
  likes: string[];    // Array of user IDs who liked
  comments: Comment[]; // Array of comments
}

export type ViewType = 'calendar' | 'all' | 'announcements' | 'stats';