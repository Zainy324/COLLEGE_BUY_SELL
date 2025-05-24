import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  Snackbar,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const res = await axios.get(`/items/${id}`);
      setItem(res.data);
    } catch (err) {
      setMessage('Failed to load item details');
      setSeverity('error');
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(`/cart/add/${id}`);
      setMessage('Item added to cart successfully');
      setSeverity('success');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to add item to cart');
      setSeverity('error');
    }
  };

  const handleAddReview = async () => {
    try {
      await axios.post(`/reviews/${item.seller._id}`, reviewData);
      setMessage('Review added successfully');
      setSeverity('success');
      setOpenReviewDialog(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to add review');
      setSeverity('error');
    }
  };

  if (!item) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/search')}
        sx={{ mb: 2 }}
      >
        Back to Search
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{item.price}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Category
            </Typography>
            <Typography variant="body1" paragraph>
              {item.category}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Seller Information
            </Typography>
            <Typography variant="body1">
              {item.seller.firstName} {item.seller.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {item.seller.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact: {item.seller.contactNumber}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                size="large"
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenReviewDialog(true)}
              >
                Review Seller
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Review Seller</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData(prev => ({ ...prev, rating: newValue }));
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewData.comment}
            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddReview}
            variant="contained"
            disabled={!reviewData.comment.trim() || !reviewData.rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert
          onClose={() => setMessage('')}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ItemDetail; 