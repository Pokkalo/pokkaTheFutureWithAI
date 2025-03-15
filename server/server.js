const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Use node-fetch instead of axios to avoid the deprecation warning
const fetch = require('node-fetch').default;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenRouter API endpoint
const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.AI_API_KEY || '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';

// API proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Using fetch instead of axios to avoid the deprecation warning
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://www.sitename.com',
        'X-Title': 'SiteName',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: message }],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling AI API:', error);
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
});
