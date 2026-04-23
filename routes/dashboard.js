const express = require('express');
const Sale    = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// ─────────────────────────────────────────
// GET /api/dashboard  — all stats in one call
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Today's date range (midnight to now)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Run all DB queries in parallel for speed
    const [
      allSales,
      todaySalesData,
      allExpenses,
      products,
    ] = await Promise.all([
      Sale.find({ user: userId }),
      Sale.find({ user: userId, createdAt: { $gte: todayStart, $lte: todayEnd } }),
      Expense.find({ user: userId }),
      Product.find({ user: userId }),
    ]);

    // Calculations
    const totalRevenue  = allSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const todaySales    = todaySalesData.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit     = totalRevenue - totalExpenses;

    const lowStockItems = products.filter(p => p.quantity <= (p.lowStockAlert || 5));

    // Last 7 days sales chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label   = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayStr  = d.toDateString();
      const amount  = allSales
        .filter(s => new Date(s.createdAt).toDateString() === dayStr)
        .reduce((sum, s) => sum + s.totalAmount, 0);
      return { name: label, Sales: amount };
    });

    res.json({
      todaySales,
      totalRevenue,
      totalExpenses,
      netProfit,
      totalProducts:  products.length,
      totalSales:     allSales.length,
      lowStockCount:  lowStockItems.length,
      lowStockItems:  lowStockItems.slice(0, 5), // top 5 for dashboard
      last7Days,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

module.exports = router;
