# Axiora - Design Document
**AI-Powered Goal Management & Productivity Platform**

---

## 1. High-Level System Architecture

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │   PWA App    │  │   Mobile     │      │
│  │  (Next.js)   │  │  (Installed) │  │  (PWA)       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐             │
│         │   Voice API (Web Speech API)        │             │
│         │   - Speech-to-Text                  │             │
│         │   - Text-to-Speech                  │             │
│         └─────────────────────────────────────┘             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                     API LAYER (Next.js API Routes)          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Goals    │  │   Tasks    │  │  Expenses  │           │
│  │   API      │  │   API      │  │   API      │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│  ┌────────────┐  ┌────────────┐                           │
│  │   AI       │  │  Dashboard │                           │
│  │   API      │  │   API      │                           │
│  └────────────┘  └────────────┘                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴────────┐  ┌───────┴────────┐  ┌───────┴────────┐
│   Supabase    │  │   Hugging Face │  │   Auth (Supabase│
│   (PostgreSQL)│  │   Inference API│  │   Auth)         │
│               │  │                │  │                 │
│ - Goals       │  │ - Text Models  │  │ - JWT Tokens   │
│ - Tasks       │  │ - Whisper STT  │  │ - User Sessions│
│ - Expenses    │  │ - Intent Parse │  │                 │
│ - User Data   │  │                │  │                 │
└───────────────┘  └────────────────┘  └─────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router) - React framework with SSR/SSG
- TypeScript - Type safety
- Tailwind CSS - Utility-first styling
- React Context + Zustand - State management
- Web Speech API - Voice input/output
- Workbox (via next-pwa) - PWA capabilities

**Backend:**
- Next.js API Routes - Serverless functions
- Supabase - PostgreSQL database + Auth + Realtime
- Hugging Face Inference API - Free AI models

**AI Integration:**
- Hugging Face Inference API (free tier)
- Web Speech API for client-side STT/TTS
- Custom intent parsing middleware

---

## 2. Detailed Feature Breakdown

### 2.1 Goal Management

**Data Model:**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `title` (string, required)
- `description` (text, optional)
- `deadline` (timestamp, required)
- `priority` (enum: 'low', 'medium', 'high', 'critical')
- `status` (enum: 'pending', 'in_progress', 'completed', 'archived')
- `progress_percentage` (integer, 0-100, computed from tasks)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Features:**
- CRUD operations with optimistic updates
- Progress calculation: `(completed_tasks / total_tasks) * 100`
- Remaining days calculation:
  - Days until deadline
  - Days remaining in current year (displayed separately)
- Priority-based sorting and filtering
- Status-based views (all, active, completed)
- Visual progress indicators (circular progress bars)
- Drag-and-drop reordering (optional enhancement)

**UI Components:**
- GoalCard component with progress visualization
- GoalForm modal for create/edit
- GoalList with filtering and sorting
- ProgressBadge component
- CountdownTimer component

### 2.2 Daily To-Do List

**Data Model:**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `goal_id` (UUID, foreign key, nullable - for linked tasks)
- `title` (string, required)
- `description` (text, optional)
- `completed` (boolean, default false)
- `due_date` (date, required - defaults to today)
- `priority` (enum: 'low', 'medium', 'high')
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `completed_at` (timestamp, nullable)

**Features:**
- Add tasks with optional goal linkage
- Mark complete/incomplete with smooth animations
- Auto-reset: Tasks from previous days move to "Previous Tasks" section
- Today's tasks displayed prominently
- Filter by goal, priority, completion status
- Quick add inline component
- Bulk operations (mark all complete, delete completed)

**UI Components:**
- TaskItem with checkbox and animations
- TaskList grouped by date
- QuickAddTask component
- TaskForm modal
- TaskFilters component

### 2.3 Expense Tracking

**Data Model:**
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `amount` (decimal, required, precision: 10, scale: 2)
- `category` (string, required) - predefined categories
- `description` (text, optional)
- `date` (date, required, default: today)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Predefined Categories:**
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Health & Fitness
- Education
- Travel
- Other

**Features:**
- Add expenses with amount, category, description
- Monthly/yearly summaries with totals
- Category-wise breakdown (pie chart, bar chart)
- Date range filtering
- Export to CSV (future enhancement)
- Budget alerts (future enhancement)
- Recurring expenses detection (future enhancement)

**UI Components:**
- ExpenseForm component
- ExpenseList with grouping by date
- ExpenseChart (using Chart.js or Recharts)
- CategoryFilter component
- SummaryCard component

### 2.4 Progress Dashboard

**Metrics Displayed:**
1. **Goal Statistics:**
   - Total goals (all time)
   - Active goals (pending + in_progress)
   - Completed goals
   - Completion rate: `(completed / total) * 100`
   - Average progress: `avg(progress_percentage)`

2. **Task Statistics:**
   - Today's tasks completed / total
   - Weekly completion rate
   - Streak days (consecutive days with completed tasks)

3. **Expense Statistics:**
   - Monthly spending total
   - Yearly spending total
   - Category breakdown (top 5)
   - Average daily spending

4. **Visual Indicators:**
   - Progress bars for each active goal
   - Circular progress indicators
   - Sparkline charts for weekly trends
   - Category pie chart for expenses
   - Timeline visualization for goal deadlines

**UI Components:**
- DashboardStats grid
- ProgressBar component (horizontal, circular)
- GoalProgressCard
- TaskCompletionChart
- ExpenseCategoryChart
- WeeklyTrendChart
- RemainingDaysWidget

---

## 3. AI Assistant Design (Intent Parsing Logic)

### 3.1 Intent Classification

The AI assistant uses a multi-stage pipeline:

1. **Speech-to-Text** (Client-side Web Speech API)
2. **Intent Classification** (Hugging Face model)
3. **Entity Extraction** (Custom parsing + Hugging Face model)
4. **Action Execution** (API call)
5. **Response Generation** (Hugging Face model)
6. **Text-to-Speech** (Client-side Web Speech API)

### 3.2 Supported Intents

| Intent | Description | Entities Required | Example |
|--------|-------------|-------------------|---------|
| `create_goal` | Create a new goal | title, deadline | "Add a goal to finish this task in 7 days" |
| `update_goal` | Update existing goal | goal_id, fields | "Mark goal X as completed" |
| `delete_goal` | Delete a goal | goal_id | "Delete goal X" |
| `create_task` | Add a task | title, [due_date] | "Add task: buy groceries" |
| `complete_task` | Mark task complete | task_id | "Complete task X" |
| `add_expense` | Log an expense | amount, category, [date] | "I spent 500 on food today" |
| `show_progress` | Display progress | [time_range] | "Show my progress this month" |
| `show_stats` | Show statistics | [metric] | "Show my expenses" |
| `get_guidance` | Ask for advice | question | "How can I improve my productivity?" |
| `confirm_action` | Confirm before executing | action_details | Auto-generated confirmations |

### 3.3 Intent Parsing Flow

```
User Input (Text/Voice)
    ↓
Preprocessing (lowercase, remove punctuation, tokenize)
    ↓
Intent Classification Model (Hugging Face)
    ↓
Entity Extraction (NER + Regex patterns)
    ↓
Slot Filling (extract: amounts, dates, categories, IDs)
    ↓
Validation (check required entities)
    ↓
If incomplete → Ask for clarification
If complete → Generate confirmation prompt
    ↓
User confirms → Execute action
User rejects → Cancel
```

### 3.4 Entity Extraction Patterns

**Dates/Deadlines:**
- Regex: `in (\d+) (day|days|week|weeks|month|months)`
- Regex: `by (\w+day|\d{1,2}\/\d{1,2}\/\d{4})`
- NLP: Date parsing with natural language (e.g., "tomorrow", "next week")

**Amounts:**
- Regex: `(\d+(?:\.\d{2})?) (on|for|spent|cost)`
- Pattern: `{amount} on {category}`

**Categories:**
- Pattern matching against predefined list
- Fuzzy matching for typos

**Task/Goal IDs:**
- Context-aware: "this goal", "last task", "goal X"
- Use recent activity to resolve references

### 3.5 Action Execution Flow

```javascript
async function executeIntent(intent, entities, userId) {
  switch(intent) {
    case 'create_goal':
      return await createGoal({
        title: entities.title,
        deadline: calculateDeadline(entities.deadline),
        priority: entities.priority || 'medium',
        user_id: userId
      });
    
    case 'add_expense':
      // Confirm amount and category before saving
      if (!entities.amount || !entities.category) {
        return { type: 'clarify', message: 'Please specify amount and category' };
      }
      return await addExpense({
        amount: parseFloat(entities.amount),
        category: normalizeCategory(entities.category),
        date: entities.date || new Date(),
        user_id: userId
      });
    
    // ... other cases
  }
}
```

---

## 4. Prompt Templates for AI Assistant

### 4.1 Intent Classification Prompt

```
System: You are an intent classifier for a goal management app. Classify user input into one of these intents:
- create_goal, update_goal, delete_goal
- create_task, complete_task, delete_task
- add_expense, show_expenses
- show_progress, show_stats
- get_guidance
- confirm_action, cancel_action

User: "{user_input}"

Respond with ONLY the intent name in JSON format:
{"intent": "intent_name", "confidence": 0.0-1.0}
```

### 4.2 Entity Extraction Prompt

```
System: Extract entities from the user input for {intent}.

Required entities:
- create_goal: title, deadline, [priority]
- add_expense: amount, category, [date]
- create_task: title, [due_date], [goal_id]

User: "{user_input}"

Respond with JSON:
{
  "entities": {
    "title": "...",
    "deadline": "...",
    "amount": "...",
    "category": "..."
  },
  "confidence": 0.0-1.0
}
```

### 4.3 Confirmation Prompt

```
System: Generate a friendly confirmation message for the user action.

Action: {action_description}
Details: {extracted_entities}

Format:
- Be concise (1-2 sentences)
- Use natural language
- Include key details (amount, date, title)
- Ask for confirmation: "Should I {action}?"

Example:
"I'll add a goal: '{title}' with deadline {deadline}. Should I save it?"
```

### 4.4 Guidance Prompt

```
System: You are a productivity coach. Provide helpful, motivational guidance to users managing goals and tasks.

Context:
- User's active goals: {goals_count}
- Completed tasks this week: {tasks_count}
- Current progress: {progress_percentage}%

User Question: "{user_question}"

Guidelines:
- Be encouraging and constructive
- Offer specific, actionable advice
- Keep responses under 150 words
- Use a friendly, supportive tone
- If goals are unrealistic, suggest better planning without judgment
```

### 4.5 Response Generation Prompt

```
System: Generate a natural language response for a completed action.

Action: {action_type}
Result: {action_result}
Context: {relevant_data}

Format:
- Confirm the action was completed
- Provide relevant feedback (e.g., progress update)
- Keep it concise (1-3 sentences)
- Use natural, conversational language

Examples:
- "Goal created! You have {remaining_days} days to complete it."
- "Expense added. Your monthly spending is now ${total}."
- "Task marked complete. You've finished {completed_today}/{total_today} tasks today!"
```

---

## 5. Voice Command Flow

### 5.1 Speech-to-Text (STT)

**Primary Method: Web Speech API**

```javascript
// Browser-based STT (no API key needed)
const recognition = new window.webkitSpeechRecognition || 
                    new window.SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  processUserInput(transcript);
};
```

**Fallback: Hugging Face Whisper (if Web Speech API unavailable)**

- Use Hugging Face Inference API with Whisper model
- Endpoint: `https://api-inference.huggingface.co/models/openai/whisper-base`
- Requires audio file upload (base64 encoded)

### 5.2 Text-to-Speech (TTS)

**Primary Method: Web Speech Synthesis API**

```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'en-US';
utterance.rate = 1.0;
utterance.pitch = 1.0;

// Select a natural-sounding voice
const voices = speechSynthesis.getVoices();
utterance.voice = voices.find(v => v.name.includes('Google') || 
                                   v.name.includes('Microsoft'));

speechSynthesis.speak(utterance);
```

### 5.3 Voice Command Flow Diagram

```
User clicks mic button / says wake word
    ↓
Start listening (Web Speech API)
    ↓
User speaks command
    ↓
STT converts to text
    ↓
Show transcript on screen
    ↓
Send text to AI intent parser
    ↓
AI extracts intent + entities
    ↓
If incomplete → Ask for clarification (via TTS)
If complete → Generate confirmation
    ↓
Speak confirmation via TTS
    ↓
Wait for user confirmation (voice or button)
    ↓
Execute action
    ↓
Generate success response
    ↓
Speak response via TTS
    ↓
Update UI
```

### 5.4 Wake Word Detection (Future Enhancement)

- Use browser-based keyword spotting
- Or simple "Hey Axiora" detection with Web Speech API
- Trigger continuous listening mode

---

## 6. Suggested Hugging Face Models

### 6.1 Intent Classification

**Primary:**
- `facebook/bart-large-mnli` - Zero-shot classification
- `distilbert-base-uncased-finetuned-sst-2-english` - Text classification

**Alternative:**
- `joeddav/xlm-roberta-large-xnli` - Multi-language support

**Usage:**
```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
  {
    headers: { 'Authorization': `Bearer ${HF_API_KEY}` },
    method: 'POST',
    body: JSON.stringify({
      inputs: userInput,
      parameters: { candidate_labels: intentList }
    })
  }
);
```

### 6.2 Entity Extraction / Named Entity Recognition

**Primary:**
- `dslim/bert-base-NER` - English NER
- `Jean-Baptiste/roberta-large-ner-english` - High accuracy NER

**Usage:**
```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/dslim/bert-base-NER',
  {
    headers: { 'Authorization': `Bearer ${HF_API_KEY}` },
    method: 'POST',
    body: JSON.stringify({ inputs: userInput })
  }
);
```

### 6.3 Response Generation

**Primary:**
- `google/flan-t5-base` - Fast, efficient text generation
- `microsoft/DialoGPT-medium` - Conversational responses

**Alternative:**
- `gpt2` - General purpose text generation (free, but less refined)

**Usage:**
```javascript
const response = await fetch(
  'https://api-inference.huggingface.co/models/google/flan-t5-base',
  {
    headers: { 'Authorization': `Bearer ${HF_API_KEY}` },
    method: 'POST',
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_length: 150, temperature: 0.7 }
    })
  }
);
```

### 6.4 Speech-to-Text (Fallback)

**Primary:**
- `openai/whisper-base` - High accuracy STT
- `facebook/wav2vec2-base-960h` - Alternative STT model

**Note:** Use Web Speech API primarily, Hugging Face Whisper only as fallback.

### 6.5 API Key Setup

1. Create free account at huggingface.co
2. Generate API token (Settings → Access Tokens)
3. Store in environment variable: `NEXT_PUBLIC_HF_API_KEY`
4. Rate limits: Free tier allows ~1000 requests/month
5. Use request queuing to handle rate limits gracefully

---

## 7. Database Schema (Tables + Fields)

### 7.1 Supabase Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth, but we reference it)
-- No need to create this table, Supabase provides auth.users

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')) DEFAULT 'pending',
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE NOT NULL DEFAULT CURRENT_DATE,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_deadline ON goals(deadline);
CREATE INDEX idx_goals_status ON goals(status);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate goal progress from tasks
CREATE OR REPLACE FUNCTION calculate_goal_progress(goal_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  progress INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_tasks
  FROM tasks
  WHERE goal_id = goal_uuid;
  
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO completed_tasks
  FROM tasks
  WHERE goal_id = goal_uuid AND completed = TRUE;
  
  progress := (completed_tasks * 100) / total_tasks;
  RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update goal progress when tasks change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.goal_id IS NOT NULL THEN
    UPDATE goals
    SET progress_percentage = calculate_goal_progress(NEW.goal_id)
    WHERE id = NEW.goal_id;
  END IF;
  
  IF OLD.goal_id IS NOT NULL AND OLD.goal_id != COALESCE(NEW.goal_id, '') THEN
    UPDATE goals
    SET progress_percentage = calculate_goal_progress(OLD.goal_id)
    WHERE id = OLD.goal_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_progress_update
  AFTER INSERT OR UPDATE OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_goal_progress();

-- Row Level Security (RLS) Policies
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for expenses
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);
```

### 7.2 Data Relationships

```
users (Supabase Auth)
  ├── goals (1:N)
  │     └── tasks (1:N, optional)
  ├── tasks (1:N, can be standalone or linked to goal)
  └── expenses (1:N)
```

---

## 8. API Endpoints Design

### 8.1 Goals API

```
GET    /api/goals
  Query params: ?status=pending&priority=high
  Returns: { goals: Goal[] }

GET    /api/goals/:id
  Returns: { goal: Goal }

POST   /api/goals
  Body: { title, description, deadline, priority }
  Returns: { goal: Goal }

PUT    /api/goals/:id
  Body: { title?, description?, deadline?, priority?, status? }
  Returns: { goal: Goal }

DELETE /api/goals/:id
  Returns: { success: boolean }

GET    /api/goals/:id/progress
  Returns: { progress: number, completed: number, total: number }
```

### 8.2 Tasks API

```
GET    /api/tasks
  Query params: ?due_date=2024-01-15&goal_id=xxx&completed=false
  Returns: { tasks: Task[] }

GET    /api/tasks/:id
  Returns: { task: Task }

POST   /api/tasks
  Body: { title, description?, due_date?, goal_id?, priority? }
  Returns: { task: Task }

PUT    /api/tasks/:id
  Body: { title?, description?, due_date?, goal_id?, priority?, completed? }
  Returns: { task: Task }

DELETE /api/tasks/:id
  Returns: { success: boolean }

PATCH  /api/tasks/:id/complete
  Toggles completion status
  Returns: { task: Task }

GET    /api/tasks/today
  Returns: { tasks: Task[], completed: number, total: number }
```

### 8.3 Expenses API

```
GET    /api/expenses
  Query params: ?start_date=2024-01-01&end_date=2024-01-31&category=food
  Returns: { expenses: Expense[] }

GET    /api/expenses/:id
  Returns: { expense: Expense }

POST   /api/expenses
  Body: { amount, category, description?, date? }
  Returns: { expense: Expense }

PUT    /api/expenses/:id
  Body: { amount?, category?, description?, date? }
  Returns: { expense: Expense }

DELETE /api/expenses/:id
  Returns: { success: boolean }

GET    /api/expenses/summary
  Query params: ?period=month&year=2024&month=1
  Returns: {
    total: number,
    by_category: { [category]: number },
    count: number
  }

GET    /api/expenses/charts
  Query params: ?period=year&year=2024
  Returns: {
    monthly_totals: { month: string, total: number }[],
    category_breakdown: { category: string, total: number }[]
  }
```

### 8.4 Dashboard API

```
GET    /api/dashboard
  Returns: {
    goals: {
      total: number,
      active: number,
      completed: number,
      completion_rate: number,
      average_progress: number
    },
    tasks: {
      today_completed: number,
      today_total: number,
      weekly_completion_rate: number,
      streak_days: number
    },
    expenses: {
      monthly_total: number,
      yearly_total: number,
      category_breakdown: { [category]: number },
      average_daily: number
    },
    active_goals: Goal[],
    upcoming_deadlines: Goal[]
  }
```

### 8.5 AI Assistant API

```
POST   /api/ai/parse
  Body: { input: string, context?: object }
  Returns: {
    intent: string,
    entities: { [key]: any },
    confidence: number,
    requires_confirmation: boolean,
    confirmation_message?: string
  }

POST   /api/ai/execute
  Body: { intent: string, entities: object, user_id: string }
  Returns: {
    success: boolean,
    result?: any,
    message: string
  }

POST   /api/ai/chat
  Body: { message: string, context: object }
  Returns: {
    response: string,
    suggestions?: string[]
  }
```

### 8.6 Authentication

All endpoints require authentication:
- Use Supabase JWT tokens in `Authorization: Bearer <token>` header
- Extract user_id from JWT: `const user = await supabase.auth.getUser()`

---

## 9. State Management Strategy

### 9.1 Global State (Zustand)

```typescript
interface AppState {
  user: User | null;
  goals: Goal[];
  tasks: Task[];
  expenses: Expense[];
  selectedDate: Date;
  
  // Actions
  setUser: (user: User | null) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  addExpense: (expense: Expense) => void;
  // ... more actions
}
```

### 9.2 Local State (React Context)

- UI state (modals, sidebars, filters)
- Voice assistant state (listening, processing, speaking)
- Form state (uncontrolled forms)

### 9.3 Server State (React Query / SWR)

- Use SWR or React Query for API data fetching
- Automatic caching and revalidation
- Optimistic updates for better UX

```typescript
// Example with SWR
const { data: goals, mutate } = useSWR('/api/goals', fetcher);

// Optimistic update
const updateGoal = async (id, updates) => {
  const optimisticGoal = { ...currentGoal, ...updates };
  mutate(
    goals.map(g => g.id === id ? optimisticGoal : g),
    false // don't revalidate immediately
  );
  
  await fetch(`/api/goals/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  mutate(); // revalidate
};
```

### 9.4 Persistence

- Supabase Realtime subscriptions for live updates across devices
- LocalStorage for offline support (PWA)
- Service Worker caching for API responses

---

## 10. Edge Cases & Error Handling

### 10.1 Data Validation

**Client-side:**
- Form validation with clear error messages
- Prevent invalid dates (past deadlines)
- Enforce required fields
- Sanitize user inputs

**Server-side:**
- Database constraints (foreign keys, check constraints)
- Input validation middleware
- Type checking with TypeScript
- SQL injection prevention (use parameterized queries)

### 10.2 Network Errors

- Retry logic with exponential backoff
- Offline mode with Service Worker
- Queue failed requests for retry when online
- Clear error messages to users

```typescript
async function apiCall(endpoint, options, retries = 3) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await sleep(1000 * (4 - retries)); // exponential backoff
      return apiCall(endpoint, options, retries - 1);
    }
    throw error;
  }
}
```

### 10.3 AI Service Errors

- Handle Hugging Face API rate limits
- Fallback to rule-based parsing if AI fails
- Cache common intents for faster response
- Show user-friendly error messages

```typescript
async function parseIntent(input) {
  try {
    return await huggingFaceAPI(input);
  } catch (error) {
    if (error.status === 429) {
      // Rate limit - use fallback
      return fallbackRuleBasedParser(input);
    }
    throw error;
  }
}
```

### 10.4 Voice Recognition Errors

- Handle browser compatibility (Chrome, Edge support Web Speech API)
- Fallback to manual input if voice unavailable
- Show microphone permission errors clearly
- Handle background noise and unclear speech

### 10.5 Date/Time Edge Cases

- Timezone handling (store UTC, display in user's timezone)
- Leap years
- Month boundaries
- Past vs future dates validation
- Remaining days calculation accuracy

### 10.6 Concurrent Updates

- Optimistic locking with `updated_at` timestamps
- Conflict resolution (last-write-wins or merge strategy)
- Real-time sync via Supabase subscriptions

### 10.7 Empty States

- Show helpful empty states for no goals/tasks/expenses
- Provide quick actions (e.g., "Create your first goal")
- Onboarding flow for new users

---

## 11. Future Enhancements

### 11.1 Phase 2 Features

- **Budget Management**: Set budgets per category, alerts when exceeded
- **Habit Tracking**: Daily/weekly habits with streaks
- **Time Tracking**: Log time spent on tasks/goals
- **Notes & Journaling**: Rich text notes linked to goals
- **Collaboration**: Share goals with others, team goals
- **Recurring Tasks**: Automatically create recurring tasks
- **Reminders & Notifications**: Browser push notifications
- **Export/Import**: CSV/JSON export, backup/restore

### 11.2 Phase 3 Features

- **Calendar View**: Visual calendar for goals and tasks
- **Timeline Visualization**: Gantt-style timeline view
- **Analytics Dashboard**: Advanced charts and insights
- **AI Recommendations**: Suggest goals based on patterns
- **Integrations**: Calendar sync, email integration
- **Mobile Apps**: Native iOS/Android apps (React Native)
- **Offline Mode**: Full offline functionality with sync

### 11.3 Performance Optimizations

- Virtual scrolling for long lists
- Lazy loading images and charts
- Code splitting for smaller bundle sizes
- Database query optimization (indexes, pagination)
- CDN for static assets

### 11.4 AI Improvements

- Fine-tune models on user data (with consent)
- Multi-language support
- Voice cloning for TTS (personalized voice)
- Predictive goal completion dates
- Smart task prioritization suggestions

---

## 12. Security & Privacy Considerations

### 12.1 Authentication & Authorization

- Supabase Auth handles secure authentication
- JWT tokens for API authentication
- Row Level Security (RLS) ensures users only access their data
- Password policies enforced by Supabase
- OAuth providers (Google, GitHub) for easy login

### 12.2 Data Privacy

- All user data encrypted at rest (Supabase)
- HTTPS for all API communications
- No sensitive data in client-side code
- GDPR compliance considerations:
  - User can export their data
  - User can delete their account (cascading deletes)
  - Privacy policy and terms of service

### 12.3 Input Sanitization

- Sanitize all user inputs to prevent XSS
- Parameterized queries prevent SQL injection
- Rate limiting on API endpoints
- CORS configuration for allowed origins

### 12.4 API Security

- API key rotation for Hugging Face (if needed)
- Environment variables for secrets (never commit)
- Request validation and size limits
- DDoS protection (via Vercel/Next.js infrastructure)

### 12.5 PWA Security

- HTTPS required for PWA installation
- Service Worker scope restrictions
- Secure storage (IndexedDB, not localStorage for sensitive data)
- Content Security Policy (CSP) headers

### 12.6 Data Retention

- User can delete their account → cascade delete all data
- Soft deletes for audit trail (optional)
- Automatic cleanup of old archived items (configurable)

---

## Implementation Notes

### Development Phases

1. **Phase 1**: Core features (Goals, Tasks, Expenses) + Basic UI
2. **Phase 2**: Dashboard + Progress tracking
3. **Phase 3**: AI Assistant (text input)
4. **Phase 4**: Voice integration (STT/TTS)
5. **Phase 5**: PWA optimization + offline support
6. **Phase 6**: Polish + testing

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "zustand": "^4.4.0",
    "s