import React, { useState, useEffect } from 'react';
import { Volume2, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

const PracticeExercises = ({ practice, settings, playSound, generateFeedback }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleSoundPlayback = async (audioFile) => {
    if (!settings?.audioEnabled || !audioFile) return;
    try {
      await playSound(audioFile);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleSubmit = async () => {
    if (practice.type === 'sound-matching') {
      const exercise = practice.exercises[currentExercise];
      const isCorrect = userInput.toLowerCase() === exercise.word.toLowerCase();
      
      const feedback = await generateFeedback(userInput, exercise.word, 'sound-matching');
      setFeedback(feedback);
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        if (currentExercise < practice.exercises.length - 1) {
          setTimeout(() => {
            setCurrentExercise(prev => prev + 1);
            setUserInput('');
            setFeedback('');
          }, 1500);
        } else {
          setIsComplete(true);
        }
      }
    } else if (practice.type === 'word-recognition') {
      const exercise = practice.exercises[currentExercise];
      let isCorrect = false;
      
      if (exercise.type === 'sight-words') {
        isCorrect = exercise.words.includes(userInput.toLowerCase());
      } else if (exercise.type === 'word-patterns') {
        isCorrect = exercise.patterns.some(pattern => 
          pattern.words.includes(userInput.toLowerCase())
        );
      }
      
      if (isCorrect) {
        setScore(prev => prev + 1);
        setFeedback('Correct!');
      } else {
        setFeedback('Try again!');
      }
      
      setTimeout(() => {
        setUserInput('');
        setFeedback('');
      }, 1500);
    }
  };

  const renderExercise = () => {
    switch (practice.type) {
      case 'sound-matching':
        const soundExercise = practice.exercises[currentExercise];
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold">Sound Matching Exercise</h3>
              <button
                onClick={() => handleSoundPlayback(soundExercise.audio)}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            
            {showHint && (
              <div className="bg-white/10 p-4 rounded-lg mb-4">
                <p>Hints:</p>
                <ul className="list-disc list-inside">
                  {soundExercise.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type the word you hear..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                Check
              </button>
            </div>
          </div>
        );
        
      case 'word-recognition':
        const wordExercise = practice.exercises[currentExercise];
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              {wordExercise.type === 'sight-words' ? 'Sight Words Practice' : 'Word Patterns Practice'}
            </h3>
            
            {wordExercise.type === 'sight-words' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {wordExercise.words.map((word, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg text-center">
                    {word}
                  </div>
                ))}
              </div>
            )}
            
            {wordExercise.type === 'word-patterns' && (
              <div className="space-y-4 mb-6">
                {wordExercise.patterns.map((pattern, index) => (
                  <div key={index} className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Words with {pattern.family}</h4>
                    <div className="flex flex-wrap gap-2">
                      {pattern.words.map((word, wordIndex) => (
                        <span key={wordIndex} className="px-3 py-1 bg-white/20 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a word..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                Check
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
      {!isComplete ? (
        <>
          {renderExercise()}
          
          {feedback && (
            <div className={`mt-4 p-4 rounded-lg ${
              feedback.includes('Correct') ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {feedback}
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-blue-400 hover:text-blue-300 transition-all"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <span>Score: {score}</span>
          </div>
        </>
      ) : (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Practice Complete!</h3>
          <p className="mb-4">You scored {score} points</p>
          <button
            onClick={() => {
              setCurrentExercise(0);
              setScore(0);
              setIsComplete(false);
              setUserInput('');
              setFeedback('');
            }}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeExercises;