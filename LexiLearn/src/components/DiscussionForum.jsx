import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, updateDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Send, MessageCircle, UserCircle, Plus, X, ArrowLeft, Clock, Users } from 'lucide-react';

const DiscussionForum = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({ name: '', description: '' });
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [topicFilter, setTopicFilter] = useState('all'); // 'all', 'recent', 'popular'
  const [recentTopics, setRecentTopics] = useState([]);
  const [topicMembers, setTopicMembers] = useState({});

  useEffect(() => {
    // Store last visited topic in localStorage
    const lastTopicId = localStorage.getItem('lastTopicId');
    if (lastTopicId) {
      const fetchLastTopic = async () => {
        const topicDoc = await getDoc(doc(db, 'discussion_topics', lastTopicId));
        if (topicDoc.exists()) {
          setCurrentTopic({ id: topicDoc.id, ...topicDoc.data() });
        }
      };
      fetchLastTopic();
    }

    // Fetch topics with member counts
    const topicsRef = collection(db, 'discussion_topics');
    const topicsQuery = query(topicsRef, orderBy('timestamp', 'desc'));
    
    const unsubscribeTopics = onSnapshot(topicsQuery, async (snapshot) => {
      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity || doc.data().timestamp,
      }));
      setTopics(topicsData);

      // Fetch member counts for each topic
      const memberCounts = {};
      for (const topic of topicsData) {
        const messagesQuery = query(
          collection(db, 'discussion_messages'),
          where('topicId', '==', topic.id)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const uniqueMembers = new Set(
          messagesSnapshot.docs.map(doc => doc.data().userId)
        );
        memberCounts[topic.id] = uniqueMembers.size;
      }
      setTopicMembers(memberCounts);
      
      // Update recent topics
      const recent = [...topicsData]
        .sort((a, b) => b.lastActivity?.toMillis() - a.lastActivity?.toMillis())
        .slice(0, 5);
      setRecentTopics(recent);
    });

    return () => unsubscribeTopics();
  }, []);

  // Update last activity when switching topics
  useEffect(() => {
    if (currentTopic) {
      localStorage.setItem('lastTopicId', currentTopic.id);
      updateDoc(doc(db, 'discussion_topics', currentTopic.id), {
        lastActivity: serverTimestamp()
      });
    }
  }, [currentTopic]);

  useEffect(() => {
    if (!currentTopic) return;

    // Fetch messages for current topic
    const messagesRef = collection(db, 'discussion_messages');
    const q = query(
      messagesRef,
      where('topicId', '==', currentTopic.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [currentTopic]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!currentUser || !newTopic.name.trim()) return;

    setIsLoading(true);
    try {
      const topicsRef = collection(db, 'discussion_topics');
      const docRef = await addDoc(topicsRef, {
        name: newTopic.name,
        description: newTopic.description,
        createdBy: currentUser.uid,
        creatorName: currentUser.displayName || 'Anonymous',
        timestamp: serverTimestamp(),
        messageCount: 0
      });

      setCurrentTopic({ id: docRef.id, ...newTopic });
      setShowNewTopicModal(false);
      setNewTopic({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !currentTopic) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'discussion_messages'), {
        text: newMessage,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        timestamp: serverTimestamp(),
        photoURL: currentUser.photoURL || null,
        topicId: currentTopic.id
      });

      // Update message count in the topic document
      const topicRef = doc(db, 'discussion_topics', currentTopic.id);
      await updateDoc(topicRef, {
        messageCount: (messages.length + 1)
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getFilteredTopics = () => {
    switch (topicFilter) {
      case 'recent':
        return [...topics].sort((a, b) => b.lastActivity?.toMillis() - a.lastActivity?.toMillis());
      case 'popular':
        return [...topics].sort((a, b) => (topicMembers[b.id] || 0) - (topicMembers[a.id] || 0));
      default:
        return topics;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        {/* Topics Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentTopic ? (
                <>
                  <button
                    onClick={() => setCurrentTopic(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold">{currentTopic.name}</h2>
                    <p className="text-sm text-white/60">
                      {topicMembers[currentTopic.id] || 0} members • {currentTopic.messageCount || 0} messages
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <MessageCircle className="text-blue-400" />
                  <h2 className="text-lg font-semibold">Discussion Topics</h2>
                </>
              )}
            </div>
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Topic
            </button>
          </div>
        </div>

        {!currentTopic ? (
          // Topics List with Filters
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 p-4 border-b border-white/10">
              <button
                onClick={() => setTopicFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  topicFilter === 'all' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setTopicFilter('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  topicFilter === 'recent' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <Clock className="h-4 w-4" />
                Recent
              </button>
              <button
                onClick={() => setTopicFilter('popular')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  topicFilter === 'popular' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <Users className="h-4 w-4" />
                Popular
              </button>
            </div>

            {/* Topics Grid with Member Count */}
            <div className="p-4 grid gap-4">
              {getFilteredTopics().map(topic => (
                <div
                  key={topic.id}
                  onClick={() => setCurrentTopic(topic)}
                  className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <h3 className="font-semibold mb-1">{topic.name}</h3>
                  <p className="text-sm text-white/60 mb-3">{topic.description}</p>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {topicMembers[topic.id] || 0} members
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {topic.messageCount || 0} messages
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {topic.lastActivity ? new Date(topic.lastActivity.toDate()).toLocaleDateString() : 'No activity'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Messages Container
          <>
            <div className="h-[600px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.userId === currentUser?.uid ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    {message.photoURL ? (
                      <img 
                        src={message.photoURL} 
                        alt={message.userName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-white/70" />
                    )}
                  </div>
                  
                  <div className={`flex flex-col ${message.userId === currentUser?.uid ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white/60">{message.userName}</span>
                      <span className="text-xs text-white/40">{formatDate(message.timestamp)}</span>
                    </div>
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.userId === currentUser?.uid
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-white/10 p-4">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={currentUser ? "Type a message..." : "Please login to chat"}
                  disabled={!currentUser || isLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full pr-12
                           text-white placeholder-white/40 focus:outline-none focus:border-blue-500
                           focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!currentUser || isLoading || !newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400
                           hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Topic</h2>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTopic}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Topic Name</label>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    placeholder="Enter topic name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newTopic.description}
                    onChange={(e) => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg h-24 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Describe what this topic is about..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newTopic.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum; 