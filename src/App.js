import React, { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';

function App() {
  const [isGitHubPages, setIsGitHubPages] = useState(false);
  
  useEffect(() => {
    // Check if we're running on GitHub Pages
    const isGHPages = window.location.hostname.includes('github.io');
    setIsGitHubPages(isGHPages);
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Assistant</h1>
        <div className="demo-banner">
          {isGitHubPages ? 
            "GitHub Pages Demo - API calls may be limited" : 
            "GitHub Pages Demo Version"}
        </div>
      </header>
      <main>
        <ChatInterface />
      </main>
      <footer>
        <p>Powered by AI Technology | <a href="https://github.com/yourusername/pokkaTheFutureWithAI" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
