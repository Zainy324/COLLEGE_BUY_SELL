import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

const DeliverItems = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    loadPendingDeliveries();
  }, []);

  const loadPendingDeliveries = async () => {
    try {
      const res = await axios.get('/orders/pending-deliveries');
      setPendingDeliveries(res.data);
    } catch (err) {
      showMessage('Failed to load deliveries', 'error');
    }
  };

  const handleOtpChange = (orderId, value) => {
    setOtpInputs(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      await axios.post(`/orders/verify-otp/${orderId}`, {
        otp: otpInputs[orderId]
      });
      setPendingDeliveries(prev => 
        prev.filter(delivery => delivery._id !== orderId)
      );
      showMessage('Order delivered successfully!');
      setOtpInputs(prev => ({
        ...prev,
        [orderId]: ''
      }));
    } catch (err) {
      showMessage(err.response?.data?.msg || 'Invalid OTP', 'error');
    }
  };

  const showMessage = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pending Deliveries
      </Typography>

      {pendingDeliveries.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No pending deliveries</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingDeliveries.map((delivery) => (
            <Grid item xs={12} key={delivery._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6">
                        {delivery.item.name}
                      </Typography>
                      <Typography color="textSecondary">
                        Buyer: {delivery.buyer.firstName} {delivery.buyer.lastName}
                      </Typography>
                      <Typography>
                        Quantity: {delivery.quantity}
                      </Typography>
                      <Typography>
                        Total Price: ₹{delivery.totalPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          label="Enter OTP"
                          value={otpInputs[delivery._id] || ''}
                          onChange={(e) => handleOtpChange(delivery._id, e.target.value)}
                          size="small"
                        />
                        <Button
                          variant="contained"
                          onClick={() => handleVerifyOtp(delivery._id)}
                          disabled={!otpInputs[delivery._id]}
                        >
                          Verify
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

export default DeliverItems; 