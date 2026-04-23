const express = require('express');
const Sale    = require('../models/Sale');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// ─────────────────────────────────────────
// GET /api/sales  — get all sales for this user
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name'); // also bring product name

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sales' });
  }
});

// ─────────────────────────────────────────
// POST /api/sales  — record a new sale
// Body: { productId, quantity, customerName, paymentMethod, note }
// This ALSO reduces stock quantity automatically!
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerName, paymentMethod, note } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product and quantity are required' });
    }

    // Find the product (must belong to this user)
    const product = await Product.findOne({ _id: productId, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if enough stock is available
    const qty = Number(quantity);
    if (product.quantity < qty) {
      return res.status(400).json({
        message: `Not enough stock! Available: ${product.quantity} ${product.unit}`
      });
    }

    // Calculate total
    const totalAmount = product.sellPrice * qty;

    // Create the sale record
    const sale = await Sale.create({
      user:          req.user._id,
      product:       product._id,
      productName:   product.name,   // stored separately for history
      quantity:      qty,
      pricePerUnit:  product.sellPrice,
      totalAmount,
      customerName:  customerName || 'Walk-in',
      paymentMethod: paymentMethod || 'cash',
      note,
    });

    // ✅ Reduce product stock automatically
    product.quantity -= qty;
    await product.save();

    res.status(201).json(sale);
  } catch (err) {
    console.error('Add sale error:', err.message);
    res.status(500).json({ message: 'Failed to record sale' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/sales/:id  — delete a sale record
// Also restores the stock quantity
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Restore stock when a sale is deleted
    const product = await Product.findById(sale.product);
    if (product) {
      product.quantity += sale.quantity;
      await product.save();
    }

    await sale.deleteOne();
    res.json({ message: 'Sale deleted and stock restored' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete sale' });
  }
});

module.exports = router;
