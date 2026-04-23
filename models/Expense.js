const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title:    { type: String, required: true, trim: true },
    amount:   { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ['Rent', 'Electricity', 'Water', 'Staff Salary', 'Transport', 'Packaging', 'Purchase', 'Repairs', 'Other'],
      default: 'Other'
    },
    note:     { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
