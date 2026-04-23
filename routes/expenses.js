const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// ─────────────────────────────────────────
// GET /api/expenses
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

// ─────────────────────────────────────────
// POST /api/expenses
// Body: { title, amount, category, note }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, note } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    const expense = await Expense.create({
      user:     req.user._id,
      title,
      amount:   Number(amount),
      category: category || 'Other',
      note,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error('Add expense error:', err.message);
    res.status(500).json({ message: 'Failed to add expense' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/expenses/:id
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

module.exports = router;
