const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');

router.get('/seller/:sellerId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('reviewer', 'firstName lastName')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/:sellerId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (req.params.sellerId === req.user.id) {
      return res.status(400).json({ msg: 'Cannot review yourself' });
    }

    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      seller: req.params.sellerId
    });

    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this seller' });
    }

    const review = new Review({
      reviewer: req.user.id,
      seller: req.params.sellerId,
      rating,
      comment
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName');

    res.json(populatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 