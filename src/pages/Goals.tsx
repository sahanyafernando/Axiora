import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Target, Award } from 'lucide-react'

const Goals = () => {
  const [weeklyGoals] = useState([
    { id: 1, title: 'Complete Project', status: 'In Progress' },
    { id: 2, title: 'Read 2 Chapters', status: 'Pending' },
  ])

  const [monthlyGoals] = useState([
    { id: 1, title: 'Learn React Hooks', status: 'In Progress' },
    { id: 2, title: 'Save 10,000 LKR', status: 'Pending' },
  ])

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Target className="mr-3 text-amber-500" size={32} /> Goals
        </h2>
        <div className="flex space-x-4">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl flex items-center shadow-lg transition-colors">
            <Plus className="mr-2" size={20} /> Add Goal
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Goals */}
        <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Award className="mr-2 text-blue-400" size={24} /> Weekly Goals
          </h3>
          <div className="space-y-4">
            {weeklyGoals.map(goal => (
              <div key={goal.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group transition-all hover:bg-white/10 flex justify-between items-center shadow-lg">
                <div>
                  <h4 className="text-white font-semibold text-lg">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-lg uppercase font-bold tracking-tighter ${goal.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors shadow-lg">
                    <Pencil size={18} />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Goals */}
        <section className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Award className="mr-2 text-purple-400" size={24} /> Monthly Goals
          </h3>
          <div className="space-y-4">
            {monthlyGoals.map(goal => (
              <div key={goal.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group transition-all hover:bg-white/10 flex justify-between items-center shadow-lg">
                <div>
                  <h4 className="text-white font-semibold text-lg">{goal.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-lg uppercase font-bold tracking-tighter ${goal.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors shadow-lg">
                    <Pencil size={18} />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default Goals
