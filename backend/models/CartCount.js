import mongoose from 'mongoose';

const cartCountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const CartCount = mongoose.models.CartCount || mongoose.model('CartCount', cartCountSchema);

export default CartCount;
