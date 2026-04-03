import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wallet, 
  Calendar, 
  ListTodo, 
  MessageSquare, 
  Target, 
  Sun, 
  Moon,
  Menu,
  X
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import CalendarPage from './pages/Calendar'
import ToDoList from './pages/ToDoList'
import Chatbot from './pages/Chatbot'
import Goals from './pages/Goals'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="cloud w-64 h-64 top-1/4 left-1/4" />
        <div className="cloud w-96 h-96 top-1/2 left-1/2 opacity-30" />
        <div className="cloud w-80 h-80 top-3/4 left-1/3 opacity-20" />
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-white/10 backdrop-blur-md border-r border-white/20 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen && <h1 className="text-2xl font-bold text-white">Axiora</h1>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg text-white"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard />} label="Dashboard" isOpen={isSidebarOpen} />
            <NavItem to="/expenses" icon={<Wallet />} label="Expenses" isOpen={isSidebarOpen} />
            <NavItem to="/calendar" icon={<Calendar />} label="Calendar" isOpen={isSidebarOpen} />
            <NavItem to="/todo" icon={<ListTodo />} label="To-Do List" isOpen={isSidebarOpen} />
            <NavItem to="/chatbot" icon={<MessageSquare />} label="AI Chatbot" isOpen={isSidebarOpen} />
            <NavItem to="/goals" icon={<Target />} label="Goals" isOpen={isSidebarOpen} />
          </nav>

          <div className="p-4 border-t border-white/20">
            <button 
              onClick={toggleTheme}
              className="flex items-center w-full p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
            >
              {isDarkMode ? <Sun className="mr-3" /> : <Moon className="mr-3" />}
              {isSidebarOpen && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/todo" element={<ToDoList />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, icon, label, isOpen }: { to: string, icon: ReactNode, label: string, isOpen: boolean }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link 
      to={to} 
      className={`flex items-center p-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && <span className="ml-3 font-medium">{label}</span>}
    </Link>
  )
}

export default App
