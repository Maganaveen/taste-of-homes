import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
