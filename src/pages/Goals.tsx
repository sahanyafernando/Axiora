import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Target, Award, X, CheckCircle2, Circle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

interface Goal {
  id: number
  title: string
  type: 'Weekly' | 'Monthly'
  status: 'Pending' | 'Completed'
}

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState<Omit<Goal, 'id' | 'status'>>({
    title: '',
    type: 'Weekly'
  })

  const handleOpenModal = (goal?: Goal, type?: 'Weekly' | 'Monthly') => {
    if (goal) {
      setEditingGoal(goal)
      setFormData({
        title: goal.title,
        type: goal.type
      })
    } else {
      setEditingGoal(null)
      setFormData({
        title: '',
        type: type || 'Weekly'
      })
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id)
    }
  }

  const toggleStatus = (id: number) => {
    const goal = goals.find(g => g.id === id)
    if (goal) {
      updateGoal(id, { status: goal.status === 'Pending' ? 'Completed' : 'Pending' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingGoal) {
      updateGoal(editingGoal.id, formData)
    } else {
      addGoal(formData)
    }
    setIsModalOpen(false)
  }

  const sortedGoals = [...goals].sort((a, b) => b.id - a.id)
  const weeklyGoals = sortedGoals.filter(g => g.type === 'Weekly')
  const monthlyGoals = sortedGoals.filter(g => g.type === 'Monthly')

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center">
            <Target className="mr-4 text-amber-500" size={40} /> Goals
          </h2>
          <p className="text-slate-500 dark:text-white/60">Set and track your short-term and long-term milestones</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2" size={20} /> New Goal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Goals */}
        <section className="glass-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center uppercase tracking-wider">
              <Award className="mr-3 text-blue-400" size={28} /> Weekly
            </h3>
            <button 
              onClick={() => handleOpenModal(undefined, 'Weekly')}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="space-y-4">
            {weeklyGoals.length === 0 ? (
              <p className="py-12 text-center text-slate-400 dark:text-white/20 text-sm font-medium">No weekly goals set.</p>
            ) : (
              weeklyGoals.map(goal => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onToggle={() => toggleStatus(goal.id)} 
                  onEdit={() => handleOpenModal(goal)} 
                  onDelete={() => handleDelete(goal.id)} 
                />
              ))
            )}
          </div>
        </section>

        {/* Monthly Goals */}
        <section className="glass-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center uppercase tracking-wider">
              <Award className="mr-3 text-purple-400" size={28} /> Monthly
            </h3>
            <button 
              onClick={() => handleOpenModal(undefined, 'Monthly')}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="space-y-4">
            {monthlyGoals.length === 0 ? (
              <p className="py-12 text-center text-slate-400 dark:text-white/20 text-sm font-medium">No monthly goals set.</p>
            ) : (
              monthlyGoals.map(goal => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onToggle={() => toggleStatus(goal.id)} 
                  onEdit={() => handleOpenModal(goal)} 
                  onDelete={() => handleDelete(goal.id)} 
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md relative z-10 border border-black/5 dark:border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingGoal ? 'Edit Goal' : 'New Goal'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-slate-400 dark:text-white/60 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-white/60 mb-2">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                    placeholder="What do you want to achieve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-white/60 mb-2">Goal Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Weekly', 'Monthly'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type as any })}
                        className={`py-3 rounded-xl font-bold transition-all border ${
                          formData.type === type 
                            ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20' 
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-slate-400 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/30 transition-all active:scale-95 mt-4"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function GoalItem({ goal, onToggle, onEdit, onDelete }: { goal: Goal, onToggle: () => void, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all flex justify-between items-center group shadow-xl ${
      goal.status === 'Completed' 
        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' 
        : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggle}
          className={`shrink-0 transition-colors ${
            goal.status === 'Completed' ? 'text-emerald-400' : 'text-slate-400 dark:text-white/20 hover:text-slate-600 dark:hover:text-white/60'
          }`}
        >
          {goal.status === 'Completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        <div>
          <h4 className={`text-lg font-bold leading-tight ${
            goal.status === 'Completed' ? 'text-slate-400 dark:text-white/40 line-through' : 'text-slate-900 dark:text-white'
          }`}>
            {goal.title}
          </h4>
          <span className={`text-[10px] font-black uppercase tracking-widest ${
            goal.status === 'Completed' ? 'text-emerald-400/60' : 'text-amber-500/60'
          }`}>
            {goal.status}
          </span>
        </div>
      </div>
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-2.5 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2.5 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

export default Goals

