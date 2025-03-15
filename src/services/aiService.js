// This service handles direct API calls to OpenRouter AI from the frontend
// WARNING: This approach exposes your API key in network requests

// API configuration
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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';
const MODEL = 'deepseek/deepseek-r1:free';

// Show a prominent console warning about API key exposure
const showSecurityWarning = () => {
  console.warn(
    '%c⚠️ SECURITY WARNING ⚠️',
    'background: #f44336; color: white; font-size: 14px; font-weight: bold; padding: 2px 4px; border-radius: 2px;',
    'Making API calls directly from the browser exposes your API key. ' +
    'This is acceptable for personal projects and demos but not recommended for production applications.'
  );
};

// Show the warning once when the service is first loaded
showSecurityWarning();

export const getAIResponse = async (userMessage) => {
  try {
    // For GitHub Pages deployment, show the warning again on each API call
    if (process.env.NODE_ENV === 'production') {
      showSecurityWarning();
    }
    
    console.log('Sending request to OpenRouter API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'AI Chat Demo',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    // Handle API error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error response:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('API response received:', data);
    
    // Extract and return the AI's response text
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in AI API request:', error);
    
    // Return a user-friendly error message
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return "Network error. Please check your internet connection and try again.";
    }
    
    return `Sorry, I couldn't process your request. Error: ${error.message || 'Unknown error'}`;
  }
};

// Additional helper method that could be useful for future features
export const checkAPIStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
