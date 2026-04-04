const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  type: { type: String, enum: ['Earn', 'Spent'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
