import React, { useState, useEffect } from 'react';
import { DiaryEntry, ViewType, HappinessPost, Comment } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import CalendarView from './components/CalendarView';
import AllEntriesView from './components/AllEntriesView';
import HappinessArchive from './components/HappinessArchive';
import StatsView from './components/StatsView';
import NameSelectionModal from './components/NameSelectionModal';
import { diaryEntriesService, happinessPostsService, toggleReaction } from './services/firebaseService';
import { initializeOneSignal } from './config/onesignal';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [happinessPosts, setHappinessPosts] = useState<HappinessPost[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);

  // Generate unique user ID for each browser/device
  const getCurrentUserId = () => {
    let userId = localStorage.getItem('tackclub-userId');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('tackclub-userId', userId);
    }
    return userId;
  };

  const currentUserId = getCurrentUserId();

  // Initialize OneSignal and check for name selection
  useEffect(() => {
    // Initialize OneSignal
    initializeOneSignal();

    // Check if user has selected a name
    const hasSelectedName = localStorage.getItem('hasSelectedName');
    const myName = localStorage.getItem('myName');

    if (!hasSelectedName || !myName) {
      setShowNameModal(true);
    }
  }, []);

  // Subscribe to Firebase data
  useEffect(() => {
    // Subscribe to diary entries
    const unsubscribeEntries = diaryEntriesService.subscribe((entries) => {
      setEntries(entries);
    });

    // Subscribe to happiness posts
    const unsubscribePosts = happinessPostsService.subscribe((posts) => {
      setHappinessPosts(posts);
    });

    // Initialize with sample data if database is empty (for first time setup)
    // This will be handled automatically when no data exists in Firebase

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeEntries();
      unsubscribePosts();
    };
  }, []);

  const handleNameSelected = (name: string) => {
    setShowNameModal(false);
    // Name is already saved in localStorage and OneSignal tag is set in the modal component
  };

  const handleAddEntry = async (newEntry: Omit<DiaryEntry, 'id'>) => {
    try {
      await diaryEntriesService.addEntry(newEntry);
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const handleReaction = async (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      // Ensure reactions.악 is an array
      const currentReactions = entry.reactions?.악 || [];
      await toggleReaction(
        entryId,
        currentUserId,
        currentReactions,
        'entries',
        'reactions/악'
      );
    }
  };

  const handleAddHappinessPost = async (newPost: Omit<HappinessPost, 'id'>) => {
    try {
      console.log('Attempting to add happiness post:', newPost);
      const result = await happinessPostsService.addPost(newPost);
      console.log('Successfully added happiness post:', result);
    } catch (error) {
      console.error('Failed to add happiness post:', error);
      alert('포스트 저장 중 오류가 발생했습니다: ' + (error as any).message);
    }
  };

  const handleLikePost = async (postId: string) => {
    const post = happinessPosts.find(p => p.id === postId);
    if (post) {
      // Ensure likes is an array
      const currentLikes = post.likes || [];
      await toggleReaction(
        postId,
        currentUserId,
        currentLikes,
        'happiness-posts',
        'likes'
      );
    }
  };

  const handleAddComment = async (postId: string, comment: Omit<Comment, 'id'>) => {
    const post = happinessPosts.find(p => p.id === postId);
    if (post) {
      const newComment = {
        ...comment,
        id: Date.now().toString()
      };
      const updatedComments = [...(post.comments || []), newComment];

      try {
        await happinessPostsService.updatePost(postId, {
          comments: updatedComments
        });
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  return (
    <>
      {/* Name Selection Modal */}
      {showNameModal && (
        <NameSelectionModal onNameSelected={handleNameSelected} />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 overflow-hidden">
          <div className="h-full animate-fade-in view-transition">
            {currentView === 'calendar' && (
              <CalendarView
                entries={entries}
                currentUserId={currentUserId}
                onAddEntry={handleAddEntry}
                onReaction={handleReaction}
              />
            )}
            {currentView === 'all' && (
              <AllEntriesView
                entries={entries}
                currentUserId={currentUserId}
                onReaction={handleReaction}
              />
            )}
            {currentView === 'announcements' && (
              <HappinessArchive
                posts={happinessPosts}
                currentUserId={currentUserId}
                onAddPost={handleAddHappinessPost}
                onLike={handleLikePost}
                onAddComment={handleAddComment}
              />
            )}
            {currentView === 'stats' && (
              <StatsView entries={entries} />
            )}
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </>
  );
}

export default App;