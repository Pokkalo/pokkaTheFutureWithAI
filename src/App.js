import React from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Assistant</h1>
        <div className="demo-banner">GitHub Pages Demo Version</div>
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
