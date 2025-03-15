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

// Check if Render.com service is awake
const wakeupRenderService = async () => {
  try {
    const response = await fetch('https://pokkathefuturewithai.onrender.com/health', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (response.ok) {
      console.log('Render service is awake and responding');
      return true;
    } else {
      console.warn('Render service health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Could not wake up Render service:', error);
    return false;
  }
};

// Try to wake up the service on module load
wakeupRenderService();

export const getAIResponse = async (userMessage) => {
  try {
    // Try to wake up the service first
    await wakeupRenderService();
    
    console.log('Sending request to backend proxy at:', BACKEND_URL);
    
    // Send request to your backend proxy server with specific options for CORS
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      mode: 'cors', // Explicitly request CORS
      cache: 'no-cache', // Don't use cached responses
      credentials: 'same-origin', // Include credentials only for same origin
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
    
    // Handle specific error cases
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('Network Error')) {
      // Give a more helpful error message about Render.com's free tier
      return "Network error connecting to the backend. Render.com's free tier may have put the service to sleep due to inactivity. Please try again in a moment while the server wakes up (it can take up to 30-60 seconds for the first request).";
    }
    
    if (error.message?.includes('403')) {
      return "Access forbidden. The backend server may be blocking requests from GitHub Pages. Check CORS configuration on your backend server.";
    }
    
    // General error case
    return `Sorry, I couldn't process your request. Error: ${error.message || 'Unknown error'}`;
  }
};

// Additional helper method that could be useful for future features
export const checkAPIStatus = async () => {
  try {
    // Use the backend health check endpoint
    return await wakeupRenderService();
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
