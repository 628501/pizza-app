import { Router } from "express";
import { base, sample_tags, toppings } from "../Data.js";
import handler from "express-async-handler";
import { connection } from "../server.js";
import adminMid from "../MiddleWare/admin.mid.js";

const router = Router();

router.get('/', handler(async (req, res) => {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM products');
    res.send(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ error: 'Error fetching data' });
  }
}));

router.get('/tags', (req, res) => {
  res.send(sample_tags);
});

router.get('/base', (req, res) => {
  res.send(base);
});

router.get('/toppings', (req, res) => {
  res.send(toppings);
});

router.get('/search/:searchTerm', handler(async (req, res) => {
  const { searchTerm } = req.params;
  try {
    const [rows] = await connection.promise().query('SELECT * FROM products WHERE name LIKE ?', [`%${searchTerm}%`]);
    res.send(rows);
  } catch (error) {
    console.error('Error searching for products:', error);
    res.status(500).send({ error: 'Error searching for products' });
  }
}));

router.get('/tag/:tag', handler(async (req, res) => {
  const { tag } = req.params;
  try {
    const [rows] = await connection.promise().query('SELECT * FROM products WHERE JSON_CONTAINS(tags, ?)', [`"${tag}"`]);
    res.send(rows);
  } catch (error) {
    console.error('Error searching for tags:', error);
    res.status(500).send({ error: 'Error searching for tags' });
  }
}));

router.put('/', adminMid, handler(async (req, res) => {
  const { id, name, price, tags, favourite, imageUrl, origins, cookTime } = req.body;

  try {
    const query = 'UPDATE products SET name = ?, price = ?, tags = ?, favourite = ?, imageUrl = ?, origins = ?, cookTime = ? WHERE id = ?';
    const values = [name, price, JSON.stringify(tags.split ? tags.split(",") : tags), favourite, imageUrl, JSON.stringify(origins.split ? origins.split(",") : origins), cookTime, id];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ status: 'Product updated successfully' });
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.post('/', adminMid, handler(async (req, res) => {
  const { name, price, tags, favourite, imageUrl, origins, cookTime } = req.body;

  try {
    const query = 'INSERT INTO products (name, cookTime, imageUrl, favourite, origins, price, tags) Values (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, cookTime, imageUrl, favourite, [JSON.stringify(origins.split ? origins.split(",") : origins)],  price, [JSON.stringify(tags.split ? tags.split(",") : tags)]];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error Adding product:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json(results.insertId);
    });
  } catch (error) {
    console.error('Error Adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

router.get('/:foodId', handler(async (req, res) => {
  const { foodId } = req.params;
  try {
    const [rows] = await connection.promise().query('SELECT * FROM products WHERE id = ?', [foodId]);
    if (rows.length === 0) {
      res.status(404).send({ error: 'Product not found' });
    } else {
      res.send(rows[0]);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send({ error: 'Error fetching product' });
  }
}));

router.delete('/:foodId', adminMid, handler(async (req, res) => {
  const { foodId } = req.params;

  try {
    const query = 'DELETE FROM products WHERE id = ?';
    connection.query(query, [foodId], (err, results) => {
      if (err) {
        console.error('Error deleting product:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error' });
  }
}));

export default router;

