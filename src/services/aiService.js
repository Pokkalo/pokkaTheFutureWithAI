// This service handles communication with the backend proxy server on Render.com

// Point directly to your Render.com backend
const BACKEND_URL = 'https://pokkathefuturewithai.onrender.com/api/chat';

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
    console.log('Sending request to backend proxy at:', BACKEND_URL);
    
    // Send request to your backend proxy server instead of directly to OpenRouter
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No need to include API key here as the backend handles it
      },
      body: JSON.stringify({ 
        message: userMessage
      }),
    });

    console.log('Response status:', response.status);
    
    // Handle API error responses
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        console.error('Error data from API:', errorData);
        errorMessage += ` - ${errorData.error || errorData.message || 'Unknown error'}`;
      } catch (jsonError) {
        console.error('Could not parse error response as JSON:', jsonError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Response received successfully');
    
    // Return the response from your backend proxy
    return data.response;
  } catch (error) {
    console.error('Error in API request:', error);
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      return "Network error. Please check if the backend server is running and accessible.";
    }
    
    if (error.message?.includes('403')) {
      return "Access forbidden. The backend server may be blocking requests from this domain. Check CORS configuration on your backend server.";
    }
    
    return `Sorry, I couldn't process your request. Error: ${error.message || 'Unknown error'}`;
  }
};

// Additional helper method that could be useful for future features
export const checkAPIStatus = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
