import { createContext, useContext, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AIContext = createContext();

export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the Google Generative AI with your API key
  const genAI = new GoogleGenerativeAI("AIzaSyCTN5D39G_BFlo8qjv2LrhI9oBL5u8waOw");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const generateFeedback = async (userAnswer, correctAnswer, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a more specific prompt that generates clearer feedback
      const prompt = `
        As a teaching assistant, provide brief, encouraging feedback (2-3 sentences max) for a student 
        who answered "${userAnswer}" to a question about ${topic}. 
        The correct answer was "${correctAnswer}".
        DO NOT start with "Correct" or "Incorrect" as that will be added separately.
        Focus on explaining why the answer is right or wrong in simple terms, appropriate for a learning app.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      setLoading(false);
      return text;
    } catch (err) {
      console.error("AI Feedback Error:", err);
      setError(err);
      setLoading(false);
      
      // Return fallback feedback based on whether the answer was correct
      return userAnswer === correctAnswer 
        ? "Good job! You've got the right answer."
        : `Let's review this concept. The correct answer is "${correctAnswer}".`;
    }
  };

  const generateHint = async (question, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a more specific prompt for better hints
      const prompt = `
        As a helpful tutor, provide a short, specific hint (1-2 sentences only) for this question about ${topic}: 
        "${question}"
        Guide the student's thinking without revealing the answer.
        Make the hint actionable and clear.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      setLoading(false);
      return text;
    } catch (err) {
      console.error("AI Hint Error:", err);
      setError(err);
      setLoading(false);
      
      // Return a more helpful fallback hint
      return "Think about the key concepts we covered in this section. Try looking for patterns or specific characteristics.";
    }
  };

  const generateExplanation = async (concept, topic) => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Explain this ${topic} concept in simple terms: "${concept}". Include a brief example.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      setLoading(false);
      return text;
    } catch (err) {
      console.error("AI Explanation Error:", err);
      setError(err);
      setLoading(false);
      return "Let's break this down step by step. This concept is about understanding how things work together.";
    }
  };

  // Add a simple method to check if the AI service is available
  const checkAIAvailability = async () => {
    try {
      await model.generateContent("Hello");
      return true;
    } catch (err) {
      return false;
    }
  };

  const value = {
    generateFeedback,
    generateHint,
    generateExplanation,
    checkAIAvailability,
    loading,
    error
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}