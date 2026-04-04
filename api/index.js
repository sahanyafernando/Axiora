const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/axiora')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const Task = require('./models/Task');
const Expense = require('./models/Expense');
const Goal = require('./models/Goal');

// --- API Routes ---

// Tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// Expenses
app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const newExpense = new Expense(req.body);
  await newExpense.save();
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id', async (req, res) => {
  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedExpense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted' });
});

// Goals
app.get('/api/goals', async (req, res) => {
  const goals = await Goal.find().sort({ createdAt: -1 });
  res.json(goals);
});

app.post('/api/goals', async (req, res) => {
  const newGoal = new Goal(req.body);
  await newGoal.save();
  res.status(201).json(newGoal);
});

app.put('/api/goals/:id', async (req, res) => {
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedGoal);
});

app.delete('/api/goals/:id', async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Goal deleted' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
