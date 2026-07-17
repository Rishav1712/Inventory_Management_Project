const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const category = await prisma.category.create({ data: { name, description, color } });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Category already exists' });
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, color },
    });
    res.json(category);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;