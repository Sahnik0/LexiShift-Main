import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, set, get } from 'firebase/database';
import { 
  ClipboardCheck, AlertCircle, ChevronRight, 
  Brain, CheckCircle, XCircle, RefreshCw,
  BarChart, Book, Users, ArrowRight,
  Edit, Clock, ListChecks, Lightbulb,
  ArrowLeft, HelpCircle, ChevronDown, RotateCcw
} from 'lucide-react';

function Screening() {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [previousResults, setPreviousResults] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  
  const questions = [
    {
      id: 1,
      text: "Does the individual have difficulty remembering the sequence of letters in words?",
      category: "Reading",
      weight: 2,
      icon: <Book className="h-6 w-6 text-blue-400" />,
      helpText: "This may manifest as mixing up the order of letters when reading or spelling."
    },
    {
      id: 2,
      text: "Is there a family history of reading or spelling difficulties?",
      category: "Background",
      weight: 1.5,
      icon: <Users className="h-6 w-6 text-blue-400" />,
      helpText: "Dyslexia often has a genetic component and can run in families."
    },
    {
      id: 3,
      text: "Does the individual struggle with rhyming words?",
      category: "Phonological",
      weight: 2,
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      helpText: "Difficulty recognizing or creating rhymes may indicate phonological processing challenges."
    },
    {
      id: 4,
      text: "Is there difficulty in organizing written and spoken language?",
      category: "Expression",
      weight: 1.5,
      icon: <Book className="h-6 w-6 text-blue-400" />,
      helpText: "This includes trouble structuring sentences or organizing thoughts coherently."
    },
    {
      id: 5,
      text: "Does the individual have trouble remembering sight words?",
      category: "Reading",
      weight: 2,
      icon: <Book className="h-6 w-6 text-blue-400" />,
      helpText: "Sight words are common words that should be recognized instantly without sounding out."
    },
    {
      id: 6,
      text: "Does the individual often reverse letters or numbers when writing (e.g., 'b' for 'd' or '6' for '9')?",
      category: "Writing",
      weight: 2.5,
      icon: <Edit className="h-6 w-6 text-blue-400" />,
      helpText: "Letter reversals beyond early childhood can be an indicator of dyslexia."
    },
    {
      id: 7,
      text: "Is there difficulty in distinguishing between similar sounds (like 'bat' and 'pat')?",
      category: "Phonological",
      weight: 2,
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      helpText: "This refers to phonemic awareness, the ability to identify and manipulate individual sounds."
    },
    {
      id: 8,
      text: "Does the individual take longer than peers to complete reading tasks?",
      category: "Reading Speed",
      weight: 1.5,
      icon: <Clock className="h-6 w-6 text-blue-400" />,
      helpText: "Reading may be slow and laborious compared to age-appropriate expectations."
    },
    {
      id: 9,
      text: "Is there difficulty in following multiple-step instructions?",
      category: "Processing",
      weight: 1.5,
      icon: <ListChecks className="h-6 w-6 text-blue-400" />,
      helpText: "This may indicate challenges with working memory or processing sequential information."
    },
    {
      id: 10,
      text: "Does the individual show strong creative or problem-solving abilities despite reading difficulties?",
      category: "Strengths",
      weight: 1,
      icon: <Lightbulb className="h-6 w-6 text-blue-400" />,
      helpText: "Many individuals with dyslexia have exceptional strengths in creative thinking and problem-solving."
    },
    {
      id: 11,
      text: "Does the individual struggle with spelling the same word consistently (spelling it differently each time)?",
      category: "Writing",
      weight: 2.5,
      icon: <Edit className="h-6 w-6 text-blue-400" />,
      helpText: "Inconsistent spelling suggests challenges with orthographic memory."
    },
    {
      id: 12,
      text: "Is there difficulty in breaking down words into individual sounds (phonemes)?",
      category: "Phonological",
      weight: 2.5,
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      helpText: "This phonological awareness skill is crucial for reading development."
    },
    {
      id: 13,
      text: "Does the individual have trouble with time management and organizing tasks?",
      category: "Executive Function",
      weight: 1.5,
      icon: <Clock className="h-6 w-6 text-blue-400" />,
      helpText: "Executive function challenges often co-occur with dyslexia."
    },
    {
      id: 14,
      text: "Is there difficulty in reading unfamiliar words that the individual hasn't seen before?",
      category: "Reading",
      weight: 2,
      icon: <Book className="h-6 w-6 text-blue-400" />,
      helpText: "This tests decoding ability, a core skill that may be impaired in dyslexia."
    },
    {
      id: 15,
      text: "Does the individual avoid reading aloud in front of others?",
      category: "Behavior",
      weight: 1.5,
      icon: <Users className="h-6 w-6 text-blue-400" />,
      helpText: "Avoidance behaviors can be a response to difficulties with reading fluency."
    },
    {
      id: 16,
      text: "Is there a significant difference between verbal ability and written expression?",
      category: "Expression",
      weight: 2,
      icon: <Edit className="h-6 w-6 text-blue-400" />,
      helpText: "Many individuals with dyslexia can express ideas well verbally but struggle to write them down."
    },
    {
      id: 17,
      text: "Does the individual have difficulty maintaining attention while reading?",
      category: "Processing",
      weight: 1.5,
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      helpText: "Reading may require so much mental effort that it becomes exhausting."
    },
    {
      id: 18,
      text: "Is there trouble remembering and following verbal instructions?",
      category: "Memory",
      weight: 2,
      icon: <Brain className="h-6 w-6 text-blue-400" />,
      helpText: "Working memory challenges can affect the ability to hold and process verbal information."
    },
    {
      id: 19,
      text: "Does the individual show signs of fatigue or frustration after reading for short periods?",
      category: "Reading Stamina",
      weight: 1.5,
      icon: <Clock className="h-6 w-6 text-blue-400" />,
      helpText: "Reading can be mentally exhausting when decoding doesn't come automatically."
    },
    {
      id: 20,
      text: "Is there difficulty in learning and remembering new vocabulary words?",
      category: "Memory",
      weight: 2,
      icon: <Book className="h-6 w-6 text-blue-400" />,
      helpText: "This may reflect challenges with phonological or orthographic memory."
    }
  ];

  useEffect(() => {
    const loadPreviousResults = async () => {
      if (currentUser) {
        try {
          const resultsRef = ref(database, `screenings/${currentUser.uid}/latest`);
          const snapshot = await get(resultsRef);
          if (snapshot.exists()) {
            setPreviousResults(snapshot.val());
          }
        } catch (error) {
          console.error("Error loading previous results:", error);
        }
      }
    };

    loadPreviousResults();
  }, [currentUser]);

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      try {
        const result = {
          answers: newAnswers,
          timestamp: new Date().toISOString(),
          riskLevel: calculateRisk(newAnswers),
          categoryScores: calculateCategoryScores(newAnswers)
        };
        
        if (currentUser) {
          await set(ref(database, `screenings/${currentUser.uid}/latest`), result);
        }
        
        setIsComplete(true);
      } catch (error) {
        console.error("Error saving results:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restartScreening = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
    setExpandedCategories([]);
  };

  const calculateRisk = (answers) => {
    const maxPossibleScore = questions.reduce((acc, q) => acc + q.weight, 0);
    const score = questions.reduce((acc, q, index) => {
      return acc + (answers[index] === true ? q.weight : 0);
    }, 0);
    
    const percentage = Math.round((score / maxPossibleScore) * 100);
    
    let riskLevel;
    if (percentage >= 70) riskLevel = "High";
    else if (percentage >= 40) riskLevel = "Moderate";
    else riskLevel = "Low";

    return {
      percentage,
      riskLevel,
      score,
      maxPossibleScore
    };
  };

  const calculateCategoryScores = (answers) => {
    // Group questions by category
    const categories = {};
    
    questions.forEach((q, index) => {
      if (!categories[q.category]) {
        categories[q.category] = {
          score: 0,
          maxScore: 0,
          count: 0,
          questions: []
        };
      }
      
      categories[q.category].maxScore += q.weight;
      categories[q.category].count += 1;
      
      if (answers[index] === true) {
        categories[q.category].score += q.weight;
      }
      
      categories[q.category].questions.push({
        id: q.id,
        text: q.text,
        answered: answers[index] === true,
        weight: q.weight
      });
    });
    
    // Calculate percentage for each category
    Object.keys(categories).forEach(cat => {
      categories[cat].percentage = Math.round((categories[cat].score / categories[cat].maxScore) * 100);
    });
    
    return categories;
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const renderResults = () => {
    const riskAssessment = calculateRisk(answers);
    const categoryScores = calculateCategoryScores(answers);
    
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, a], [, b]) => b.percentage - a.percentage);
    
    const getColorClass = (percentage) => {
      if (percentage >= 70) return 'text-red-400';
      if (percentage >= 40) return 'text-yellow-400';
      return 'text-green-400';
    };
    
    return (
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
        <div>
          {loading ? (
            <RefreshCw className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-spin" />
          ) : (
            <ClipboardCheck className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold mb-4 text-center">Screening Complete</h2>
          
          <div className="mb-8 text-center">
            <p className="text-xl mb-2">
              Risk Assessment: {' '}
              <span className={`font-semibold ${
                riskAssessment.riskLevel === 'High' ? 'text-red-400' :
                riskAssessment.riskLevel === 'Moderate' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {riskAssessment.riskLevel} ({riskAssessment.percentage}%)
              </span>
            </p>
            <p className="text-white/80">
              Based on your responses, there are indicators suggesting a {riskAssessment.riskLevel.toLowerCase()} risk of dyslexia.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-400" />
              Category Analysis
            </h3>
            <div className="space-y-4">
              {sortedCategories.map(([category, data]) => (
                <div key={category} className="bg-white/5 rounded-lg p-4">
                  <button 
                    onClick={() => toggleCategoryExpansion(category)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <div className="flex items-center gap-2">
                      {questions.find(q => q.category === category).icon}
                      <span className="font-medium">{category}</span>
                      <span className={`${getColorClass(data.percentage)} ml-2`}>
                        {data.percentage}%
                      </span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${
                      expandedCategories.includes(category) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedCategories.includes(category) && (
                    <div className="mt-3 pl-4 border-l border-white/10 text-white/80 space-y-2">
                      {data.questions.map(q => (
                        <div key={q.id} className="flex items-start gap-2">
                          {q.answered ? (
                            <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-white/30 shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm">{q.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-400" />
              Recommended Next Steps
            </h3>
            <ul className="text-left text-white/80 space-y-3">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-400" />
                Consult with an educational psychologist or learning specialist for a comprehensive assessment
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-400" />
                Share these results with teachers or education professionals to discuss potential accommodations
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-400" />
                Explore our resources section for support materials and learning strategies
              </li>
              {riskAssessment.riskLevel === 'High' && (
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                  Schedule an appointment with a dyslexia specialist as soon as possible
                </li>
              )}
            </ul>
          </div>

          {!currentUser && (
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8">
              <AlertCircle className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white/80 text-center">
                Create an account to save your results and access personalized resources
              </p>
            </div>
          )}

          {previousResults && (
            <div className="mb-8 p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Previous Screening</h3>
              <p className="text-white/60">
                Last completed: {new Date(previousResults.timestamp).toLocaleDateString()}
              </p>
              <p className="text-white/60">
                Previous risk level: {previousResults.riskLevel.riskLevel} ({previousResults.riskLevel.percentage}%)
              </p>
              
              {riskAssessment.percentage !== previousResults.riskLevel.percentage && (
                <div className="mt-2 p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-sm">
                    <span className="font-medium">Change in risk level: </span>
                    <span className={
                      riskAssessment.percentage > previousResults.riskLevel.percentage 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }>
                      {riskAssessment.percentage > previousResults.riskLevel.percentage ? '+' : ''}
                      {riskAssessment.percentage - previousResults.riskLevel.percentage}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <button
              onClick={restartScreening}
              className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Take Screening Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-300% animate-gradient">
              Dyslexia Screening
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            Complete this screening to identify potential signs of dyslexia
          </p>
          
          {!isComplete && (
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 text-white/60 text-sm">
              <button 
                onClick={() => setShowCategoryInfo(!showCategoryInfo)}
                className="flex items-center gap-1 hover:text-white/80 transition"
              >
                <Brain className="h-4 w-4" />
                {showCategoryInfo ? 'Hide' : 'Show'} Category Information
              </button>
              
              <span className="hidden sm:inline">•</span>
              
              <p>This screening takes about 5 minutes</p>
            </div>
          )}
        </div>

        {showCategoryInfo && !isComplete && (
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-white/80">
            <h3 className="font-semibold mb-3 text-white">Understanding the Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Book className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Reading</p>
                  <p>Core reading skills including decoding, sight word recognition, and comprehension.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Brain className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Phonological</p>
                  <p>The ability to recognize and manipulate the sounds in spoken language.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Edit className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Writing</p>
                  <p>Skills related to spelling, handwriting, and written expression.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Processing & Memory</p>
                  <p>How information is processed, stored, and retrieved.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowCategoryInfo(false)}
              className="mt-4 text-blue-400 text-sm hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {!isComplete ? (
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center text-sm text-white/60 mb-4">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span className="flex items-center gap-2">
                  {questions[currentStep].icon}
                  {questions[currentStep].category}
                </span>
              </div>
              
              <div className="relative">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 pr-8">
                  {questions[currentStep].text}
                </h2>
                
                <button 
                  className="absolute right-0 top-0"
                  onMouseEnter={() => setShowHelpTooltip(true)}
                  onMouseLeave={() => setShowHelpTooltip(false)}
                  onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                  aria-label="Help information"
                >
                  <HelpCircle className="h-5 w-5 text-blue-400/70" />
                </button>
                
                {showHelpTooltip && (
                  <div className="absolute right-0 top-6 z-10 w-full sm:max-w-xs bg-blue-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-sm text-white/90 shadow-xl">
                    {questions[currentStep].helpText}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                <button
                  onClick={() => handleAnswer(true)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  aria-label="Yes"
                >
                  <CheckCircle className="h-5 w-5" />
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  aria-label="No"
                >
                  <XCircle className="h-5 w-5" />
                  No
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                disabled={currentStep === 0}
                className={`text-sm flex items-center gap-1 ${
                  currentStep === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white/60 hover:text-white/90'
                }`}
                aria-label="Go back to previous question"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              
              <div className="flex-1">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={((currentStep + 1) / questions.length) * 100}
                    role="progressbar"
                    aria-label="Screening progress"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          renderResults()
        )}
        
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>
            This screening tool is meant for informational purposes only and is not a diagnostic tool.
            <br className="hidden sm:block" /> Please consult with a qualified professional for diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Screening;