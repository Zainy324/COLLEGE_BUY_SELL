const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

router.get('/seller', auth, async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const newItem = new Item({
      name,
      price,
      description,
      category,
      seller: req.user.id
    });
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    if (item.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { search, categories } = req.query;
    let query = {
      seller: { $ne: req.user.id } 
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (categories && categories.length > 0) {
      query.category = { $in: Array.isArray(categories) ? categories : [categories] };
    }

    const items = await Item.find(query)
      .populate('seller', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'firstName lastName email contactNumber');
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 