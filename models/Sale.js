const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

    // We store productName separately so if product is deleted, history stays intact
    productName:   { type: String, required: true },
    quantity:      { type: Number, required: true, min: 1 },
    pricePerUnit:  { type: Number, required: true },   // sell price at time of sale
    totalAmount:   { type: Number, required: true },   // quantity × pricePerUnit

    customerName:  { type: String, trim: true, default: 'Walk-in' },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'card', 'credit'], default: 'cash' },
    note:          { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
