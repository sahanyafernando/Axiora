import { motion } from 'framer-motion'
import { Wallet, Calendar, ListTodo, MessageSquare, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const quickButtons = [
    { label: 'Expenses', icon: <Wallet size={24} />, to: '/expenses', color: 'bg-emerald-500' },
    { label: 'Calendar', icon: <Calendar size={24} />, to: '/calendar', color: 'bg-blue-500' },
    { label: 'To-Do List', icon: <ListTodo size={24} />, to: '/todo', color: 'bg-purple-500' },
    { label: 'AI Chatbot', icon: <MessageSquare size={24} />, to: '/chatbot', color: 'bg-pink-500' },
    { label: 'Goals', icon: <Target size={24} />, to: '/goals', color: 'bg-amber-500' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-3xl font-bold text-white">Welcome to Axiora</h2>
        <p className="text-white/60">Manage your daily expenses and time efficiently.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickButtons.map((btn) => (
          <Link key={btn.label} to={btn.to}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${btn.color} p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white space-y-2 cursor-pointer transition-shadow hover:shadow-xl`}
            >
              {btn.icon}
              <span className="font-semibold">{btn.label}</span>
            </motion.div>
          </Link>
        ))}
      </section>

      <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Overdue To-Dos</h3>
        <div className="space-y-3">
          {/* Placeholder for overdue tasks */}
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-white flex justify-between items-center">
            <span>Finish Project Proposal</span>
            <span className="text-sm bg-red-500 px-2 py-1 rounded">Overdue</span>
          </div>
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-white flex justify-between items-center">
            <span>Pay Electricity Bill</span>
            <span className="text-sm bg-red-500 px-2 py-1 rounded">Overdue</span>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Dashboard
