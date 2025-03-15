# Modern AI Chat Bot

A responsive chat interface powered by AI with modern design.

## Features

- Modern, mobile-friendly chat interface
- AI-powered responses via OpenRouter API
- Ready for future integration with Google Sheets for data storage

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Update the `.env` file with your API keys
4. Run the development server:
```
npm run dev
```

## Troubleshooting

### Deprecation Warning

If you see this warning:
```
[DEP0060] DeprecationWarning: The `util._extend` API is deprecated
```

This comes from a dependency using deprecated Node.js API. We've temporarily suppressed this warning in the server.js file. To find the exact source of the warning, run:

```
npm run server:trace
```

This will help identify which package needs updating.

## API Integration

This project uses OpenRouter's API. You can modify `aiService.js` and `server.js` to work with any AI provider.

### Obtaining API Keys

1. Visit [OpenRouter](https://openrouter.ai/) and create an account
2. Create an API key
3. Add the key to your `.env` file as `AI_API_KEY`

## Future Google Sheets Integration

The `storageService.js` file contains placeholders for Google Sheets integration. To implement this:

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create OAuth credentials or service account
4. Use Google Sheets API Node.js client to append data to a sheet

## Project Structure

- `/src/components` - React components for the UI
- `/src/services` - Service modules for API and storage
- `/src/styles` - CSS styles
- `/server` - Backend Express server for API proxy

## Deployment

Build the production version:
```
npm run build
```

The backend and frontend can be deployed separately or together depending on your hosting solution.

### GitHub Pages (Frontend Only)

You can host the React frontend for free on GitHub Pages:

1. Install `gh-pages` package:
```
npm install --save-dev gh-pages
```

2. Run the deployment script:
```
npm run deploy
```

3. Your app will be available at `https://yourusername.github.io/pokkaTheFutureWithAI`

### Backend Deployment

Since GitHub Pages only hosts static content, you need to deploy the backend separately:

1. Free options for backend hosting:
   - [Render](https://render.com) (offers a free tier)
   - [Railway](https://railway.app) (limited free tier)
   - [Fly.io](https://fly.io) (free for small apps)

2. After deploying the backend, update the API URL in `src/services/aiService.js`

### Full-Stack Free Deployment

For a completely free full-stack deployment:

1. Host frontend on GitHub Pages
2. Host backend on Render/Railway/Fly.io
3. Update the API URL in the frontend code before building
4. Make sure CORS is properly configured on your backend

## Free Backend Hosting Options

### 1. Render.com (Recommended)
- Free tier includes:
  - 750 hours of runtime per month
  - Automatic HTTPS
  - Simple GitHub integration
- Setup instructions:
  1. Create a free account at [Render](https://render.com)
  2. Connect your GitHub repository
  3. Create a new Web Service
  4. Set the build command: `npm install`
  5. Set the start command: `node server/server.js`
  6. Add your environment variables (API_KEY, etc.)

### 2. Railway.app
- Free tier includes:
  - $5 of usage credits per month
  - Enough for small projects with minimal traffic
- Setup is similar to Render.com

### 3. Fly.io
- Free tier includes:
  - 3 shared-CPU VMs
  - 3GB of persistent volume storage
  - 160GB of outbound data transfer
- Requires a bit more configuration

### 4. Netlify Functions (Serverless)
- Free tier includes:
  - 125,000 function invocations per month
  - 100 hours of runtime per month
- Requires adapting the backend into serverless functions

## Adapting for GitHub Pages + Free Backend

The ideal setup is:
1. Frontend on GitHub Pages
2. Backend on Render.com or similar free service
3. Update `aiService.js` with the deployed backend URL
