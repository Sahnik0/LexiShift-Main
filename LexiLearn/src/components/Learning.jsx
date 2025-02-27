import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';
import { useProgress } from '../contexts/ProgressContext';
import { useAI } from '../contexts/AIContext';
import { useSpeech } from '../hooks/useSpeech';
import { useTimer } from '../hooks/useTimer';
import { 
  BookOpen, Award, Brain, CheckCircle, XCircle, RefreshCw, 
  PlayCircle, PauseCircle, Volume2, Star, Trophy, Timer,
  Sparkles, ChevronRight, ArrowRight, Headphones,
  Settings, Book, AlertCircle, Video
} from 'lucide-react';
import '../styles/fonts.css';
import PracticeExercises from './PracticeExercises';
const modules = [
  {
    id: 1,
    title: "Phonological Awareness Fundamentals",
    difficulty: "beginner",
    prerequisites: [],
    estimatedTime: "30 minutes",
    content: `
      Start your reading journey by understanding sounds in words:
      
      1. Word Sounds
      • Listen to each word
      • Break it into individual sounds
      • Practice blending sounds together
      
      Example Words:
     cat = k  æ   t
      dog = d     o   g
      fish = f   ɪ   ʃ
      
      2. Syllable Practice
      • Clap along with each syllable
      • Count syllables in words
      • Combine syllables to form words
      
      Practice Words:
      • but-ter-fly (3 syllables)
      • el-e-phant (3 syllables)
      • hip-po-pot-a-mus (5 syllables)
    `,
    practice: {
      type: "sound-matching",
      exercises: [
        {
          word: "cat",
          sounds: ["k", "æ", "t"],
          audio: "/sound/cat.mp3",
          hints: ["Starts like 'car'", "Rhymes with 'hat'"]
        },
        {
          word: "dog",
          sounds: ["d", "ɒ", "g"],
          audio: "/sound/dog.mp3",
          hints: ["Starts like 'day'", "Ends like 'bag'"]
        }
      ]
    },
    quiz: [
      {
        question: "How many syllables are in 'butterfly'?",
        audio: "/sound/butterfly.opus",
        options: ["Two", "Three", "Four", "Five"],
        correct: 1, // Ensure this is the correct index for the answer
        explanation: "But-ter-fly has three distinct syllables",
        miniLesson: {
          content: "Let's practice counting syllables. Clap as you say: BUT-TER-FLY",
          audio: "/sound/butterfly-lesson.opus"
        }
      },
      {
        question: "Which word begins with the same sound as 'fish'?",
        audio: "/sound/fish.mp3", // Added audio for the question
        options: ["phone", "ship", "thin", "vine"],
        correct: 0,
        explanation: "'Fish' and 'phone' both start with the /f/ sound"
      }
    ]
  },
  {
    id: 2,
    title: "Word Recognition Strategies",
    difficulty: "beginner",
    prerequisites: [1],
    estimatedTime: "45 minutes",
    content: `
      Learn to recognize words quickly and accurately:
      
      1. Sight Words
      • Common words to memorize
      • Quick recognition practice
      • Pattern spotting
      
      Essential Sight Words:
      • the, and, was, you
      • they, said, have, are
      • what, were, when, your
      
      2. Word Patterns
      • Word families (-at, -ig, -op)
      • Common prefixes (un-, re-, pre-)
      • Common suffixes (-ing, -ed, -ly)
    `,
    practice: {
      type: "word-recognition",
      exercises: [
        {
          type: "sight-words",
          words: ["the", "and", "was", "you"],
          timeLimit: 30
        },
        {
          type: "word-patterns",
          patterns: [
            {
              family: "-at",
              words: ["cat", "hat", "rat", "bat"]
            },
            {
              family: "-ig",
              words: ["big", "dig", "pig", "wig"]
            }
          ]
        }
      ]
    },
    quiz: [
      {
        question: "Which words belong to the '-at' word family?",
        audio: "/sound/at.mp3",
        options: [
          "cat, hat, mat",
          "big, dig, wig",
          "hop, top, mop",
          "bed, red, fed"
        ],
        correct: 0,
        explanation: "Words ending in '-at' belong to the same word family"
      }
    ]
  },
  {
    id: 3,
    title: "Reading Comprehension Basics",
    difficulty: "intermediate",
    prerequisites: [1, 2],
    estimatedTime: "60 minutes",
    content: `
      Develop your understanding of what you read:
      
      1. Main Ideas
      • Finding the key message
      • Supporting details
      • Author's purpose
      
      2. Story Elements
      • Characters
      • Setting
      • Plot
      • Sequence of events
      
      Practice Story:
      "The Big Race"
      Sarah loved running. Every morning, she practiced at the park.
      The big race was coming soon. She trained harder than ever.
      On race day, Sarah was nervous but ready. She ran her best
      and won first place! Her family was very proud.
    `,
    practice: {
      type: "comprehension",
      exercises: [
        {
          type: "main-idea",
          text: "The Big Race",
          questions: [
            {
              question: "What is the main idea of the story?",
              options: [
                "Sarah's preparation and success in a race",
                "The importance of family support",
                "Daily running routines",
                "Different types of races"
              ],
              correct: 0
            }
          ]
        }
      ]
    },
    quiz: [
      {
        question: "What helped Sarah succeed in the race?",
        options: [
          "Daily practice",
          "Lucky shoes",
          "Weather conditions",
          "Having many friends"
        ],
        correct: 0,
        explanation: "The story mentions Sarah practiced every morning"
      }
    ]
  },
  {
    id: 4,
    title: "Advanced Reading Strategies",
    difficulty: "advanced",
    prerequisites: [1, 2, 3],
    estimatedTime: "90 minutes",
    content: `
      Master advanced reading techniques:
      
      1. Inferencing
      • Reading between the lines
      • Using context clues
      • Making predictions
      
      2. Critical Analysis
      • Author's perspective
      • Fact vs. opinion
      • Drawing conclusions
      
      3. Vocabulary Building
      • Context clues
      • Word roots
      • Multiple meanings
    `,
    practice: {
      type: "advanced-comprehension",
      exercises: [
        {
          type: "inference",
          scenarios: [
            {
              text: "Maria grabbed her umbrella before leaving.",
              question: "What can you infer about the weather?",
              options: [
                "It was raining or likely to rain",
                "It was sunny",
                "It was windy",
                "It was cold"
              ],
              correct: 0
            }
          ]
        }
      ]
    },
    quiz: [
      {
        question: "What does 'reading between the lines' mean?",
        options: [
          "Understanding implied meanings",
          "Reading very carefully",
          "Skipping lines while reading",
          "Reading multiple lines at once"
        ],
        correct: 0,
        explanation: "It means understanding ideas that aren't directly stated"
      }
    ]
  },
  {
    id: 5,
    title: "Animal Sound Guessing Game",
    difficulty: "intermediate",
    prerequisites: [],
    estimatedTime: "30 minutes",
    content: `
      Enhance your listening skills and vocabulary with our fun animal guessing game!
      
      How to play:
      
      1. Listen to the animal sound
      2. Watch the video or look at the image clue
      3. Choose the correct animal from the options
      
      This activity helps you:
      • Improve audio recognition
      • Connect sounds with visual cues
      • Expand your animal vocabulary
      
      Ready to test your animal knowledge? Start the quiz when you're ready!
    `,
    practice: {
      type: "animal-sounds",
      exercises: [
        {
          animal: "elephant",
          sound: "/sound/elephant.mp3",
          hints: ["This animal is very large", "It has a long trunk"]
        },
        {
          animal: "lion",
          sound: "/sound/lion.mp3",
          hints: ["King of the jungle", "Has a large mane"]
        }
      ]
    },
    quiz: [
      {
        question: "Which animal makes this sound?",
        audio: "/sound/elephant.mp3",
        video: "/video/elephant.mp4",
        options: [
          "Elephant",
          "Giraffe",
          "Rhinoceros",
          "Hippopotamus"
        ],
        correct: 0,
        explanation: "The sound is a trumpet-like call made by an elephant."
      },
      {
        question: "Which animal makes this sound?",
        audio: "/sound/lion.mp3",
        video: "/video/lion.mp4",
        options: [
          "Tiger",
          "Lion",
          "Cheetah",
          "Leopard"
        ],
        correct: 1,
        explanation: "The sound is a roar made by a lion."
      },
      {
        question: "Which animal makes this sound?",
        audio: "/sound/wolf.mp3",
        video: "/video/wolf.mp4",
        options: [
          "Dog",
          "Coyote",
          "Wolf",
          "Fox"
        ],
        correct: 2,
        explanation: "The sound is a howl made by a wolf."
      },
      {
        question: "Which animal makes this sound?",
        audio: "/sound/monkey.mp3",
        video: "/video/monkey.mp4",
        options: [
          "Gorilla",
          "Chimpanzee",
          "Baboon",
          "Monkey"
        ],
        correct: 3,
        explanation: "The sound is a chatter made by a monkey."
      },
      {
        question: "Which animal makes this sound?",
        audio: "/sound/owl.mp3",
        video: "/video/owl.mp4",
        options: [
          "Eagle",
          "Hawk",
          "Owl",
          "Falcon"
        ],
        correct: 2,
        explanation: "The sound is a hoot made by an owl."
      }
    ]
  }
];

function Learning() {
  // Context hooks
  const { currentUser } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { playSound, stopSound } = useAudio();
  const { progress, updateProgress } = useProgress();
  const { generateFeedback, generateHint } = useAI();
  const { speak, stop: stopSpeech } = useSpeech();
  const { time, start: startTimer, stop: stopTimer, reset: resetTimer, formatTime } = useTimer();

  // State management
  const [activeModule, setActiveModule] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [questionResults, setQuestionResults] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [moduleProgress, setModuleProgress] = useState({});
  const [showPractice, setShowPractice] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Load existing progress for the current module
    const loadModuleProgress = async () => {
      try {
        // Check if progress object and method exist
        if (progress && typeof progress.getModuleProgress === 'function') {
          const currentModuleProgress = await progress.getModuleProgress(modules[activeModule].id);
          setModuleProgress(currentModuleProgress || {});
        } else {
          // Fallback if progress context isn't properly initialized
          console.warn('Progress context not properly initialized');
          setModuleProgress({});
        }
      } catch (error) {
        console.error('Error loading module progress:', error);
        setModuleProgress({});
      }
    };
    
    loadModuleProgress();
  }, [activeModule, progress]);


  useEffect(() => {
    // Apply user settings
    document.documentElement.style.fontSize = settings.fontSize === 'large' ? '120%' : 
                                            settings.fontSize === 'small' ? '90%' : '100%';
    
    document.documentElement.classList.toggle('font-dyslexic', settings.dyslexicFont);
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
  }, [settings]);


  // Reset video player when changing questions
  useEffect(() => {
    setIsPlayingVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentQuestion]);

  // Handle text-to-speech for module content
  const handleReadContent = () => {
    if (isReading) {
      stopSpeech();
      setIsReading(false);
    } else {
      const content = modules[activeModule].content;
      speak(content, settings.readingSpeed);
      setIsReading(true);
    }
  };

  const isQuizCompleted = () => {
    const totalQuestions = modules[activeModule].quiz.length;
    const answeredQuestions = Object.keys(userAnswers).length;
    return answeredQuestions === totalQuestions;
  };

  // Handle video playback
  const handleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  // Improved score calculation
  const calculateAndSaveScore = async (finalAnswers = userAnswers) => {
    const currentQuiz = modules[activeModule].quiz;
    const results = currentQuiz.map((question, index) => ({
      questionIndex: index,
      userAnswer: finalAnswers[index]?.selected,
      correctAnswer: question.correct,
      isCorrect: finalAnswers[index]?.isCorrect
    }));

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / currentQuiz.length) * 100);

    console.log('Quiz Results:', {
      finalAnswers,
      results,
      correctCount,
      totalQuestions: currentQuiz.length,
      score
    });

    setQuestionResults(results.map(r => r.isCorrect));
    setQuizScore(score);
    setIsQuizComplete(true);
    stopTimer();

    // Save progress if the progress context is available
    if (progress && typeof progress.updateProgress === 'function') {
      const progressData = {
        moduleId: modules[activeModule].id,
        completed: true,
        score,
        timeSpent: time,
        lastAttempt: new Date().toISOString(),
        detailedResults: results,
        totalQuestions: currentQuiz.length,
        correctAnswers: correctCount
      };

      try {
        await updateProgress(modules[activeModule].id, progressData);
        setModuleProgress(progressData);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  // Enhanced answer submission handling
  const handleAnswerSubmit = async (questionIndex, answerIndex) => {
    const currentQuiz = modules[activeModule].quiz[questionIndex];
    const isCorrect = answerIndex === currentQuiz.correct;
  
    // Update answers immediately
    const newAnswers = {
      ...userAnswers,
      [questionIndex]: {
        selected: answerIndex,
        isCorrect
      }
    };
    setUserAnswers(newAnswers);
  
    // Play sound feedback
    if (settings.audioEnabled) {
      playSound(isCorrect ? '/sound/correct.mp3' : '/sound/incorrect.mp3');
    }
  
    try {
      // Get AI feedback
      const feedbackText = await generateFeedback(
        currentQuiz.options[answerIndex],
        currentQuiz.options[currentQuiz.correct],
        modules[activeModule].title
      );
  
      // Prefix with Correct/Incorrect
      const prefixedFeedback = `${isCorrect ? 'Correct!' : 'Incorrect.'} ${feedbackText}`;
      
      setFeedback(prefixedFeedback);
      setAnnouncement(prefixedFeedback);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      // Fallback feedback if AI call fails
      const fallbackFeedback = isCorrect 
        ? `Correct! Great job!` 
        : `Incorrect. The correct answer is: ${currentQuiz.options[currentQuiz.correct]}.`;
      
      setFeedback(fallbackFeedback);
      setAnnouncement(fallbackFeedback);
    }
  
    // Check if this is the last question
    const isLastQuestion = questionIndex === modules[activeModule].quiz.length - 1;
    
    if (isLastQuestion || Object.keys(newAnswers).length === modules[activeModule].quiz.length) {
      setTimeout(async () => {
        await calculateAndSaveScore(newAnswers);
      }, 500);
    } else {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setFeedback('');
      }, 2000);
    }
  };

  // Handle module audio playback
  const handleModuleAudio = async (audioFile) => {
    if (!settings.audioEnabled || !audioFile) return;
    
    try {
      await playSound(audioFile);
      setAnnouncement('Playing audio');
    } catch (error) {
      setAnnouncement('Error playing audio');
    }
  };

  // Get AI hint
  const getHint = async () => {
    const currentQuiz = modules[activeModule].quiz[currentQuestion];
    
    try {
      // First check if there are built-in hints in the question
      if (currentQuiz.hints && currentQuiz.hints.length > 0) {
        // Use a random hint from the available hints
        const randomIndex = Math.floor(Math.random() * currentQuiz.hints.length);
        setAnnouncement(currentQuiz.hints[randomIndex]);
        setFeedback(currentQuiz.hints[randomIndex]);
        return;
      }
      
      // If no built-in hints, use AI to generate one
      const hint = await generateHint(
        currentQuiz.question, 
        modules[activeModule].title
      );
      
      setAnnouncement(hint);
      setFeedback(hint);
    } catch (error) {
      console.error('Error getting AI hint:', error);
      // Fallback hint if AI call fails
      const fallbackHint = "Think about what we've learned in this module. You can do this!";
      setAnnouncement(fallbackHint);
      setFeedback(fallbackHint);
    }
  };

  const handleNextModule = () => {
    // Ensure current module progress is saved
    if (isQuizComplete && quizScore !== null) {
      const nextModule = (activeModule + 1) % modules.length;
      setActiveModule(nextModule);
      resetQuiz();
    }
  };

  // Enhanced quiz reset
  const resetQuiz = () => {
    setQuizScore(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setQuestionResults([]);
    setFeedback('');
    setIsQuizComplete(false);
    resetTimer();
    setShowQuiz(false);
    setIsPlayingVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`min-h-screen bg-black text-white ${
      settings.dyslexicFont ? 'font-opendyslexic' : ''
    } ${settings.highContrast ? 'high-contrast' : ''}`}>
      {/* Animated Background */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
              Interactive Learning
            </span>
          </h1>
          <p className="text-xl text-white/80">
            Master reading skills through guided lessons and interactive exercises
          </p>
        </div>

        {/* Settings Controls */}
        <div className="fixed top-4 right-4 flex gap-2 p-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
          <button
            onClick={() => updateSettings({ audioEnabled: !settings.audioEnabled })}
            className={`p-2 rounded transition-all ${settings.audioEnabled ? 'bg-blue-600' : 'bg-white/10'}`}
            aria-label={`${settings.audioEnabled ? 'Disable' : 'Enable'} audio`}
          >
            <Volume2 className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
            className={`p-2 rounded transition-all ${settings.dyslexicFont ? 'bg-blue-600' : 'bg-white/10'}`}
            aria-label={`${settings.dyslexicFont ? 'Disable' : 'Enable'} dyslexic font`}
          >
            <Book className="h-5 w-5" />
          </button>

          <button
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            className={`p-2 rounded transition-all ${settings.highContrast ? 'bg-blue-600' : 'bg-white/10'}`}
            aria-label={`${settings.highContrast ? 'Disable' : 'Enable'} high contrast`}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {modules.map((module, index) => (
        <button
          key={module.id}
          onClick={() => setActiveModule(index)}
          className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-left transition-all hover:bg-white/10 ${
            activeModule === index ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-sm text-white/50">{module.difficulty}</span>
            </div>
            {moduleProgress[module.id]?.completed && (
              <Trophy className="h-6 w-6 text-yellow-400" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
          <div className="flex items-center gap-2 text-white/70">
            <Timer className="h-4 w-4" />
            <span>{module.estimatedTime}</span>
            {moduleProgress[module.id]?.score && (
              <span className="ml-auto text-green-400">
                Score: {moduleProgress[module.id].score}%
              </span>
            )}
          </div>
        </button>
      ))}
    </div>

          {/* Add Practice Section Here - This is the new addition */}
          {modules[activeModule].practice && !showQuiz && (
          <div className="mb-8">
            <button
              onClick={() => setShowPractice(!showPractice)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all mx-auto mb-4"
            >
              <Brain className="h-5 w-5" />
              {showPractice ? 'Hide Practice' : 'Start Practice'}
            </button>

            {showPractice && (
              <PracticeExercises
                practice={modules[activeModule].practice}
                settings={settings}
                playSound={playSound}
                generateFeedback={generateFeedback}
              />
            )}
          </div>
        )}

        {/* Active Module Content */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{modules[activeModule].title}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReadContent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                {isReading ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                {isReading ? 'Stop Reading' : 'Read Aloud'}
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: modules[activeModule].content }} />
          </div>
        </div>

        {/* Quiz Section */}
        {!showQuiz ? (
          <button
            onClick={() => {
              setShowQuiz(true);
              startTimer();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all mx-auto"
          >
            <Brain className="h-5 w-5" />
            Start Quiz
          </button>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                Question {currentQuestion + 1} of {modules[activeModule].quiz.length}
              </h3>
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                <span>{formatTime(time)}</span>
              </div>
            </div>

            <p className="text-xl mb-6">{modules[activeModule].quiz[currentQuestion].question}</p>
            
            {/* Audio Button - for all module types */}
            <button onClick={() => handleModuleAudio(modules[activeModule].quiz[currentQuestion].audio)} 
              className="flex items-center gap-2 px-4 py-2 mb-4 bg-blue-600/70 rounded-lg hover:bg-blue-600 transition-all">
              <Volume2 className="h-5 w-5" />
              Listen to the sound
            </button>

            {/* Video Player - only for animal guessing game */}
            {modules[activeModule].id === 5 && modules[activeModule].quiz[currentQuestion].video && (
              <div className="mb-6">
                {modules[activeModule].quiz[currentQuestion].video.endsWith('.mp4') ? (
                  <div className="relative aspect-video bg-black/30 rounded-lg overflow-hidden mb-4">
                    <video 
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      src={modules[activeModule].quiz[currentQuestion].video}
                      poster="/api/placeholder/640/360"
                      onEnded={() => setIsPlayingVideo(false)}
                    />
                    <button 
                      onClick={handleVideoPlayback}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      {!isPlayingVideo && (
                        <div className="h-16 w-16 bg-blue-600/80 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-all">
                          <PlayCircle className="h-10 w-10" />
                        </div>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video bg-black/30 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    <img 
                      src="/api/placeholder/640/360" 
                      alt="Animal visual clue" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <p className="text-sm text-white/60 mb-6">
                  Watch the video or image for a visual clue
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {modules[activeModule].quiz[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSubmit(currentQuestion, index)}
                  className={`w-full p-4 text-left rounded-lg transition-all ${
                    userAnswers[currentQuestion]?.selected === index 
                      ? userAnswers[currentQuestion]?.isCorrect 
                        ? 'bg-green-600' 
                        : 'bg-red-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
  <div className="p-4 bg-white/10 rounded-lg mb-4">
    {feedback}
  </div>
)}

<button
  onClick={getHint}
  className="text-blue-400 hover:text-blue-300 transition-all"
>
  Need a hint?
</button>
          </div>
        )}

 {/* Quiz Results with detailed feedback */}
 {isQuizComplete && quizScore !== null && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl max-w-lg w-full p-6">
          <div className="text-center">
            {quizScore >= 70 ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            
            <h2 className="text-2xl font-bold mb-4">
              Your Score: {quizScore}%
            </h2>
            
            <div className="mb-6">
              <p className="mb-2">
                Correct Answers: {questionResults.filter(r => r === true).length}
              </p>
              <p className="mb-2">
                Total Questions: {modules[activeModule].quiz.length}
              </p>
              <p>Time taken: {formatTime(time)}</p>
            </div>

            {/* Show answer summary */}
            <div className="mb-6 text-left">
              <h3 className="font-semibold mb-2">Question Summary:</h3>
              {questionResults.map((isCorrect, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>Question {index + 1}: {isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  resetQuiz();
                  setActiveModule((activeModule + 1) % modules.length);
                }}
                className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                Next Module
              </button>
            </div>
          </div>
        </div>
      </div>
    )}


        {/* Accessibility Announcer */}
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>
    </div>
  );
}

export default Learning;