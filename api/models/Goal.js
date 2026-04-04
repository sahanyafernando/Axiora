const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Weekly', 'Monthly'], required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);
