import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../utils/axios';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Orders = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const pendingRes = await axios.get('/orders/pending-buyer');
      setPendingOrders(pendingRes.data);

      const purchaseRes = await axios.get('/orders/purchases');
      setPurchaseHistory(purchaseRes.data);

      const salesRes = await axios.get('/orders/sales');
      setSalesHistory(salesRes.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const OrderCard = ({ order, type }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              {order.item.name}
            </Typography>
            <Typography color="textSecondary">
              Order Date: {formatDate(order.createdAt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              Quantity: {order.quantity}
            </Typography>
            <Typography variant="body2">
              Total Price: ₹{order.totalPrice}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            {type === 'pending' && (
              <Typography variant="body2" color="primary">
                Seller: {order.seller.firstName} {order.seller.lastName}
              </Typography>
            )}
            {type === 'purchase' && (
              <Typography variant="body2">
                Seller: {order.seller.firstName} {order.seller.lastName}
              </Typography>
            )}
            {type === 'sale' && (
              <Typography variant="body2">
                Buyer: {order.buyer.firstName} {order.buyer.lastName}
              </Typography>
            )}
            <Chip
              label={order.status.toUpperCase()}
              color={order.status === 'completed' ? 'success' : 'warning'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Pending Orders" />
          <Tab label="Purchase History" />
          <Tab label="Sales History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {pendingOrders.length === 0 ? (
            <Typography align="center">No pending orders</Typography>
          ) : (
            pendingOrders.map((order) => (
              <OrderCard key={order._id} order={order} type="pending" />
            ))
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {purchaseHistory.length === 0 ? (
            <Typography align="center">No purchase history</Typography>
          ) : (
            purchaseHistory.map((order) => (
              <OrderCard key={order._id} order={order} type="purchase" />
            ))
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {salesHistory.length === 0 ? (
            <Typography align="center">No sales history</Typography>
          ) : (
            salesHistory.map((order) => (
              <OrderCard key={order._id} order={order} type="sale" />
            ))
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Orders; 