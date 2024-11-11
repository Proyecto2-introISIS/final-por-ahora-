const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  name: String,
  participants: [{ name: String, email: String }],
  expenses: [{ description: String, amount: Number, paidBy: String, splitAmong: [String] }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', BudgetSchema);