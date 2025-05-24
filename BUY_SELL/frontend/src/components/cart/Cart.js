import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [checkoutOtps, setCheckoutOtps] = useState([]);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await axios.get('/cart');
      setCart(res.data);
    } catch (err) {
      showMessage('Failed to load cart', 'error');
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const res = await axios.put(`/cart/quantity/${itemId}`, { quantity });
      setCart(res.data);
      showMessage('Cart updated successfully');
    } catch (err) {
      showMessage('Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axios.delete(`/cart/remove/${itemId}`);
      setCart(res.data);
      showMessage('Item removed from cart');
    } catch (err) {
      showMessage('Failed to remove item', 'error');
    }
  };

  const showMessage = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post('/cart/checkout');
      setCheckoutOtps(res.data);
      setShowOtpDialog(true);
      setCart({ items: [] });
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Checkout failed');
      setSeverity('error');
    }
  };

  const handleCloseOtpDialog = () => {
    setShowOtpDialog(false);
    setCheckoutOtps([]);
    navigate('/orders');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        {cart.items.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
            Your cart is empty
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((cartItem) => (
                    <TableRow key={cartItem.item._id}>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {cartItem.item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Seller: {cartItem.item.seller.firstName} {cartItem.item.seller.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>₹{cartItem.item.price}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={cartItem.quantity}
                          onChange={(e) => handleQuantityChange(cartItem.item._id, e.target.value)}
                          InputProps={{ inputProps: { min: 1 } }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>₹{cartItem.item.price * cartItem.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(cartItem.item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Total: ₹{calculateTotal()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartCheckoutIcon />}
                size="large"
                onClick={handleCheckout}
                disabled={cart.items.length === 0}
              >
                Checkout
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* OTP */}
      <Dialog
        open={showOtpDialog}
        onClose={handleCloseOtpDialog}
        aria-labelledby="otp-dialog-title"
      >
        <DialogTitle id="otp-dialog-title">
          Order Placed Successfully! Please save these OTPs
        </DialogTitle>
        <DialogContent>
          {checkoutOtps.map((order, index) => (
            <Typography key={index} paragraph>
              {order.item.name}: <strong>{order.plainOtp}</strong>
            </Typography>
          ))}
          <Typography color="error" sx={{ mt: 2 }}>
            Please note down these OTPs as they won't be shown again!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog} variant="contained">
            I've Saved the OTPs
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
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

export default Cart; 