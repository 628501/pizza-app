import axios from 'axios';

export const createOrder = async (order) => {
  try {
    const { data } = await axios.post('/api/orders/create', order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrder = async (orderId) => {
  try {
    const { data } = await axios.get(`/api/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const newOrder = async (order) => {
  try {
    const { data } = await axios.post('/api/orders/newOne', order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const currentUser = async (email) => {
  try {
    const { data } = await axios.get('/api/orders', { params: { email } });
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const DeleteOrder1 = async (orderId) => {
  try {
    const { data } = await axios.delete(`/api/orders/delete/neworder/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const DeleteOrder2 = async (orderId) => {
  try {
    const { data } = await axios.delete(`/api/orders/delete/order/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

