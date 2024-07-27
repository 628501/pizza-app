import { Router } from 'express';
import auth from '../MiddleWare/auth.mid.js';
import handler from 'express-async-handler';
import { connection } from '../server.js';
import { BAD_REQUEST } from '../Constants/httpStatus.js';

const router = Router();
router.use(auth);

router.post('/create', handler(async (req, res) => {
  const { name, address, cart_items, total_price, addressLatLng } = req.body;

  try {
    if (!cart_items || !Array.isArray(cart_items) || cart_items.length <= 0) {
      return res.status(BAD_REQUEST).send('Cart Is Empty!');
    }

    const query = 'INSERT INTO orders (name, address, items, totalPrice, new_address) VALUES (?, ?, ?, ?, ?)';
    const values = [name, address, JSON.stringify(cart_items), total_price, JSON.stringify(addressLatLng)];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json(results.insertId);
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.get('/:orderId', handler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const query = 'SELECT * FROM orders WHERE id = ?';
    connection.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error fetching order:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.post('/newOne', handler(async (req, res) => {
  const { name, address, emailId, cart_items, total_price, addressLatLng, paymentId, status } = req.body;

  try {
    if (!cart_items || !Array.isArray(cart_items) || cart_items.length <= 0) {
      return res.status(BAD_REQUEST).send('Cart Is Empty!');
    }

    const query = 'INSERT INTO newOrders (name, address, email, items, totalPrice, new_address, paymentId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, address, emailId, JSON.stringify(cart_items), total_price, JSON.stringify(addressLatLng), paymentId, status];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json(results.insertId);
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.get('/', handler(async (req, res) => {
  const { email } = req.query;

  try {
    const query = 'SELECT * FROM newOrders WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Orders not found' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.delete('/delete/neworder/:orderId', handler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const query = 'DELETE FROM newOrders WHERE id = ?';
    connection.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error deleting order:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.delete('/delete/order/:orderId', handler(async (req, res) => {
  const { orderId } = req.params;

  try {
    const query = 'DELETE FROM orders WHERE id = ?';
    connection.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error deleting order:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));




export default router;
