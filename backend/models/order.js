import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  itemId: Number,
  itemName: String,
  quantity: Number,
  price: Number,
  total: Number,
  discount: Number,
  paymentMethod: String,
  customerName: String,
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
