// This service handles direct API calls to OpenRouter AI from the frontend

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
    console.log('Current location:', window.location.href);
    
    // Create request options with proper headers for CORS
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add API key in the format OpenRouter expects
        'Authorization': `Bearer ${API_KEY}`,
        // These headers are required by OpenRouter
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Chat Demo',
        // Add CORS headers that might help
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: userMessage }],
        // Add extra parameters that might help
        stream: false,
        max_tokens: 500
      }),
    };
    
    console.log('Request headers:', requestOptions.headers);
    
    const response = await fetch(API_URL, requestOptions);

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries([...response.headers]));

    // Handle API error responses
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Error data from API:', errorData);
        errorMessage += ` - ${errorData.error?.message || 'Unknown error'}`;
      } catch (jsonError) {
        console.error('Could not parse error response as JSON:', jsonError);
        errorMessage += ' - Could not parse error details';
      }
      throw new Error(errorMessage);
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
    
    // For GitHub Pages deployment - provide a more helpful error message
    if (error.message?.includes('401')) {
      return "Authentication error occurred. When deployed on GitHub Pages, direct API calls may be restricted. Consider using a backend proxy server. Check the console for more details.";
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
