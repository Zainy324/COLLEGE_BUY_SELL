import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import SellItems from './components/sell/SellItems';
import SearchItems from './components/search/SearchItems';
import Cart from './components/cart/Cart';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import { userLoaded, authError } from './features/authSlice';
import axios from './utils/axios';
import ItemDetail from './components/items/ItemDetail';
import Orders from './components/orders/Orders';
import DeliverItems from './components/deliver/DeliverItems';
import ChatBot from './components/chat/ChatBot';

const PrivateLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('/auth/me');
        dispatch(userLoaded(res.data));
      } catch (err) {
        dispatch(authError('Session expired'));
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes */}
        <Route
          path="/sell"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <SellItems />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Profile />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <SearchItems />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Cart />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/items/:id"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <ItemDetail />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <Orders />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deliver"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <DeliverItems />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/profile" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <ChatBot />
    </Provider>
  );
};

export default App; 