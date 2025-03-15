import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { getAIResponse, checkAPIStatus } from '../services/aiService';
import { saveConversation } from '../services/storageService';
import '../styles/chat.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerAwake, setIsServerAwake] = useState(null); // null = unknown, true = awake, false = asleep
  const messagesEndRef = useRef(null);

  // Check server status on component mount
  useEffect(() => {
    const checkServer = async () => {
      const status = await checkAPIStatus();
      setIsServerAwake(status);
    };
    
    checkServer();
  }, []);

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

    // If server was previously determined to be asleep, show a waking up message
    if (isServerAwake === false) {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: Date.now() + 0.5, text: "I'm waking up the server. This might take a moment for the first request...", sender: 'system' }
      ]);
    }

    console.log('Sending message:', input);
    
    try {
      // Get AI response
      const response = await getAIResponse(input);
      
      // Server is now definitely awake
      setIsServerAwake(true);
      
      // Add AI message
      const aiMessage = { id: Date.now() + 1, text: response, sender: 'ai' };
      setMessages(prevMessages => [
        // Remove any system "waking up" messages
        ...prevMessages.filter(msg => msg.sender !== 'system'),
        aiMessage
      ]);
      
      // Save conversation (for future Google Sheets integration)
      saveConversation([userMessage, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // If the error suggests the server is asleep, mark it as such
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setIsServerAwake(false);
      }
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { id: Date.now() + 1, text: 'Sorry, I had trouble processing that request. The backend server might need a moment to wake up. Please try again in a few seconds.', sender: 'ai' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {isServerAwake === false && (
        <div className="server-status">
          <div className="server-waking-up">
            <span className="pulse"></span>
            <span>The server is waking up...</span>
          </div>
        </div>
      )}
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
