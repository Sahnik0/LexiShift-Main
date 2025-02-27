import { createContext, useContext, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIContext = createContext();

export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const genAI = new GoogleGenerativeAI("AIzaSyCTN5D39G_BFlo8qjv2LrhI9oBL5u8waOw");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const generateFeedback = async (userAnswer, correctAnswer, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `As a teaching assistant, provide constructive feedback for a student who answered "${userAnswer}" to a question about ${topic}. The correct answer was "${correctAnswer}". Give a brief, encouraging explanation.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setLoading(false);
      return response.text();
    } catch (err) {
      setError(err);
      setLoading(false);
      return "Let's review this concept together!";
    }
  };

  const generateHint = async (question, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `As a tutor, provide a helpful hint for this question about ${topic}: "${question}". Guide the student's thinking without giving away the answer.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setLoading(false);
      return response.text();
    } catch (err) {
      setError(err);
      setLoading(false);
      return "Think about what we've learned so far.";
    }
  };

  const generateExplanation = async (concept, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Explain this ${topic} concept in simple terms: "${concept}". Include a brief example.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setLoading(false);
      return response.text();
    } catch (err) {
      setError(err);
      setLoading(false);
      return "Let's break this down step by step.";
    }
  };

  const value = {
    generateFeedback,
    generateHint,
    generateExplanation,
    loading,
    error
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}