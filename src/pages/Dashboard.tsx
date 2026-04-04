import { motion } from 'framer-motion'
import { Wallet, Calendar, ListTodo, MessageSquare, Target, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const quickButtons = [
    { label: 'Expenses', icon: <Wallet size={28} />, to: '/expenses', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { label: 'Calendar', icon: <Calendar size={28} />, to: '/calendar', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { label: 'To-Do', icon: <ListTodo size={28} />, to: '/todo', color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
    { label: 'AI Chat', icon: <MessageSquare size={28} />, to: '/chatbot', color: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
    { label: 'Goals', icon: <Target size={28} />, to: '/goals', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  ]

  const overdueTodos = [
    { id: 1, title: 'Finish Project Proposal', days: 2 },
    { id: 2, title: 'Pay Electricity Bill', days: 1 },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <header>
        <h2 className="text-5xl font-black text-white mb-3 tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Axiora</span>
        </h2>
        <p className="text-white/40 text-lg font-medium">Your personal workspace for efficiency and growth.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {quickButtons.map((btn) => (
          <Link key={btn.label} to={btn.to}>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${btn.color} p-8 rounded-[2rem] ${btn.shadow} shadow-2xl flex flex-col items-center justify-center text-white space-y-4 cursor-pointer border border-white/20 transition-all`}
            >
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                {btn.icon}
              </div>
              <span className="font-black uppercase tracking-widest text-[10px]">{btn.label}</span>
            </motion.div>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 glass-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center">
              <Clock className="mr-3 text-red-400" size={28} /> Overdue To-Dos
            </h3>
            <Link to="/todo" className="text-xs font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">View All</Link>
          </div>
          <div className="space-y-4">
            {overdueTodos.map(todo => (
              <div key={todo.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{todo.title}</p>
                    <p className="text-red-400/60 text-xs font-black uppercase tracking-widest">Delayed by {todo.days} {todo.days === 1 ? 'day' : 'days'}</p>
                  </div>
                </div>
                <button className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-white/60 transition-all">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card">
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-8">Quick Stats</h3>
          <div className="space-y-6">
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
              <div className="flex justify-between items-start mb-2">
                <p className="text-emerald-400/60 text-[10px] font-black uppercase tracking-widest">Weekly Savings</p>
                <ArrowUpRight className="text-emerald-400" size={16} />
              </div>
              <p className="text-3xl font-black text-white">LKR 12,450</p>
            </div>
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl">
              <div className="flex justify-between items-start mb-2">
                <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-widest">Tasks Completed</p>
                <ArrowDownLeft className="text-blue-400" size={16} />
              </div>
              <p className="text-3xl font-black text-white">84%</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default Dashboard

