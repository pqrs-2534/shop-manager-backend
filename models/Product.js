const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Each product belongs to a specific user/shop
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    name:          { type: String, required: true, trim: true },
    category:      { type: String, trim: true, default: 'General' },
    buyPrice:      { type: Number, required: true, min: 0 },  // Price you buy at
    sellPrice:     { type: Number, required: true, min: 0 },  // Price you sell at
    quantity:      { type: Number, required: true, min: 0, default: 0 },
    unit:          { type: String, default: 'piece' },        // piece, kg, litre, pack...
    lowStockAlert: { type: Number, default: 5 },              // Alert when qty drops below this
    description:   { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
