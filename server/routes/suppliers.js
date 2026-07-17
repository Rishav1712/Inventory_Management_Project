const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, contact } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const supplier = await prisma.supplier.create({ data: { name, email, phone, address, contact } });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, contact } = req.body;
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, phone, address, contact },
    });
    res.json(supplier);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Supplier not found' });
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Supplier not found' });
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

module.exports = router;