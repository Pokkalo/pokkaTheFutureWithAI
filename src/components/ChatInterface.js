import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { getAIResponse } from '../services/aiService';
import { getFallbackResponse } from '../services/fallbackService';
import { saveConversation } from '../services/storageService';
import '../styles/chat.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    console.log('Sending message:', input);
    
    try {
      // Try to get AI response
      let response;
      try {
        response = await getAIResponse(input);
        
        // If response contains authentication error message, use fallback
        if (response.includes("Authentication error occurred")) {
          console.warn("Authentication error detected, switching to fallback mode");
          response = await getFallbackResponse(input);
        }
      } catch (apiError) {
        console.error("API call failed, using fallback response", apiError);
        response = await getFallbackResponse(input);
      }
      
      // Add AI message
      const aiMessage = { id: Date.now() + 1, text: response, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      // Save conversation (for future Google Sheets integration)
      saveConversation([userMessage, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { id: Date.now() + 1, text: 'Sorry, I had trouble processing that request.', sender: 'ai' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
