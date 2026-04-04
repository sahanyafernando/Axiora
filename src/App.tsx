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
import { AnimatePresence, motion } from 'framer-motion'
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
      document.body.classList.add('dark')
      document.body.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.body.classList.add('light')
      document.body.classList.remove('dark')
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : 'light'} relative overflow-hidden transition-colors duration-500`}>
      {/* 3D Fog/Mist Background */}
      <div className="animated-bg">
        <div className="mist-container">
          <div className="mist mist-1" />
          <div className="mist mist-2" />
          <div className="mist mist-3" />
          <div className="mist mist-4" />
        </div>
      </div>

      <div className="flex h-screen overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside 
          className={`glass border-r border-white/10 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}
        >
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Axiora
              </motion.h1>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl text-white transition-all duration-300"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={22} />} label="Dashboard" isOpen={isSidebarOpen} />
            <NavItem to="/expenses" icon={<Wallet size={22} />} label="Expenses" isOpen={isSidebarOpen} />
            <NavItem to="/calendar" icon={<Calendar size={22} />} label="Calendar" isOpen={isSidebarOpen} />
            <NavItem to="/todo" icon={<ListTodo size={22} />} label="To-Do List" isOpen={isSidebarOpen} />
            <NavItem to="/chatbot" icon={<MessageSquare size={22} />} label="AI Chatbot" isOpen={isSidebarOpen} />
            <NavItem to="/goals" icon={<Target size={22} />} label="Goals" isOpen={isSidebarOpen} />
          </nav>

          <div className="p-4 border-t border-white/10">
            <button 
              onClick={toggleTheme}
              className="flex items-center w-full p-3 hover:bg-white/10 rounded-xl text-white transition-all duration-300 group"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {isDarkMode ? (
                  <Sun className="text-yellow-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="text-blue-400 group-hover:-rotate-12 transition-transform" />
                )}
              </div>
              {isSidebarOpen && (
                <span className="ml-3 font-medium">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
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
      className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600/50 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30' 
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && <span className="ml-3 font-medium">{label}</span>}
    </Link>
  )
}

export default App
