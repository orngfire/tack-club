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

export type ViewType = 'calendar' | 'all' | 'announcements';