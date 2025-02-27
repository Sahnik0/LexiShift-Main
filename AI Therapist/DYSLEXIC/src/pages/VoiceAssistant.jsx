import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, User, Bot, MessageSquare } from 'lucide-react';
import OpenAI from 'openai';
import Lottie from "lottie-react";
import recordingAnimation from "./13.json"; // Your Lottie animation file
import idleAnimation from "./12.json"; // Your idle animation file

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error(
    'Missing OpenAI API key. Please add VITE_OPENAI_API_KEY to your .env file'
  );
}

// Initialize OpenAI with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

// TypewriterMessage component for animated text
const TypewriterMessage = ({ content, onComplete, audioUrl }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const contentArray = useRef(content.split(''));
  
  useEffect(() => {
    let index = 0;
    audioRef.current = new Audio(audioUrl);
    
    // Add audio completion listener
    audioRef.current.addEventListener('ended', () => {
      setIsAudioPlaying(false);
      onComplete?.();
    });
    
    const startTypewriter = () => {
      setIsTyping(true);
      setIsAudioPlaying(true);
      audioRef.current.play();
      
      const interval = setInterval(() => {
        if (index < contentArray.current.length) {
          setDisplayedContent(contentArray.current.slice(0, index + 1).join(''));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          // Note: We don't call onComplete here anymore
        }
      }, 50);
      
      return () => {
        clearInterval(interval);
      };
    };
    
    startTypewriter();
    
    return () => {
      audioRef.current.removeEventListener('ended', () => {
        setIsAudioPlaying(false);
        onComplete?.();
      });
      audioRef.current?.pause();
    };
  }, [content, onComplete, audioUrl]);
  
  return (
    <div className="text-gray-200 leading-relaxed">
      {displayedContent}
      {(isTyping || isAudioPlaying) && (
        <span className="inline-block w-1 h-4 ml-1 bg-blue-400 animate-pulse" />
      )}
    </div>
  );
};


const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize audio recording
  useEffect(() => {
    const initializeMediaRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1
          } 
        });
        
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          await processAudioInput();
          audioChunksRef.current = [];
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setError('Could not access microphone');
      }
    };

    initializeMediaRecorder();
  }, []);
  const promptArray = [
    {
      role: 'system',
      content: "You are an experienced therapist specializing in helping dyslexic individuals, especially children. Your tone should be gentle, joyful, and therapeutic, making every conversation feel warm and supportive. Speak in a way that builds confidence, using positive reinforcement and simple explanations to make learning enjoyable. Adapt your responses to be clear, engaging, and encouraging, using storytelling, metaphors, and interactive techniques when needed. Always respond with empathy and patience, ensuring the child feels understood and motivated. After every answer, ask a gentle, open-ended question to keep the conversation flowing. also while talking dont just generate points and say that steps that you can take... talk like normal people.. suppose a person has come to seek help from you and you are a very knowledgable person in this field.. so you can talk like a normal person and give them advice like normal people.. suppose user said Hello, I am very sad today because a friend of mine bullied me in school. I can't share this with my parents. Please can you help me? What should I do? I am feeling very low today.   then you  should not say like Here are a few things you can consider doing: 1. **Talk to someone you trust:** While you may not feel comfortable talking to your parents about this, is there someone else you trust, like a teacher, school counselor, or another friend? Sometimes sharing your feelings with someone supportive can help you feel better. 2. **Take care of yourself:** Engage in activities that bring you joy and help you relax, such as listening to music, reading a book, going for a walk, or any other hobbies you enjoy.       what i meant is like no point type talking... therapists will talk to you with heart and try to understand the actual problem and also treat the fragile person with care and in depth.. so like that no therapists say that go talk to someone else.. i mean thats pointless right? why would someone come to therapist if hes saying to talk to someone else.. so my point is that talk like a normal person"
    }
  ];

 
 const processAudioInput = async () => {
    try {
        setIsProcessing(true);
        setError(null);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
        });

        const userText = transcription.text;
        setMessages(prev => [...prev, { role: 'user', content: userText }]);

        // **Keep only the last 10 messages for memory (adjust as needed)**
        const conversationHistory = messages.slice(-10);  

        const chatResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                ...promptArray,  
                ...conversationHistory, // Send previous messages for memory
                { role: 'user', content: userText }
            ]
        });

        const assistantResponse = chatResponse.choices[0].message.content;

        const speechResponse = await openai.audio.speech.create({
            model: 'tts-1',
            voice: 'alloy',
            input: assistantResponse,
        });

        const audioUrl = URL.createObjectURL(await speechResponse.blob());
        setCurrentAudioUrl(audioUrl);

        setMessages(prev => [
            ...prev,
            { 
                role: 'assistant', 
                content: assistantResponse,
                audioUrl: audioUrl,
                needsTypewriter: true 
            }
        ]);

    } catch (error) {
        console.error('Error processing audio:', error);
        setError('Error processing audio. Please try again.');
    } finally {
        setIsProcessing(false);
    }
};



  const handleClick = () => {
    if (!isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current?.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 1000);
  };

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random());
      }, 100);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isRecording]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#001219] via-[#001824] to-[#001219]">
      {/* Left Side - Voice Interface */}
      <div className="w-1/2 flex items-center justify-center border-r border-gray-700/30">
        <div className="relative flex flex-col items-center">
          <button
            onClick={handleClick}
            disabled={isProcessing}
            className={`relative w-48 h-48 rounded-full flex items-center justify-center 
              transition-all duration-500 ease-in-out ${
                isRecording
                  ? "bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
                  : "bg-emerald-400/10 shadow-[0_0_60px_rgba(52,211,153,0.3)]"
              } hover:scale-105`}
          >
            <Lottie
              animationData={isRecording ? recordingAnimation : idleAnimation}
              loop
              className="w-32 h-32"
            />
          </button>

          <div className="mt-8">
            <span
              className={`text-lg font-medium tracking-wide px-6 py-2.5 rounded-full 
                ${isRecording ? "text-red-400 border border-red-500/20" : "text-emerald-400 border border-emerald-500/20"}
                bg-black/30 backdrop-blur-md transition-all duration-300 shadow-lg`}
            >
              {isProcessing ? "Processing..." : isRecording ? "Recording... Tap to stop" : "Give it a try!"}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="w-1/2 flex flex-col h-screen bg-gradient-to-br from-[#001219] via-[#001824] to-[#001219] ">
        <div className="py-7 px-8 border-b border-gray-700/30 bg-gradient-to-br from-[#001219] via-[#001824] to-[#001219] backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full  flex items-center justify-center">
              
            </div>
            <div>
              
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="space-y-6 px-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 mt-10 bg-black/10 rounded-2xl p-8 backdrop-blur-sm">
                <MessageSquare className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-300">Start a conversation</p>
                <p className="text-sm mt-2 max-w-xs">Press the button on the left and start speaking to begin talking with Dyslu</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-emerald-500/15 text-emerald-300 rounded-tr-none border border-emerald-500/10'
                      : 'bg-blue-500/15 text-blue-300 rounded-tl-none border border-blue-500/10'
                  }`}
                >
                  <div className="font-medium mb-2 text-sm opacity-80 flex items-center">
                    {message.role === 'user' ? 'You' : 'Dyslu(AI Therapist)'}
                    <span className="mx-1">•</span>
                    <span className="ml-2 text-xs opacity-50">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {message.needsTypewriter ? (
                    <TypewriterMessage 
                      content={message.content}
                      audioUrl={message.audioUrl}
                      onComplete={() => {
                        const updatedMessages = [...messages];
                        updatedMessages[index].needsTypewriter = false;
                        setMessages(updatedMessages);
                      }}
                    />
                  ) : (
                    <div className="text-gray-200 leading-relaxed">{message.content}</div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}
            
            {error && (
              <div className="p-5 rounded-lg bg-red-400/15 text-red-300 border border-red-400/30 shadow-lg backdrop-blur-sm">
                <p className="font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                  Error
                </p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center justify-center py-6 px-8 bg-blue-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <div className="flex space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="ml-3 text-blue-300 text-sm">Processing your request...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4  border-t border-gray-700/30 backdrop-blur-md">
          <div className="flex items-center justify-center text-gray-400 text-xs">
            <p>Press the microphone button to speak with Dyslu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;