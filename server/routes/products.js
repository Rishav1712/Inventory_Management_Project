const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { search, categoryId, supplierId, lowStock } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (supplierId) where.supplierId = parseInt(supplierId);
    if (lowStock === 'true') where.quantity = { lte: prisma.product.fields?.minStock || 5 };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, supplier: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, supplier: true, movements: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, sku, quantity, minStock, price, costPrice, unit, location, categoryId, supplierId } = req.body;
    if (!name || !sku || price === undefined) {
      return res.status(400).json({ error: 'Name, SKU, and price are required' });
    }
    const product = await prisma.product.create({
      data: {
        name, description, sku,
        quantity: parseInt(quantity) || 0,
        minStock: parseInt(minStock) || 5,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice) || 0,
        unit: unit || 'pcs',
        location,
        categoryId: categoryId ? parseInt(categoryId) : null,
        supplierId: supplierId ? parseInt(supplierId) : null,
      },
      include: { category: true, supplier: true },
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, sku, quantity, minStock, price, costPrice, unit, location, categoryId, supplierId } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, description, sku,
        quantity: parseInt(quantity),
        minStock: parseInt(minStock),
        price: parseFloat(price),
        costPrice: parseFloat(costPrice) || 0,
        unit, location,
        categoryId: categoryId ? parseInt(categoryId) : null,
        supplierId: supplierId ? parseInt(supplierId) : null,
      },
      include: { category: true, supplier: true },
    });
    res.json(product);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    if (error.code === 'P2002') return res.status(409).json({ error: 'SKU already exists' });
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

router.post('/:id/stock', async (req, res) => {
  try {
    const { type, quantity, reason } = req.body;
    if (!type || !quantity) return res.status(400).json({ error: 'Type and quantity are required' });

    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let newQty = product.quantity;
    if (type === 'in') newQty += parseInt(quantity);
    else if (type === 'out') {
      if (product.quantity < parseInt(quantity)) return res.status(400).json({ error: 'Insufficient stock' });
      newQty -= parseInt(quantity);
    } else if (type === 'adjustment') newQty = parseInt(quantity);
    else return res.status(400).json({ error: 'Invalid type: use in, out, or adjustment' });

    const [updated, movement] = await prisma.$transaction([
      prisma.product.update({ where: { id: product.id }, data: { quantity: newQty } }),
      prisma.stockMovement.create({ data: { type, quantity: parseInt(quantity), reason, productId: product.id } }),
    ]);

    res.json({ product: updated, movement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

module.exports = router;