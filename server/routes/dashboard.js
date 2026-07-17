const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const [totalProducts, totalCategories, totalSuppliers, lowStockCount, products, recentMovements, categoryBreakdown] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.supplier.count(),
      prisma.product.count({ where: { quantity: { lte: 5 } } }),
      prisma.product.findMany({ select: { quantity: true, price: true, costPrice: true } }),
      prisma.stockMovement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, sku: true } } },
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
      }),
    ]);

    const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalCost = products.reduce((sum, p) => sum + (p.costPrice || 0) * p.quantity, 0);
    const profitMargin = totalValue > 0 ? ((totalValue - totalCost) / totalValue * 100).toFixed(1) : 0;

    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { quantity: 'desc' },
      select: { name: true, quantity: true, price: true, sku: true },
    });

    res.json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      lowStockCount,
      totalValue: totalValue.toFixed(2),
      profitMargin,
      recentMovements,
      categoryBreakdown,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;