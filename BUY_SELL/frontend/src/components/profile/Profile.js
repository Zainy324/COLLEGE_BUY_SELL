import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../utils/axios';
import { userLoaded } from '../../features/authSlice';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    contactNumber: ''
  });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        contactNumber: user.contactNumber
      });
      loadReviews();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put('/auth/update', formData);
      dispatch(userLoaded(res.data));
      setEditing(false);
      setMessage('Profile updated successfully');
      setSeverity('success');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Update failed');
      setSeverity('error');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      contactNumber: user.contactNumber
    });
    setEditing(false);
  };

  const loadReviews = async () => {
    try {
      const res = await axios.get(`/reviews/seller/${user._id}`);
      setReviews(res.data);
      
      // Calculate average rating
      if (res.data.length > 0) {
        const avg = res.data.reduce((acc, review) => acc + review.rating, 0) / res.data.length;
        setAverageRating(avg);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Profile</Typography>
            {!editing ? (
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={user.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Seller Reviews
          {reviews.length > 0 && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({reviews.length} reviews)
              </Typography>
            </Box>
          )}
        </Typography>

        {reviews.length === 0 ? (
          <Typography color="text.secondary">No reviews yet</Typography>
        ) : (
          reviews.map((review) => (
            <Box key={review._id} sx={{ mt: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  by {review.reviewer.firstName} {review.reviewer.lastName}
                </Typography>
              </Box>
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert severity={severity} onClose={() => setMessage('')}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 