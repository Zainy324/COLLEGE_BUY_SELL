const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.get('/pending-buyer', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user.id,
      status: 'pending'
    })
    .populate('item')
    .populate('buyer', 'firstName lastName')
    .populate('seller', 'firstName lastName')
    .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/purchases', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user.id,
      status: 'completed'
    })
    .populate('item')
    .populate('buyer', 'firstName lastName')
    .populate('seller', 'firstName lastName')
    .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/sales', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      seller: req.user.id,
      status: 'completed'
    })
    .populate('item')
    .populate('buyer', 'firstName lastName')
    .populate('seller', 'firstName lastName')
    .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/pending-deliveries', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      seller: req.user.id,
      status: 'pending'
    })
    .populate('item')
    .populate('buyer', 'firstName lastName')
    .sort('-createdAt');
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/verify-otp/:orderId', auth, async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const isMatch = await bcrypt.compare(otp, order.otp);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    order.status = 'completed';
    await order.save();

    res.json({ msg: 'Order completed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 