import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SellIcon from '@mui/icons-material/Sell';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1
            }}
          >
            BuySell@IIIT
          </Typography>


          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
              color="inherit"
              component={Link}
              to="/sell"
              startIcon={<SellIcon />}
            >
              Sell
            </Button>
            
            <Button
              color="inherit"
              component={Link}
              to="/search"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            
            <Button
              color="inherit"
              component={Link}
              to="/cart"
              startIcon={<ShoppingCartIcon />}
            >
              Cart
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/orders"
              startIcon={<HistoryIcon />}
            >
              Orders
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/deliver"
              startIcon={<LocalShippingIcon />}
            >
              Deliver
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/profile"
              startIcon={<PersonIcon />}
            >
              Profile
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 