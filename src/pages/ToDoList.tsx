import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Clock, X, CheckCircle2, Circle } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay, isBefore, startOfDay } from 'date-fns'

interface Task {
  id: number
  title: string
  category: string
  date: Date
  status: 'Pending' | 'Completed'
}

const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Study Math', category: 'Study and subject', date: new Date(), status: 'Pending' },
    { id: 2, title: 'Workout', category: 'Skill development', date: new Date(), status: 'Pending' },
    { id: 3, title: 'Old Assignment', category: 'Study and subject', date: addDays(new Date(), -2), status: 'Pending' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Study and subject',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  
  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today)
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  const taskCategories = [
    'Study and subject', 'Skill development', 'Daily needs', 'Travelling time', 
    'Sex', 'Sleep', 'Time with family', 'Enjoy', 'Rest', 'Social media', 'Other with reason'
  ]

  const handleOpenModal = (task?: Task, initialDate?: Date) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        category: task.category,
        date: format(task.date, 'yyyy-MM-dd')
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: '',
        category: 'Study and subject',
        date: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      })
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const taskData = {
      ...formData,
      date: new Date(formData.date),
      status: editingTask?.status || 'Pending' as const
    }

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t))
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const overdueTasks = tasks.filter(t => t.status === 'Pending' && isBefore(startOfDay(t.date), today))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">To-Do List</h2>
          <p className="text-white/60">Organize your week and stay on track</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="mr-2" size={20} /> Add Task
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overdue Box */}
        <section className="glass-card border-red-500/20 h-fit">
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <Clock className="mr-2" size={20} /> Overdue Works
          </h3>
          <div className="space-y-3">
            {overdueTasks.length === 0 ? (
              <p className="text-white/40 text-sm py-4">No overdue tasks. Great job!</p>
            ) : (
              overdueTasks.map(task => (
                <div key={task.id} className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 group hover:bg-red-500/20 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-white/90 text-sm leading-tight">{task.title}</p>
                    <button onClick={() => handleDelete(task.id)} className="text-red-400/0 group-hover:text-red-400 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-red-400/60">
                    Due {format(task.date, 'MMM d')}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Weekly View */}
        <section className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div 
                key={day.toString()} 
                className={`p-4 rounded-3xl border transition-all duration-300 min-h-[300px] flex flex-col ${
                  isSameDay(day, today) 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${
                      isSameDay(day, today) ? 'text-blue-400' : 'text-white/40'
                    }`}>
                      {format(day, 'EEE')}
                    </p>
                    <p className="text-2xl font-black text-white">{format(day, 'd')}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                  {tasks.filter(t => isSameDay(new Date(t.date), day)).map(task => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-2xl group transition-all border ${
                        task.status === 'Completed' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                          : 'bg-white/10 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button 
                          onClick={() => toggleStatus(task.id)}
                          className={`mt-0.5 shrink-0 transition-colors ${
                            task.status === 'Completed' ? 'text-emerald-400' : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          {task.status === 'Completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </button>
                        <p className={`text-xs font-medium leading-relaxed ${
                          task.status === 'Completed' ? 'text-white/40 line-through' : 'text-white/90'
                        }`}>
                          {task.title}
                        </p>
                      </div>
                      
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                        <button 
                          onClick={() => handleOpenModal(task)}
                          className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        >
                          <Pencil size={12} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleOpenModal(undefined, day)}
                    className="w-full py-3 border-2 border-dashed border-white/5 rounded-2xl text-white/20 hover:text-white/60 hover:bg-white/5 hover:border-white/10 transition-all text-xs font-bold uppercase tracking-wider flex justify-center items-center group"
                  >
                    <Plus size={14} className="mr-2 group-hover:rotate-90 transition-transform" /> Add
                  </button>
                </div>
              </div>
            ))}
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
              className="glass-card w-full max-w-md relative z-10 border border-white/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Task Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                  >
                    {taskCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 mt-4"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ToDoList

