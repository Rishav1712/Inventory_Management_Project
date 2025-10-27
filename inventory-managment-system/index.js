// index.js

// 1. Import necessary packages
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

// 2. Initialize Express app and Prisma Client
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// 3. Middleware
app.use(cors()); // Allows cross-origin requests (from your frontend)
app.use(express.json()); // Allows the server to understand JSON in request bodies

// --- API ENDPOINTS ---

// GET: Fetch all products
// Endpoint: http://localhost:3001/api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' } // Optional: order by newest first
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST: Create a new product
// Endpoint: http://localhost:3001/api/products
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    // Basic validation
    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Name, quantity, and price are required' });
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT: Update an existing product by ID
// Endpoint: http://localhost:3001/api/products/1
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    // Handle case where product to update is not found
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE: Delete a product by ID
// Endpoint: http://localhost:3001/api/products/1
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 204 No Content is a standard success response for delete
  } catch (error) {
    // Handle case where product to delete is not found
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});