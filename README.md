# IIM Indore AI Assistant

A production-grade AI-powered chatbot for IIM Indore with multilingual support, multiple interaction styles, RAG (Retrieval-Augmented Generation), and guardrails.

## Features

- **6 Languages**: English, Hindi, Tamil, Telugu, Spanish, French
- **3 Chat Styles**: Professional, Casual, Minimalist
- **RAG (Retrieval-Augmented Generation)**: Grounded responses using IIM Indore knowledge base
- **Guardrails**: Topic control to keep responses focused on IIM Indore
- **Real-time Evaluation**: Collect and analyze user feedback
- **Analytics Dashboard**: Visualize performance metrics
- **Modern UI**: Built with React, TailwindCSS, and Lucide icons

## Quick Start

### Prerequisites
- Node.js 16+
- OpenAI API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the chatbot.

## Project Structure

```
multilingual-chatbot/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json
│   ├── .env.example
│   └── evaluations.json   # Stored feedback (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

- `POST /api/chat` - Send a message
  - Body: `{ message, language, style, conversationHistory }`
- `POST /api/evaluate` - Submit evaluation feedback
  - Body: `{ name, email, language, style, responseQuality, languageAccuracy, userExperience, multilingualSupport, comments }`
- `GET /api/evaluations` - Get all evaluations
- `GET /api/health` - Health check

## Deployment

### Deploy Backend to Railway/Render
1. Push to GitHub
2. Connect repository to Railway/Render
3. Set `OPENAI_API_KEY` environment variable
4. Deploy

### Deploy Frontend to Vercel
1. Push to GitHub
2. Import project to Vercel
3. Set API endpoint environment variable (if needed)
4. Deploy

## Features Breakdown

### 3 Chat Styles

1. **Professional**: Formal, courteous, solution-oriented tone
2. **Casual**: Friendly, conversational, relatable approach
3. **Minimalist**: Concise, direct, efficient responses

### 6 Languages

- English
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Spanish (Español)
- French (Français)

### Evaluation Metrics

Users can rate the chatbot on:
- Response Quality (1-10)
- Language Accuracy (1-10)
- User Experience (1-10)
- Multilingual Support (1-10)

### Analytics Dashboard

Real-time charts showing:
- Total evaluations
- Average ratings across metrics
- Language distribution
- Style distribution
- Ratings by language
- Recent feedback

## Advanced Features

### RAG (Retrieval-Augmented Generation)

The chatbot uses RAG to ground responses in a curated knowledge base about IIM Indore:

- **Knowledge Base**: Comprehensive JSON database with IIM Indore information
  - Institution details
  - Program information (MBA, PGPX, FDP)
  - Admissions process and eligibility
  - Placement statistics
  - Campus facilities
  - Faculty information
  - Student life and clubs
  - FAQs

- **Context Retrieval**: Keyword-based matching to retrieve relevant sections
- **Response Grounding**: LLM receives context to provide accurate, fact-based answers
- **Hallucination Reduction**: Responses are constrained by available knowledge

### Guardrails

Guardrails ensure the chatbot stays focused on IIM Indore topics:

- **Topic Classification**: Detects if query is IIM Indore-related
- **Off-Topic Handling**: Gracefully redirects off-topic questions
- **Multilingual Guardrails**: Guardrail responses in all 6 supported languages
- **Safety**: Prevents misuse while maintaining helpful tone

### How It Works

1. User sends a message
2. Guardrails check if query is on-topic
3. If off-topic, return guardrail response
4. If on-topic, retrieve relevant knowledge base sections
5. Enhance system prompt with context
6. Generate response with LLM
7. Return grounded, accurate answer

## License

MIT
