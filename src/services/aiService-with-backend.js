// Keep this file as a template for when you set up a backend

const isDev = process.env.NODE_ENV === 'development';
const API_URL = process.env.REACT_APP_API_URL || 
  (isDev ? 'http://localhost:5000/api/chat' : 'https://your-backend-url.com/api/chat');

export const getAIResponse = async (userMessage) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: userMessage
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling AI API:', error);
    throw error;
  }
};
