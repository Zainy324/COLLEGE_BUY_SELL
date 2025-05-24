import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Furniture',
  'Sports',
  'Others'
];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await axios.get('/items/seller');
      setItems(res.data);
    } catch (err) {
      console.error('Error loading items:', err);
    }
  };

  const handleChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/items', newItem);
      setOpenDialog(false);
      setNewItem({
        name: '',
        price: '',
        description: '',
        category: ''
      });
      loadItems();
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`/items/${itemId}`);
      loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Item
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Price: ₹{item.price}
                </Typography>
                <Typography variant="body2">
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" noWrap>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newItem.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={newItem.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newItem.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={newItem.category}
            onChange={handleChange}
            margin="normal"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 