import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

const ToDoList = () => {
  const [tasks] = useState([
    { id: 1, title: 'Study Math', category: 'Study and subject', date: new Date(), status: 'Pending' },
    { id: 2, title: 'Workout', category: 'Skill development', date: new Date(), status: 'Pending' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))

  const taskCategories = [
    'Study and subject', 'Skill development', 'Daily needs', 'Travelling time', 
    'Sex', 'Sleep', 'Time with family', 'Enjoy', 'Rest', 'Social media', 'Other with reason'
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">To-Do List</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center shadow-lg transition-colors"
        >
          <Plus className="mr-2" size={20} /> Add Task
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overdue Box */}
        <section className="bg-red-500/10 backdrop-blur-md rounded-2xl p-6 border border-red-500/20 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <Clock className="mr-2" size={20} /> Overdue Works
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/20 rounded-xl text-white/90 border border-red-500/30">
              <p className="font-semibold text-sm">Finish Project Proposal</p>
              <span className="text-xs text-red-300">Due 2 days ago</span>
            </div>
          </div>
        </section>

        {/* Weekly View */}
        <section className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div 
                key={day.toString()} 
                className={`p-4 rounded-2xl border transition-all ${
                  isSameDay(day, today) 
                    ? 'bg-blue-600/20 border-blue-500' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <p className="text-white/60 text-xs font-bold uppercase mb-1">{format(day, 'EEE')}</p>
                <p className="text-white font-bold text-lg mb-4">{format(day, 'd')}</p>
                
                <div className="space-y-2">
                  {tasks.filter(t => isSameDay(new Date(t.date), day)).map(task => (
                    <div key={task.id} className="p-2 bg-white/10 rounded-lg group">
                      <p className="text-xs text-white/90 truncate">{task.title}</p>
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <button className="p-1 hover:bg-blue-500/20 text-blue-400 rounded transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-white/20 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition-all text-xs flex justify-center items-center">
                    <Plus size={14} className="mr-1" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Task Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Add New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Task Title</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Category</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  {taskCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                  Add Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default ToDoList
