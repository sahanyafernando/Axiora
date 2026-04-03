import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const Expenses = () => {
  const [expenses] = useState([
    { id: 1, type: 'Spent', amount: 1500, category: 'Necessary food', description: 'Lunch' },
    { id: 2, type: 'Earn', amount: 50000, category: 'Salary', description: 'Monthly Salary' },
  ])

  /*
  const categories = [
    'Necessary food', 'Fancy food', 'Clothing and cosmetics', 'Medicine', 
    'For home', 'Data and voice plan', 'Travelling', 'Other with reason'
  ]
  */

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Expenses</h2>
        <div className="flex space-x-4">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center shadow-lg transition-colors">
            <Plus className="mr-2" size={20} /> Add Earn
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center shadow-lg transition-colors">
            <Plus className="mr-2" size={20} /> Add Spent
          </button>
        </div>
      </header>

      <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-white/60 font-medium">Type</th>
                <th className="py-4 text-white/60 font-medium">Category</th>
                <th className="py-4 text-white/60 font-medium">Description</th>
                <th className="py-4 text-white/60 font-medium text-right">Amount (LKR)</th>
                <th className="py-4 text-white/60 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-lg text-sm ${expense.type === 'Earn' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="py-4 text-white">{expense.category}</td>
                  <td className="py-4 text-white/70">{expense.description}</td>
                  <td className="py-4 text-right font-mono text-white">
                    {expense.type === 'Spent' ? '-' : '+'} {expense.amount.toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  )
}

export default Expenses
