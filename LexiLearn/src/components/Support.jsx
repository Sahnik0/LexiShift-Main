import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { 
  MessageSquare, Users, Heart, Share2, 
  Search, Filter, ChevronRight, Clock,
  AlertCircle, BookOpen, Star, User, Plus
} from 'lucide-react';
import DiscussionForum from './DiscussionForum';

function Support() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Education'
  });


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const storiesRef = collection(db, 'stories');
      const q = query(storiesRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || 0,
        likedBy: doc.data().likedBy || [],
        profilePicture: doc.data().profilePicture || null
      }));
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLike = async (storyId) => {
    if (!currentUser) return;

    try {
      const storyRef = doc(db, 'stories', storyId);
      const story = stories.find(s => s.id === storyId);
      
      if (!story) return;

      const isLiked = story.likedBy.includes(currentUser.uid);
      const newLikedBy = isLiked 
        ? story.likedBy.filter(uid => uid !== currentUser.uid)
        : [...story.likedBy, currentUser.uid];

      await updateDoc(storyRef, {
        likes: isLiked ? story.likes - 1 : story.likes + 1,
        likedBy: newLikedBy
      });

      // Update local state
      setStories(stories.map(s => 
        s.id === storyId 
          ? { 
              ...s, 
              likes: isLiked ? s.likes - 1 : s.likes + 1,
              likedBy: newLikedBy
            }
          : s
      ));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleShare = async (story) => {
    try {
      await navigator.share({
        title: story.title,
        text: `Check out this success story: ${story.title}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleModalClose = () => {
    setShowStoryModal(false);
  };

  const handleStorySuccess = async () => {
    await fetchStories();
    setShowStoryModal(false);
  };

  const StoryModal = ({ onClose, currentUser, onSuccess }) => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      category: 'Education'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!currentUser) return;
  
      setIsSubmitting(true);
      try {
        const storiesRef = collection(db, 'stories');
        await addDoc(storiesRef, {
          ...formData,
          author: currentUser.displayName || 'Anonymous',
          userId: currentUser.uid,
          profilePicture: currentUser.photoURL,
          timestamp: serverTimestamp(),
          likes: 0,
          likedBy: [],
          date: new Date().toISOString()
        });
        onSuccess();
      } catch (error) {
        console.error('Error submitting story:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4">
          <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                  placeholder="Enter your story title"
                />
              </div>
  
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Education">Education</option>
                  <option value="Career Success">Career Success</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="Learning Strategies">Learning Strategies</option>
                </select>
              </div>
  
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">Your Story</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg h-40 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                  placeholder="Share your success story here..."
                />
              </div>
            </div>
  
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Share Story'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400/10 blur-xl animate-float"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 7 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
              Lexi Community
            </span>
          </h1>
          <p className="text-xl text-white/80">
            Connect, share, and learn from others in the dyslexia community
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'forum' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('forum')}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Discussion Forum
              </div>
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'stories' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('stories')}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Success Stories
              </div>
            </button>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
          {!currentUser ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-white/80 mb-6">
                Sign in to participate in discussions and share your experiences
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
              >
                <User className="h-5 w-5" />
                Sign In
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'forum' ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Community Discussion</h2>
                  </div>
                  <DiscussionForum />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Success Stories</h2>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                      onClick={() => setShowStoryModal(true)}
                    >
                      <Star className="h-5 w-5" />
                      Share Your Story
                    </button>
                  </div>
                  <div className="space-y-6">
                    {stories.map((story) => (
                      <div key={story.id} className="border border-white/10 rounded-lg p-6 hover:bg-white/5 transition-all">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            {story.profilePicture ? (
                              <img 
                                src={story.profilePicture} 
                                alt={story.author}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                                <User className="h-6 w-6 text-white/80" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold mb-2">{story.title}</h3>
                            <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                              <span className="flex items-center gap-1">
                                {story.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(story.date).toLocaleDateString()}
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded-full">
                                {story.category}
                              </span>
                            </div>
                            <p className="text-white/80 mb-4">{story.content}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                              <button
                                onClick={() => handleLike(story.id)}
                                className={`flex items-center gap-2 ${
                                  story.likedBy?.includes(currentUser?.uid)
                                    ? 'text-pink-500'
                                    : 'text-white/60 hover:text-pink-500'
                                }`}
                              >
                                <Heart className={`h-5 w-5 ${
                                  story.likedBy?.includes(currentUser?.uid) ? 'fill-current' : ''
                                }`} />
                                <span>{story.likes}</span>
                              </button>

                              <button
                                onClick={() => handleShare(story)}
                                className="flex items-center gap-2 text-white/60 hover:text-white/80"
                              >
                                <Share2 className="h-5 w-5" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showStoryModal && (
        <StoryModal 
          onClose={handleModalClose}
          currentUser={currentUser}
          onSuccess={handleStorySuccess}
        />
      )}
    </div>
  );
}

export default Support;