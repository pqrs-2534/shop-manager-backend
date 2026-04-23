const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All product routes require login
router.use(protect);

// ─────────────────────────────────────────
// GET /api/products  — get all products for this user
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // Only return products belonging to the logged-in user
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ─────────────────────────────────────────
// POST /api/products  — add a new product
// Body: { name, category, buyPrice, sellPrice, quantity, unit, lowStockAlert }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, category, buyPrice, sellPrice, quantity, unit, lowStockAlert, description } = req.body;

    if (!name || buyPrice == null || sellPrice == null || quantity == null) {
      return res.status(400).json({ message: 'Name, buyPrice, sellPrice and quantity are required' });
    }

    const product = await Product.create({
      user: req.user._id,
      name,
      category,
      buyPrice:      Number(buyPrice),
      sellPrice:     Number(sellPrice),
      quantity:      Number(quantity),
      unit:          unit || 'piece',
      lowStockAlert: Number(lowStockAlert) || 5,
      description,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err.message);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// ─────────────────────────────────────────
// PUT /api/products/:id  — update a product
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, buyPrice, sellPrice, quantity, unit, lowStockAlert, description } = req.body;

    product.name          = name          ?? product.name;
    product.category      = category      ?? product.category;
    product.buyPrice      = buyPrice      != null ? Number(buyPrice)  : product.buyPrice;
    product.sellPrice     = sellPrice     != null ? Number(sellPrice) : product.sellPrice;
    product.quantity      = quantity      != null ? Number(quantity)  : product.quantity;
    product.unit          = unit          ?? product.unit;
    product.lowStockAlert = lowStockAlert != null ? Number(lowStockAlert) : product.lowStockAlert;
    product.description   = description   ?? product.description;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/products/:id  — delete a product
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
