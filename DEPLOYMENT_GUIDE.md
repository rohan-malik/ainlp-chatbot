# 🚀 AI NLP Chatbot - Deployment Guide

## One-Click Deployment Instructions

### Frontend Deployment (Netlify)

1. **Connect GitHub Repository**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Connect your GitHub account
   - Select repository: `rohan-malik/ainlp-chatbot`
   - Branch: `main`

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`

3. **Environment Variables**
   - No environment variables needed (uses default backend)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Your site will be live at: `https://ainlp-chatbot.netlify.app`

---

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `rohan-malik/ainlp-chatbot`
   - Branch: `main`

3. **Configure Service**
   - **Name**: `ainlp-chatbot-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty

4. **Environment Variables**
   - Add `OPENAI_API_KEY`: Your OpenAI API key
   - Add `PORT`: `5001`

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Your backend will be live at: `https://ainlp-chatbot-backend.onrender.com`

---

## Manual Local Deployment

### Frontend
```bash
cd frontend
npm install
npm run build
# dist folder is ready for deployment
```

### Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5001
```

---

## Features

✅ **Multilingual Support** - 6 languages with auto-detect  
✅ **Temperature Control** - Factual, Balanced, Creative  
✅ **Chat Styles** - Professional, Casual, Bollywood  
✅ **Quick Actions** - Pre-built query buttons  
✅ **RAG System** - Grounded in knowledge base  
✅ **Auto-Language Detection** - Responds in user's language  

---

## Live Demo

- **Frontend**: https://ainlp-chatbot.netlify.app
- **Backend API**: https://ainlp-chatbot-backend.onrender.com

---

## Support

For issues or questions, please refer to the README.md file.
