import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'
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
  subMonths 
} from 'date-fns'

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Placeholder Sri Lankan holidays
  const slHolidays = [
    { date: '2026-04-13', name: 'Sinhala & Tamil New Year Eve' },
    { date: '2026-04-14', name: 'Sinhala & Tamil New Year Day' },
    { date: '2026-05-01', name: 'May Day' },
    { date: '2026-05-08', name: 'Vesak Full Moon Poya Day' },
    { date: '2026-05-09', name: 'Vesak Holiday' },
    { date: '2026-06-07', name: 'Poson Full Moon Poya Day' },
    { date: '2026-12-25', name: 'Christmas Day' },
  ]

  const isHoliday = (day: Date) => {
    return slHolidays.find(h => isSameDay(new Date(h.date), day))
  }

  const tasksForDay = [
    { id: 1, title: 'Study React', category: 'Study and subject', date: new Date() },
    { id: 2, title: 'Gym session', category: 'Skill development', date: new Date() },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold text-white flex items-center">
          {format(currentDate, 'MMMM')} <span className="ml-3 text-white/40 font-normal">{format(currentDate, 'yyyy')}</span>
        </h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <section className="lg:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl overflow-hidden">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 text-white/40 font-bold text-xs uppercase tracking-wider">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const holiday = isHoliday(day)
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[100px] p-3 rounded-2xl border transition-all cursor-pointer relative group
                    ${!isSameMonth(day, monthStart) ? 'opacity-20 pointer-events-none' : ''}
                    ${isSameDay(day, new Date()) ? 'bg-blue-600/30 border-blue-500 shadow-lg ring-1 ring-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}
                    ${isSameDay(day, selectedDate) ? 'ring-2 ring-white/30 border-white/30 shadow-2xl' : ''}
                  `}
                >
                  <span className={`font-bold text-lg ${holiday ? 'text-red-400' : 'text-white'}`}>{format(day, 'd')}</span>
                  {holiday && <div className="text-[10px] text-red-300 font-medium truncate mt-1">{holiday.name}</div>}
                  <div className="mt-2 space-y-1">
                    {/* Placeholder for tasks in calendar cell */}
                    {idx % 5 === 0 && <div className="h-1 w-1 rounded-full bg-blue-500" />}
                    {idx % 7 === 0 && <div className="h-1 w-1 rounded-full bg-purple-500" />}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Selected Day Tasks */}
        <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            Tasks for {format(selectedDate, 'MMM d')}
            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-lg transition-all">
              <Plus size={18} />
            </button>
          </h3>
          <div className="space-y-4">
            {tasksForDay.map(task => (
              <div key={task.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group transition-all hover:bg-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold text-sm">{task.title}</h4>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded-lg uppercase font-bold tracking-tighter">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export default CalendarPage
