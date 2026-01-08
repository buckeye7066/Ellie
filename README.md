# Ellie - Personal AI Assistant

A complete personal AI assistant application with advanced memory capabilities, interactive avatar, and intelligent learning features.

## Features

- 🧠 **Advanced Memory System** - Stores and retrieves conversations with semantic search
- 💬 **Interactive Chat** - Talk with Ellie using natural language with contextual awareness
- 👤 **HeyGen Avatar** - Visual interactive avatar that responds to conversations
- 📚 **Study Cards** - Spaced repetition flashcard system for effective learning
- 📥 **Content Import** - Upload documents (PDF, TXT, CSV, DOCX) or paste text
- 🔍 **AI-Powered Search** - Natural language queries to find relevant memories
- 📊 **Memory Insights** - Automatic summarization and pattern recognition
- 🎨 **Beautiful UI** - Purple and pink gradient theme with smooth animations

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom theme
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query** - State management and data fetching
- **Lucide React** - Beautiful icon library
- **localStorage** - Client-side persistence

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/buckeye7066/Ellie.git
cd Ellie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev:web
```

The application will be available at `http://localhost:3002`

### Available Scripts

- `npm run dev:web` - Start development server on port 3002
- `npm run build` - Build for production
- `npm run build:renderer` - Build renderer (same as build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input, Badge)
│   ├── layout/          # Layout components (Sidebar, Layout)
│   ├── HeyGenAvatar.jsx # Avatar component
│   └── MemoryInsights.jsx # Memory display component
├── pages/
│   ├── Dashboard.jsx    # Chat interface with avatar
│   ├── Memories.jsx     # Memory management and search
│   ├── Study.jsx        # Flashcard study system
│   ├── Import.jsx       # Content import
│   └── Settings.jsx     # App settings
├── entities/
│   ├── Memory.js        # Memory entity and storage
│   └── StudyCard.js     # Study card entity and storage
├── hooks/
│   ├── useMemories.js   # Memory management hook
│   └── useStudyCards.js # Study card management hook
├── lib/
│   ├── llm.js           # LLM integration helpers
│   └── utils.js         # Utility functions
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Usage

### Dashboard
- Chat with Ellie in real-time
- See relevant memories displayed with each conversation
- Avatar responds with visual feedback

### Memories
- View all stored memories
- Use AI search: "What did I discuss last week?"
- Filter by tags or text search
- Generate summaries of recent memories

### Study
- Review flashcards with spaced repetition
- Mark cards as correct/incorrect
- Algorithm automatically schedules reviews
- Track success rate and progress

### Import
- Upload files (PDF, TXT, CSV, DOCX)
- Paste text directly
- Content automatically split into memories
- Tagged for easy retrieval

### Settings
- View app information
- Clear all memories
- Clear all study cards

## AI Integration

The app includes mock LLM responses for development. To integrate with real LLM:

1. Update `src/lib/llm.js`
2. Set `MOCK_MODE = false`
3. Implement `callRealLLM` function with your LLM API

Supported AI patterns:
- Semantic memory search with relevance scoring
- Natural language queries
- Conversation summarization
- Contextual chat responses

## Theme

The application uses a custom purple/pink gradient theme:
- Primary: Purple-600 (#9333EA)
- Secondary: Pink-500 (#EC4899)
- Background: Purple-50 to Pink-50 gradient
- Cards: White with 80% opacity and backdrop blur

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

