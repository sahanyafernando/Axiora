# Axiora Project Architecture

This document provides a high-level overview of the Axiora project structure, its core components, and how the AI chatbot functions.

---

## **Project Structure**

Axiora is a modern full-stack personal management dashboard built with React, Node.js, and MongoDB. It emphasizes a sleek UI with glassmorphism effects and robust data persistence.

### **Core Directories**

- **`server/`**: The backend API.
  - [index.js](file:///d:/Axiora/server/index.js): Express server with MongoDB integration.
  - [models/](file:///d:/Axiora/server/models/): Mongoose schemas for Tasks, Expenses, and Goals.
- **`src/context/`**: Contains the central state management logic.
  - [AppContext.tsx](file:///d:/Axiora/src/context/AppContext.tsx): Manages global state and synchronizes with the backend API.
- **`src/pages/`**: Contains the main application views.
  - [Dashboard.tsx](file:///d:/Axiora/src/pages/Dashboard.tsx): Overview of user data (summaries, charts).
  - [Expenses.tsx](file:///d:/Axiora/src/pages/Expenses.tsx): Income and expense tracking.
  - [Calendar.tsx](file:///d:/Axiora/src/pages/Calendar.tsx): Task scheduling and visualization.
  - [ToDoList.tsx](file:///d:/Axiora/src/pages/ToDoList.tsx): Task management.
  - [Chatbot.tsx](file:///d:/Axiora/src/pages/Chatbot.tsx): AI-driven interface.
  - [Goals.tsx](file:///d:/Axiora/src/pages/Goals.tsx): Target setting and tracking.
- **`src/assets/`**: Static images and SVG icons.
- **`src/App.tsx`**: Main application layout, routing, and theme management.

---

## **Architecture Diagram**

The following diagram illustrates the flow of data and the interaction between components:

```mermaid
graph TD
    A[User Interface] --> B[React Components (Pages)]
    B --> C[React Context API (AppContext)]
    C <--> D[Express Backend API]
    D <--> E[MongoDB Database]
    
    subgraph "AI Chatbot Flow"
        F[User Input (Text/Voice)] --> G[Web Speech API (SpeechRecognition)]
        G --> H[Chatbot Engine (getBotResponse)]
        H --> I[Action Execution (addTask, addExpense)]
        I --> C
        H --> J[Bot Response (Text)]
        J --> K[Web Speech API (SpeechSynthesis)]
    end
```

---

## **How the AI Chatbot Works**

The Axiora AI chatbot acts as a smart bridge between the user and the application's data. It simplifies complex tasks through a conversational interface.

### **1. Input Handling**
The chatbot accepts input in two ways:
- **Text Input**: Standard typing in the chat field.
- **Voice Input**: Using the **Web Speech API** (`SpeechRecognition`), users can speak to the bot. This is triggered by the microphone icon in [Chatbot.tsx](file:///d:/Axiora/src/pages/Chatbot.tsx).

### **2. Intent Recognition**
Instead of using a heavy server-side LLM, the current implementation uses efficient client-side logic in the `getBotResponse` function:
- It analyzes the input string for specific keywords and patterns (e.g., "add task", "spent 500", "earned 1000").
- It uses basic NLP techniques like keyword matching and regex to identify the user's intent.

### **3. Action Execution**
Once an intent is recognized, the chatbot directly interacts with the global state:
- **Adding Tasks**: Calls `addTask` from [AppContext.tsx](file:///d:/Axiora/src/context/AppContext.tsx).
- **Tracking Expenses**: Calls `addExpense` with the parsed amount and category.
- **Confirmations**: Generates a confirmation message (e.g., "I've added the task 'buy groceries' to your list").

### **4. Response Delivery**
- **Visual**: The message is added to the chat history and rendered in the UI with animations.
- **Auditory**: If text-to-speech is enabled, the bot uses the **Web Speech API** (`SpeechSynthesis`) to speak the response aloud.

### **5. Persistence**
All chat history and application state (tasks, expenses) are automatically saved to `localStorage`, ensuring data persists even after the page is refreshed.

---

## **Technologies Used**

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- **APIs**: Web Speech API (SpeechRecognition, SpeechSynthesis)
