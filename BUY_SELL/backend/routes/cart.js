const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');

router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.item',
        select: 'name price description category',
        populate: {
          path: 'seller',
          select: 'firstName lastName'
        }
      });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/add/:itemId', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ item: req.params.itemId });
    }

    await cart.save();
    
    cart = await cart.populate({
      path: 'items.item',
      select: 'name price description category',
      populate: {
        path: 'seller',
        select: 'firstName lastName'
      }
    });

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.item.toString() !== req.params.itemId
    );

    await cart.save();
    
    const updatedCart = await cart.populate({
      path: 'items.item',
      select: 'name price description category',
      populate: {
        path: 'seller',
        select: 'firstName lastName'
      }
    });

    res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/quantity/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.item.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const updatedCart = await cart.populate({
      path: 'items.item',
      select: 'name price description category',
      populate: {
        path: 'seller',
        select: 'firstName lastName'
      }
    });

    res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/checkout', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.item');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const ordersWithOtps = [];

    for (const cartItem of cart.items) {
      const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(plainOtp, salt);

      const order = new Order({
        buyer: req.user.id,
        seller: cartItem.item.seller,
        item: cartItem.item._id,
        quantity: cartItem.quantity,
        totalPrice: cartItem.item.price * cartItem.quantity,
        otp: hashedOtp
      });

      await order.save();

      ordersWithOtps.push({
        item: {
          _id: cartItem.item._id,
          name: cartItem.item.name
        },
        plainOtp: plainOtp
      });
    }

    cart.items = [];
    await cart.save();

    res.json(ordersWithOtps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 