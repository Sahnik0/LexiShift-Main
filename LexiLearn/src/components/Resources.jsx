import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Book, Video, Download, Link as LinkIcon, Search,
  Filter, Star, ExternalLink, AlertCircle, BookOpen,
  Download as DownloadIcon, Share2, Bookmark, Eye,
  Volume2, Settings, ArrowRight, RefreshCw, CheckCircle,
  XCircle, Sparkles, ChevronRight, AlertTriangle, Info,
  Calendar, Clock, Users, Tag, Plus, Edit2, Trash2, Save, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, set, get, update, remove } from 'firebase/database';
import { debounce } from 'lodash';
import '../styles/fonts.css';

// Comprehensive resource data structure
const resources = {
  speechToTextVisible: false,
  textToSpeechVisible: false,

  teaching: [
    {
      id: 't1',
      title: "Multisensory Teaching Methods",
      description: "A comprehensive guide to implementing multisensory teaching techniques in the classroom, with practical examples and lesson plans.",
      type: "guide",
      format: "pdf",
      difficulty: "intermediate",
      language: "english",
      tags: ["teaching", "methodology", "classroom"],
      rating: 4.8,
      downloads: 1234,
      lastUpdated: "2024-02-15",
      size: "2.4MB",
      url: "https://www.dyslexia-reading-well.com/multisensory-learning.html",
      preview: {
        type: "pdf",
        content: "sample-preview.pdf",
        thumbnail: "preview-thumb.jpg"
      },
      requirements: ["account"],
      accessibility: {
        screenReader: true,
        textToSpeech: true,
        highContrast: true
      }
    },
    {
      id: 't2',
      title: "Structured Literacy Curriculum",
      description: "Complete curriculum package with lesson plans, worksheets, and assessment tools for structured literacy instruction.",
      type: "curriculum",
      format: "mixed",
      difficulty: "advanced",
      language: "english",
      tags: ["curriculum", "literacy", "assessment"],
      rating: 4.9,
      downloads: 2156,
      lastUpdated: "2024-02-18",
      size: "156MB",
      url: "https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/",
      preview: {
        type: "mixed",
        content: "curriculum-preview.pdf",
        thumbnail: "curriculum-thumb.jpg"
      },
      requirements: ["account", "teacher"],
      accessibility: {
        screenReader: true,
        textToSpeech: true,
        highContrast: true
      }
    }
  ],
  tools: [
    {
      id: 'tl1',
      title: "Reading Assistant Pro",
      description: "Advanced text-to-speech software with customizable reading support features and progress tracking.",
      type: "software",
      platform: ["windows", "mac", "ios"],
      difficulty: "beginner",
      language: "multiple",
      tags: ["software", "reading", "assistance"],
      rating: 4.7,
      downloads: 8901,
      lastUpdated: "2024-02-10",
      url: "#",
      trial: true,
      requirements: ["account", "download"],
      accessibility: {
        screenReader: true,
        textToSpeech: true,
        keyboard: true
      }
    },
    {
      id: 'tl3',
      title: "Text-to-Speech Tool",
      description: "Tool for converting text into spoken words using advanced speech synthesis.",
      type: "software",
      platform: ["web"],
      difficulty: "beginner",
      language: "multiple",
      tags: ["software", "text-to-speech"],
      rating: 4.5,
      downloads: 1200,
      lastUpdated: "2024-02-20",
      url: "#",
      trial: true,
      requirements: ["account"],
      accessibility: {
        screenReader: true,
        textToSpeech: true,
        keyboard: true
      },
      onClick: () => setTextToSpeechVisible(true) // Add click handler
    },
    {
      id: 'tl4',
      title: "Speech-to-Text Tool",
      description: "Tool for converting spoken language into text using advanced speech recognition.",
      type: "software",
      platform: ["web"],
      difficulty: "beginner",
      language: "multiple",
      tags: ["software", "speech-to-text"],
      rating: 4.6,
      downloads: 800,
      lastUpdated: "2024-02-22",
      url: "#",
      trial: true,
      requirements: ["account"],
      accessibility: {
        screenReader: true,
        textToSpeech: true,
        keyboard: true
      },
      onClick: () => setSpeechToTextVisible(true) // Add click handler
    },


    {
      id: 'tl2',
      title: "Visual Learning Suite",
      description: "Comprehensive set of visual learning tools and manipulatives for multisensory instruction.",
      type: "toolkit",
      platform: ["web"],
      difficulty: "intermediate",
      language: "english",
      tags: ["visual", "learning", "tools"],
      rating: 4.6,
      downloads: 5632,
      lastUpdated: "2024-02-12",
      url: "#",
      trial: false,
      requirements: ["account", "subscription"],
      accessibility: {
        screenReader: true,
        keyboard: true
      }
    }
  ],
  parents: [
    {
      id: 'p1',
      title: "Parent's Complete Guide to Dyslexia",
      description: "Essential information and strategies for parents supporting children with dyslexia at home and school.",
      type: "guide",
      format: "pdf",
      difficulty: "beginner",
      language: "english",
      tags: ["parenting", "support", "guide"],
      rating: 4.9,
      downloads: 3456,
      lastUpdated: "2024-02-01",
      url: "https://childmind.org/guide/parents-guide-to-dyslexia/",
      preview: {
        type: "pdf",
        content: "parent-guide-preview.pdf",
        thumbnail: "guide-thumb.jpg"
      },
      requirements: ["account"],
      accessibility: {
        screenReader: true,
        textToSpeech: true
      }
    },
    {
      id: 'p2',
      title: "Home Learning Activities Collection",
      description: "Curated collection of engaging learning activities and games for home practice.",
      type: "activities",
      format: "mixed",
      difficulty: "beginner",
      language: "english",
      tags: ["activities", "games", "practice"],
      rating: 4.8,
      downloads: 2789,
      lastUpdated: "2024-02-05",
      url: "#",
      preview: {
        type: "mixed",
        content: "activities-preview.pdf",
        thumbnail: "activities-thumb.jpg"
      },
      requirements: ["account"],
      accessibility: {
        screenReader: true,
        textToSpeech: true
      }
    }
  ]
};



function Resources() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('teaching');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    language: 'all',
    accessibility: 'all'
  });
  const [sort, setSort] = useState('rating');
  const [bookmarks, setBookmarks] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Add these state variables
  const [speechToTextVisible, setSpeechToTextVisible] = useState(false);
  const [textToSpeechVisible, setTextToSpeechVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [userSettings, setUserSettings] = useState({
    highContrast: false,
    fontSize: 'normal',
    dyslexicFont: false
  });
    // Notes-specific state
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
  
  const searchRef = useRef(null);
  const previewRef = useRef(null);

  
  useEffect(() => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      setActiveTab('teaching');
      return;
    }

    // Load user data including notes
const loadUserData = async () => {
  setLoading(true);
  try {

        const userDataRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userDataRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setBookmarks(userData.bookmarks || []);
          setRecentlyViewed(userData.recentlyViewed || []);
          setUserSettings(userData.settings || {
            highContrast: false,
            fontSize: 'normal',
            dyslexicFont: false
          });
          
          // Load notes if they exist
          if (userData.notes) {
            setNotes(Object.values(userData.notes));
          }
        }
      } catch (err) {
    setError('Failed to load user data. Please try again later.');

        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setShowPreview(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch(e.target.value);
  };

  const toggleBookmark = async (resourceId) => {
    if (!currentUser) {
      setError('Please sign in to bookmark resources');
      return;
    }

    try {
      const newBookmarks = bookmarks.includes(resourceId)
        ? bookmarks.filter(id => id !== resourceId)
        : [...bookmarks, resourceId];
      
      await update(ref(database, `users/${currentUser.uid}`), {
        bookmarks: newBookmarks
      });
      
      setBookmarks(newBookmarks);
    } catch (err) {
      setError('Failed to update bookmark');
      console.error(err);
    }
  };

  const addToRecentlyViewed = async (resourceId) => {
    if (!currentUser) return;

    try {
      const newRecentlyViewed = [
        resourceId,
        ...recentlyViewed.filter(id => id !== resourceId)
      ].slice(0, 10);

      await update(ref(database, `users/${currentUser.uid}`), {
        recentlyViewed: newRecentlyViewed
      });

      setRecentlyViewed(newRecentlyViewed);
    } catch (err) {
      console.error('Failed to update recently viewed:', err);
    }
  };

const speakText = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
};

const getSortedAndFilteredResources = () => {

  if (!resources || !resources[activeTab]) {
    console.warn('Resources not found or active tab is invalid');
    return [];
  }

  
    let filtered = resources[activeTab].filter(resource => {
      const matchesSearch = searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  
      const matchesFilters = 
        (filters.type === 'all' || resource.type === filters.type) &&
        (filters.difficulty === 'all' || resource.difficulty === filters.difficulty) &&
        (filters.language === 'all' || resource.language === filters.language) &&
        (filters.accessibility === 'all' || 
          resource.accessibility[filters.accessibility]);
  
      return matchesSearch && matchesFilters;
    });
  
  // Sort resources
  filtered.sort((a, b) => {
    switch (sort) {
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'date':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      default:
        return 0;
    }
  });

  return filtered;
};

const renderTextToSpeechButton = (resource) => {
  return (
    <button onClick={() => speakText(resource.description)} className="text-blue-500 hover:text-blue-400">
      Read Aloud
    </button>
  );

};


 // Enhanced notes handling functions
 const handleCreateNote = () => {
  const newNote = {
    id: Date.now().toString(), // Temporary ID until saved
    title: 'Untitled Note',
    content: '',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  setActiveNote(newNote);
  setIsEditing(true);
  setError(null);
};

const createNewNote = () => {
  const newNote = {
    id: Date.now().toString(),
    title: 'Untitled Note',
    content: '',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  setActiveNote(newNote);
  setIsEditing(true);
};
const handleSaveNote = async () => {
  if (!currentUser || !activeNote?.title || !activeNote?.content) {
    setError('Please provide both title and content for the note');
    return;
  }
  
  try {
    setLoading(true);
    const noteId = activeNote.id;
    const noteData = {
      ...activeNote,
      lastModified: new Date().toISOString()
    };

    await set(ref(database, `users/${currentUser.uid}/notes/${noteId}`), noteData);

    setNotes(prev => {
      const filtered = prev.filter(note => note.id !== noteId);
      return [...filtered, noteData].sort((a, b) => 
        new Date(b.lastModified) - new Date(a.lastModified)
      );
    });
    
    setIsEditing(false);
    setError(null);
  } catch (err) {
    setError('Failed to save note: ' + err.message);
    console.error('Save note error:', err);
  } finally {
    setLoading(false);
  }
};

const handleUpdateNote = (field, value) => {
  setActiveNote(prev => ({
    ...prev,
    [field]: value,
    lastModified: new Date().toISOString()
  }));
};

const handleDeleteNote = async (noteId) => {
  if (!currentUser || !noteId) return;
  
  if (!window.confirm('Are you sure you want to delete this note?')) return;
  
  try {
    setLoading(true);
    await remove(ref(database, `users/${currentUser.uid}/notes/${noteId}`));
    
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (activeNote?.id === noteId) {
      setActiveNote(null);
      setIsEditing(false);
    }
    setError(null);
  } catch (err) {
    setError('Failed to delete note: ' + err.message);
    console.error('Delete note error:', err);
  } finally {
    setLoading(false);
  }
};

const handleEditNote = (note) => {
  setActiveNote(note);
  setIsEditing(true);
  setError(null);
};

const handleCancelEdit = () => {
  if (isEditing && activeNote?.content && 
      !window.confirm('Discard unsaved changes?')) {
    return;
  }
  
  if (!activeNote?.id) {
    setActiveNote(null);
  }
  setIsEditing(false);
  setError(null);
};

// Update the notes rendering in renderContent()
const renderNotes = () => {
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
        <p className="text-white/70">Please sign in to access your notes.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Notes List */}
      <div className="space-y-4">
        <button
          onClick={handleCreateNote}
          className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 justify-center mb-4"
          disabled={loading}
        >
          <Plus className="h-5 w-5" /> New Note
        </button>
        
        {loading && !activeNote ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 h-32 rounded-xl"></div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <BookOpen className="mx-auto h-12 w-12 mb-2" />
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 cursor-pointer transition-all hover:bg-white/10 ${
                activeNote?.id === note.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveNote(note)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{note.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNote(note);
                    }}
                    className="p-1 hover:text-blue-400"
                    disabled={loading}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="p-1 hover:text-red-400"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-white/70 line-clamp-2">{note.content}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-white/50">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(note.lastModified).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note Editor */}
      {(activeNote || isEditing) && (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              value={activeNote?.title || ''}
              onChange={(e) => handleUpdateNote('title', e.target.value)}
              placeholder="Note Title"
              className="text-2xl font-bold bg-transparent border-none focus:outline-none placeholder-white/30 w-full"
              readOnly={!isEditing}
            />
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveNote}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                    disabled={loading}
                  >
                    {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                    disabled={loading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEditNote(activeNote)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                  disabled={loading}
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          <textarea
            value={activeNote?.content || ''}
            onChange={(e) => handleUpdateNote('content', e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-[500px] bg-white/5 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/30"
            readOnly={!isEditing}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

  // Main render content
  const renderContent = () => {
    if (activeTab === 'notes') {
      return renderNotes();
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/5 rounded-xl h-64"></div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          getSortedAndFilteredResources().map((resource) => (
            <div key={resource.id}>
              {renderTextToSpeechButton(resource)}
              <ResourceCard
                resource={resource}
                isBookmarked={bookmarks.includes(resource.id)}
                onBookmark={() => toggleBookmark(resource.id)}
                onView={() => {
                  addToRecentlyViewed(resource.id);
                  setShowPreview(resource);
                }}
                settings={userSettings}
              />
            </div>
          ))
        )}
      </div>
    );
  };

  // Main component return
  return (
    <div className={`min-h-screen bg-black text-white ${
      userSettings.dyslexicFont ? 'font-opendyslexic' : ''
    } ${userSettings.highContrast ? 'high-contrast' : ''}`}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black to-black" />
        {[...Array(15)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
              Learning Resources
            </span>
          </h1>
          <p className="text-xl text-white/80">
            Discover our comprehensive collection of dyslexia support materials
          </p>
        </div>

          {/* Search and Filters */}
          {activeTab !== 'notes' && (
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search resources..."
                  onChange={handleSearch}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-white/50"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="all">All Types</option>
                <option value="guide">Guides</option>
                <option value="video">Videos</option>
                <option value="software">Software</option>
                <option value="curriculum">Curriculum</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="rating">Highest Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="date">Recently Updated</option>
              </select>
            </div>
          </div>
        </div>

          )}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-1">
            {['teaching', 'tools', 'parents', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {renderContent()}



        {/* Resource Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div ref={previewRef} className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{showPreview.title}</h2>
                  <button
                    onClick={() => setShowPreview(null)}
                    className="text-white/50 hover:text-white"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-white/80">{showPreview.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {showPreview.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard icon={<Calendar />} label="Updated" value={new Date(showPreview.lastUpdated).toLocaleDateString()} />
                    <InfoCard icon={<Star />} label="Rating" value={showPreview.rating.toFixed(1)} />
                    <InfoCard icon={<Download />} label="Downloads" value={showPreview.downloads.toLocaleString()} />
                    <InfoCard icon={<Users />} label="Level" value={showPreview.difficulty} />
                  </div>
                </div>
              </div>
              <div className="p-6 flex justify-between">
                <button
                  onClick={() => toggleBookmark(showPreview.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <Bookmark className={bookmarks.includes(showPreview.id) ? "text-blue-400" : ""} />
                  {bookmarks.includes(showPreview.id) ? "Bookmarked" : "Bookmark"}
                </button>
                <a
                  href={showPreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  <Download /> Download Resource
                </a>
              </div>
            </div>
          </div>
        )}

<button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

// Helper Components
function ResourceCard({ resource, isBookmarked, onBookmark, onView, settings }) {
  return (
    <div className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {getResourceIcon(resource.type)}
          <span className="text-sm text-white/50">{resource.type}</span>
        </div>
        <button
          onClick={onBookmark}
          className="text-white/50 hover:text-white"
        >
          <Bookmark className={isBookmarked ? "text-blue-400 fill-current" : ""} />
        </button>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
      <p className="text-white/70 mb-4 line-clamp-2">{resource.description}</p>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span>{resource.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>{resource.downloads.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={onView}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-white/70 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> Open
        </a>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex items-center gap-2 text-white/50 mb-1">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function getResourceIcon(type) {
  switch (type) {
    case 'guide':
      return <Book className="h-6 w-6" />;
    case 'video':
      return <Video className="h-6 w-6" />;
    case 'curriculum':
      return <BookOpen className="h-6 w-6" />;
    case 'software':
      return <DownloadIcon className="h-6 w-6" />;
    default:
      return <LinkIcon className="h-6 w-6" />;
  }
}

export default Resources;
