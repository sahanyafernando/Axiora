# Axiora - AI-Powered Goal Management & Productivity Platform

A comprehensive, production-ready web application with PWA support for managing goals, tasks, expenses, and tracking progress. Features an intelligent AI assistant with voice and text input powered by free, open-source Hugging Face models.

## ✨ Features

### Core Functionality
- **Goal Management**: Create, edit, delete, and track goals with deadlines, priorities, and progress tracking
- **Daily To-Do List**: Manage daily tasks with optional goal linkage, auto-reset functionality
- **Expense Tracking**: Log expenses by category with monthly/yearly summaries and visual breakdowns
- **Progress Dashboard**: Visual analytics with progress bars, completion rates, and streak tracking

### AI Assistant (Voice + Text)
- **Natural Language Processing**: Understand commands like "Add a goal to finish this task in 7 days"
- **Voice Control**: Speech-to-text and text-to-speech using Web Speech API
- **Intent Recognition**: Smart parsing of user commands using Hugging Face models (with fallback)
- **Action Confirmation**: Safety confirmations for destructive actions
- **Motivational Guidance**: Context-aware productivity advice

### Technical Features
- **PWA Support**: Installable on mobile/tablet/desktop
- **Offline Capable**: Service Worker for offline functionality
- **Real-time Updates**: Supabase realtime subscriptions
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Type-Safe**: Full TypeScript support

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, SWR
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI**: Hugging Face Inference API (free tier), Web Speech API
- **Charts**: Recharts
- **PWA**: next-pwa

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Optional: Hugging Face account (for enhanced AI features)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Axiora
npm install
# or
yarn install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → API** and copy:
   - Project URL
   - Anon/Public Key

### 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and execute it in the SQL Editor
4. This creates:
   - Tables (goals, tasks, expenses)
   - Indexes for performance
   - Row Level Security policies
   - Triggers for auto-updating timestamps and progress

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hugging Face API Key (Optional - app works without it)
# Get from https://huggingface.co/settings/tokens
NEXT_PUBLIC_HF_API_KEY=your_huggingface_api_key
```

**Note**: The app includes a fallback rule-based intent parser, so Hugging Face API key is optional. However, it provides better AI understanding.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📱 PWA Installation

1. **Desktop**: Use Chrome/Edge and click the install icon in the address bar
2. **Mobile**: 
   - **Android**: Open in Chrome, tap menu → "Add to Home screen"
   - **iOS**: Open in Safari, tap Share → "Add to Home Screen"

**Note**: PWA features require HTTPS (automatic on Vercel/production)

## 🎯 Usage Guide

### Creating Goals

1. Navigate to the **Goals** tab
2. Click **"Add Goal"** button
3. Fill in:
   - Title (required)
   - Description (optional)
   - Deadline (required)
   - Priority (low, medium, high, critical)
4. Save

**Via AI**: Say or type "Add a goal to finish this project in 7 days"

### Managing Tasks

1. Go to **Tasks** tab
2. Add tasks for today or link to goals
3. Mark complete by clicking the checkbox
4. Tasks automatically reset daily view

**Via AI**: Say or type "Add task: buy groceries"

### Tracking Expenses

1. Go to **Expenses** tab
2. Click **"Add Expense"**
3. Enter:
   - Amount
   - Category (predefined list)
   - Description (optional)
   - Date
4. View charts and summaries

**Via AI**: Say or type "I spent 500 on food today"

### Using AI Assistant

1. Click the floating AI assistant button (bottom right)
2. **Text Input**: Type your request in the input field
3. **Voice Input**: Click the microphone icon to use voice
4. The assistant will:
   - Parse your intent
   - Confirm actions when needed
   - Execute commands
   - Provide feedback

**Example Commands**:
- "Show my progress this month"
- "Add a goal to learn React in 30 days"
- "I spent 50 dollars on transportation"
- "What can I do to improve productivity?"

### Dashboard

The dashboard shows:
- Goal statistics (total, active, completed, completion rate)
- Task statistics (today's progress, weekly rate, streak)
- Expense statistics (monthly, yearly, category breakdown)
- Active goals with progress bars
- Visual charts for expense categories

## 🔒 Security & Privacy

- **Authentication**: Supabase Auth (email/password, OAuth ready)
- **Row Level Security**: Users can only access their own data
- **Data Encryption**: All data encrypted at rest (Supabase)
- **HTTPS**: Required for PWA (automatic in production)
- **No Data Sharing**: All AI processing respects user privacy

## 🧪 Testing

The app works best with:
- **Chrome/Edge**: Full Web Speech API support
- **Firefox/Safari**: Limited voice features (text input works)

## 📚 Project Structure

```
Axiora/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ai/           # AI endpoints
│   │   ├── goals/        # Goals API
│   │   ├── tasks/        # Tasks API
│   │   ├── expenses/     # Expenses API
│   │   └── dashboard/    # Dashboard API
│   ├── auth/             # Auth page
│   └── page.tsx          # Main page
├── components/            # React components
│   ├── Dashboard.tsx
│   ├── GoalsPage.tsx
│   ├── TasksPage.tsx
│   ├── ExpensesPage.tsx
│   ├── AIAssistant.tsx   # AI Assistant component
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── ai/               # AI intent parsing
│   ├── supabase/         # Supabase clients
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── store/                 # Zustand store
├── supabase/              # Database schema
└── public/                # Static assets
    └── manifest.json     # PWA manifest
```

## 🚧 Known Limitations

1. **Voice Recognition**: Requires Chrome/Edge for full functionality
2. **Hugging Face Rate Limits**: Free tier has ~1000 requests/month
3. **Browser Compatibility**: Some features require modern browsers

## 🔮 Future Enhancements

- Budget management and alerts
- Habit tracking with streaks
- Time tracking
- Calendar view
- Notes and journaling
- Collaboration features
- Native mobile apps (React Native)
- Export/Import functionality

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using free and open-source tools**
