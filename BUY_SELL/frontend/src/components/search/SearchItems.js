import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
  Divider,
  CardActionArea
} from '@mui/material';

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Furniture',
  'Sports',
  'Stationery',
  'Others'
];

const SearchItems = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, [selectedCategories]); 

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(category => {
          params.append('categories[]', category);
        });
      }
      
      const res = await axios.get(`/items/search?${params.toString()}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  }
                  label={category}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {/* Search Section */}
        <Grid item xs={12} md={9}>
          {/* Search Bar */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                label="Search Items"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
              >
                Search
              </Button>
            </form>
          </Paper>

          {/* Results */}
          <Grid container spacing={3}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : items.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  No items found
                </Typography>
              </Grid>
            ) : (
              items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card>
                    <CardActionArea onClick={() => handleItemClick(item._id)}>
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
                        <Typography variant="body2">
                          Seller: {item.seller.firstName} {item.seller.lastName}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchItems; 