import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfDay
} from 'date-fns'

interface Task {
  id: number
  title: string
  category: string
  date: Date
  status: 'Pending' | 'Completed'
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()))
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Study React', category: 'Study and subject', date: new Date(), status: 'Pending' },
    { id: 2, title: 'Gym session', category: 'Skill development', date: new Date(), status: 'Pending' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Study and subject',
    date: format(new Date(), 'yyyy-MM-dd')
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const slHolidays = [
    { date: '2026-01-14', name: 'Tamil Thai Pongal Day' },
    { date: '2026-02-04', name: 'Independence Day' },
    { date: '2026-04-13', name: 'Sinhala & Tamil New Year Eve' },
    { date: '2026-04-14', name: 'Sinhala & Tamil New Year Day' },
    { date: '2026-05-01', name: 'May Day' },
    { date: '2026-05-08', name: 'Vesak Full Moon Poya Day' },
    { date: '2026-05-09', name: 'Vesak Holiday' },
    { date: '2026-06-07', name: 'Poson Full Moon Poya Day' },
    { date: '2026-12-25', name: 'Christmas Day' },
  ]

  const taskCategories = [
    'Study and subject', 'Skill development', 'Daily needs', 'Travelling time', 
    'Sex', 'Sleep', 'Time with family', 'Enjoy', 'Rest', 'Social media', 'Other with reason'
  ]

  const isHoliday = (day: Date) => slHolidays.find(h => isSameDay(new Date(h.date), day))

  const selectedDayTasks = tasks.filter(t => isSameDay(new Date(t.date), selectedDate))

  const handleOpenModal = (task?: Task) => {
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
        date: format(selectedDate, 'yyyy-MM-dd')
      })
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const taskData = {
      ...formData,
      date: startOfDay(new Date(formData.date)),
      status: editingTask?.status || 'Pending' as const
    }

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t))
    } else {
      setTasks([...tasks, { ...taskData, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <header className="glass-card flex justify-between items-center p-6 mb-8">
        <h2 className="text-4xl font-black text-white flex items-center">
          {format(currentDate, 'MMMM')} <span className="ml-4 text-white/30 font-medium">{format(currentDate, 'yyyy')}</span>
        </h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <section className="lg:col-span-3 glass-card overflow-hidden">
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 text-white/30 font-black text-[10px] uppercase tracking-[0.2em]">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const holiday = isHoliday(day)
              const isToday = isSameDay(day, new Date())
              const isSelected = isSameDay(day, selectedDate)
              const hasTasks = tasks.some(t => isSameDay(new Date(t.date), day))
              
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDate(startOfDay(day))}
                  className={`
                    min-h-[110px] p-4 rounded-3xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between
                    ${!isSameMonth(day, monthStart) ? 'opacity-20 pointer-events-none' : ''}
                    ${isToday ? 'bg-blue-600/30 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/20'}
                    ${isSelected ? 'ring-2 ring-white/40 border-white/40 shadow-2xl scale-[1.02] z-10' : ''}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-black text-xl ${holiday ? 'text-red-400' : 'text-white'}`}>{format(day, 'd')}</span>
                    {hasTasks && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />}
                  </div>
                  {holiday && (
                    <div className="text-[9px] font-bold text-red-400 leading-tight truncate uppercase tracking-tighter opacity-80">
                      {holiday.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Selected Day Tasks */}
        <section className="glass-card h-fit sticky top-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white leading-none mb-1">Tasks</h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{format(selectedDate, 'MMM d, yyyy')}</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-110 active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {selectedDayTasks.length === 0 ? (
              <div className="py-12 text-center text-white/20">
                <p className="text-sm font-medium">No tasks for this day.</p>
              </div>
            ) : (
              selectedDayTasks.map(task => (
                <div key={task.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-bold text-sm leading-snug pr-4">{task.title}</h4>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(task)}
                        className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-1 rounded-lg">
                    {task.category}
                  </span>
                </div>
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
                    placeholder="Task details"
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
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Date</label>
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

export default CalendarPage

