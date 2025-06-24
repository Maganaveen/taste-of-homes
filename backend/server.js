import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Order from './models/order.js';
import CartCount from './models/CartCount.js';
import Cart from './models/cart.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  // These options are no longer needed for Mongoose 6+
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { itemId, itemName, quantity, price, total, discount, paymentMethod, phone, address } = req.body;

    if (!itemName || !quantity || !paymentMethod || !phone || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      itemId,
      itemName,
      quantity,
      price,
      total,
      discount,
      paymentMethod,
      customerName: req.user.name,
      phone,
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

app.post('/api/cart/count', async (req, res) => {
  const { userId, count } = req.body;

  if (!userId || typeof count !== 'number') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    await CartCount.findOneAndUpdate(
      { userId },
      { count },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Cart count updated' });
  } catch (error) {
    console.error('❌ Cart count update error:', error);
    res.status(500).json({ message: 'Failed to update cart count' });
  }
});

app.post('/api/cart/save', authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items required' });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Cart saved successfully', cart: updatedCart });
  } catch (error) {
    console.error('❌ Cart save error:', error);
    res.status(500).json({ message: 'Failed to save cart' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
