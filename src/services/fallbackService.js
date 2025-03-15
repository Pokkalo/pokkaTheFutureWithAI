// Fallback service that provides mock responses when API calls fail on GitHub Pages

// Sample responses for GitHub Pages fallback
const fallbackResponses = [
  "I'm sorry, but I'm currently running in fallback mode because of GitHub Pages API restrictions.",
  "GitHub Pages restricts certain API calls. For full functionality, please deploy a backend server.",
  "I'm currently using pre-written responses due to GitHub Pages authentication restrictions.",
  "Direct API calls from GitHub Pages can face authentication issues. Check the repository README for deploying a backend.",
  "I'm in fallback mode now. To get real AI responses, you would need to set up a backend proxy for the API.",
];

// Simulate network delay for realistic effect
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get a fallback response that relates to the user's input
export const getFallbackResponse = async (userMessage) => {
  // Simulate API call delay (0.5-1 second)
  await delay(500 + Math.random() * 500);
  
  // Select a random response
  const responseIndex = Math.floor(Math.random() * fallbackResponses.length);
  let response = fallbackResponses[responseIndex];
  
  // If the message appears to be a question, make it more conversational
  if (userMessage.endsWith('?')) {
    return `I see you asked: "${userMessage.slice(0, 30)}${userMessage.length > 30 ? '...' : ''}". ${response}`;
  }
  
  return response;
};
