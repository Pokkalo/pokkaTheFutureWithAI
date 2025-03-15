import React from 'react';

const ChatMessage = ({ message }) => {
  const { text, sender } = message;
  
  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'ai-message'}`}>
      <div className="message-bubble">
        {sender === 'ai' && (
          <div className="avatar">
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 8a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c5.5 0 10 2.5 10 5v3H6v-3c0-2.5 4.5-5 10-5z" />
            </svg>
          </div>
        )}
        <div className="message-content">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
