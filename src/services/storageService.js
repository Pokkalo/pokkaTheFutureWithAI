// Service to handle conversation storage
// This will be expanded for Google Sheets integration in the future

// Temporarily store conversations in localStorage until Google Sheets is integrated
export const saveConversation = (messages) => {
  try {
    // For now, just store in localStorage
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    conversations.push({
      timestamp: new Date().toISOString(),
      messages: messages
    });
    
    // Keep only the last 50 conversations to avoid localStorage limits
    const trimmedConversations = conversations.slice(-50);
    localStorage.setItem('conversations', JSON.stringify(trimmedConversations));
    
    // This is where Google Sheets integration will happen in the future
    // Will implement methods to:
    // 1. Authenticate with Google Sheets API
    // 2. Append new conversation data to specified sheet
    
    return true;
  } catch (error) {
    console.error('Error saving conversation:', error);
    return false;
  }
};

export const getConversations = () => {
  try {
    return JSON.parse(localStorage.getItem('conversations') || '[]');
  } catch (error) {
    console.error('Error retrieving conversations:', error);
    return [];
  }
};
