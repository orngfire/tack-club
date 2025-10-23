import { database } from '../config/firebase';
import {
  ref,
  set,
  push,
  onValue,
  remove,
  update,
  off,
  DataSnapshot
} from 'firebase/database';
import { DiaryEntry, HappinessPost } from '../types';

// Database paths
const ENTRIES_PATH = 'entries';
const HAPPINESS_POSTS_PATH = 'happiness-posts';

// Diary Entries Operations
export const diaryEntriesService = {
  // Subscribe to entries changes
  subscribe(callback: (entries: DiaryEntry[]) => void) {
    const entriesRef = ref(database, ENTRIES_PATH);

    const unsubscribe = onValue(entriesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([id, entry]: [string, any]) => ({
          id,
          ...entry,
          // reactions가 없으면 빈 객체로 초기화
          reactions: entry.reactions || { 악: [] }
        }));
        // Sort by timestamp (newest first)
        entries.sort((a, b) => b.timestamp - a.timestamp);
        callback(entries);
      } else {
        callback([]);
      }
    });

    // Return unsubscribe function
    return () => off(entriesRef, 'value', unsubscribe);
  },

  // Add new entry
  async addEntry(entry: Omit<DiaryEntry, 'id'>) {
    const entriesRef = ref(database, ENTRIES_PATH);
    const newEntryRef = push(entriesRef);
    const newEntry = {
      ...entry,
      id: newEntryRef.key,
      // reactions가 없으면 초기화
      reactions: entry.reactions || { 악: [] }
    };
    await set(newEntryRef, newEntry);
    return newEntry;
  },

  // Update entry (for reactions)
  async updateEntry(entryId: string, updates: Partial<DiaryEntry>) {
    const entryRef = ref(database, `${ENTRIES_PATH}/${entryId}`);
    await update(entryRef, updates);
  },

  // Delete entry
  async deleteEntry(entryId: string) {
    const entryRef = ref(database, `${ENTRIES_PATH}/${entryId}`);
    await remove(entryRef);
  }
};

// Happiness Posts Operations
export const happinessPostsService = {
  // Subscribe to posts changes
  subscribe(callback: (posts: HappinessPost[]) => void) {
    const postsRef = ref(database, HAPPINESS_POSTS_PATH);

    const unsubscribe = onValue(postsRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.entries(data).map(([id, post]: [string, any]) => ({
          id,
          ...post,
          // likes가 없으면 빈 배열로 초기화
          likes: post.likes || [],
          // comments가 없으면 빈 배열로 초기화
          comments: post.comments || []
        }));
        // Sort by timestamp (newest first)
        posts.sort((a, b) => b.timestamp - a.timestamp);
        callback(posts);
      } else {
        callback([]);
      }
    });

    // Return unsubscribe function
    return () => off(postsRef, 'value', unsubscribe);
  },

  // Add new post
  async addPost(post: Omit<HappinessPost, 'id'>) {
    try {
      console.log('Firebase service: Creating post reference');
      const postsRef = ref(database, HAPPINESS_POSTS_PATH);
      const newPostRef = push(postsRef);
      console.log('Firebase service: New post ref key:', newPostRef.key);

      // Remove undefined fields to prevent Firebase error
      const cleanPost = Object.fromEntries(
        Object.entries(post).filter(([_, value]) => value !== undefined)
      );

      const newPost = {
        ...cleanPost,
        id: newPostRef.key,
        // likes가 없으면 빈 배열로 초기화
        likes: post.likes || [],
        // comments가 없으면 빈 배열로 초기화
        comments: post.comments || []
      };

      console.log('Firebase service: Setting post data:', newPost);
      await set(newPostRef, newPost);
      console.log('Firebase service: Post saved successfully');
      return newPost;
    } catch (error) {
      console.error('Firebase service: Error adding post:', error);
      throw error;
    }
  },

  // Update post (for likes)
  async updatePost(postId: string, updates: Partial<HappinessPost>) {
    const postRef = ref(database, `${HAPPINESS_POSTS_PATH}/${postId}`);
    await update(postRef, updates);
  },

  // Delete post
  async deletePost(postId: string) {
    const postRef = ref(database, `${HAPPINESS_POSTS_PATH}/${postId}`);
    await remove(postRef);
  }
};

// Helper function to toggle reaction/like
export const toggleReaction = async (
  itemId: string,
  userId: string,
  currentList: string[],
  path: string,
  field: string
) => {
  // Ensure currentList is an array (in case it's null or undefined from Firebase)
  const safeCurrentList = Array.isArray(currentList) ? currentList : [];

  const hasReacted = safeCurrentList.includes(userId);
  const updatedList = hasReacted
    ? safeCurrentList.filter(id => id !== userId)
    : [...safeCurrentList, userId];

  const itemRef = ref(database, `${path}/${itemId}`);
  await update(itemRef, { [field]: updatedList });
};