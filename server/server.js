const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Use node-fetch instead of axios to avoid the deprecation warning
const fetch = require('node-fetch').default;

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration to allow requests from GitHub Pages
const corsOptions = {
  origin: ['https://lo1pak1hang.github.io', 'http://localhost:3000', '*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// OpenRouter API endpoint
const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.AI_API_KEY || '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';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Processing message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
    
    // Using fetch to make request to OpenRouter
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://pokkathefuturewithai.onrender.com',
        'X-Title': 'PokkaTheFutureWithAI',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: message }],
        max_tokens: 500
      }),
    });
    
    // Log response status
    console.log('OpenRouter API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from OpenRouter API:', errorText);
      
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        errorJson = { message: errorText };
      }
      
      return res.status(response.status).json({
        error: 'Error from AI service',
        details: errorJson
      });
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('Successfully received AI response');
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI service',
      details: error.message
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API URL: ${AI_API_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
