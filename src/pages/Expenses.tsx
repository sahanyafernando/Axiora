import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

interface Expense {
  id: number
  type: 'Earn' | 'Spent'
  amount: number
  category: string
  description: string
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, type: 'Spent', amount: 1500, category: 'Necessary food', description: 'Lunch' },
    { id: 2, type: 'Earn', amount: 50000, category: 'Salary', description: 'Monthly Salary' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    type: 'Spent',
    amount: 0,
    category: 'Necessary food',
    description: ''
  })

  const categories = [
    'Necessary food', 'Fancy food', 'Clothing and cosmetics', 'Medicine', 
    'For home', 'Data and voice plan', 'Travelling', 'Other with reason'
  ]

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense)
      setFormData({
        type: expense.type,
        amount: expense.amount,
        category: expense.category,
        description: expense.description
      })
    } else {
      setEditingExpense(null)
      setFormData({
        type: 'Spent',
        amount: 0,
        category: 'Necessary food',
        description: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingExpense) {
      setExpenses(expenses.map(ex => ex.id === editingExpense.id ? { ...formData, id: ex.id } : ex))
    } else {
      setExpenses([...expenses, { ...formData, id: Date.now() }])
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Expenses</h2>
          <p className="text-white/60">Manage your daily earnings and spendings in LKR</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => { setFormData(prev => ({ ...prev, type: 'Earn' })); handleOpenModal(); }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="mr-2" size={20} /> Add Earn
          </button>
          <button 
            onClick={() => { setFormData(prev => ({ ...prev, type: 'Spent' })); handleOpenModal(); }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="mr-2" size={20} /> Add Spent
          </button>
        </div>
      </header>

      <section className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-4 text-white/40 font-medium uppercase text-xs tracking-wider">Type</th>
                <th className="px-4 py-4 text-white/40 font-medium uppercase text-xs tracking-wider">Category</th>
                <th className="px-4 py-4 text-white/40 font-medium uppercase text-xs tracking-wider">Description</th>
                <th className="px-4 py-4 text-white/40 font-medium uppercase text-xs tracking-wider text-right">Amount (LKR)</th>
                <th className="px-4 py-4 text-white/40 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40">No records found. Start by adding one!</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        expense.type === 'Earn' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white font-medium">{expense.category}</td>
                    <td className="px-4 py-4 text-white/60">{expense.description}</td>
                    <td className={`px-4 py-4 text-right font-bold font-mono ${
                      expense.type === 'Earn' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {expense.type === 'Spent' ? '-' : '+'} {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(expense)}
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

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
                  {editingExpense ? 'Edit Record' : `Add ${formData.type}`}
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
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Amount (LKR)</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-24 resize-none"
                    placeholder="What was this for?"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 mt-4 ${
                    formData.type === 'Earn' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  }`}
                >
                  {editingExpense ? 'Update Record' : `Add ${formData.type}`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Expenses

