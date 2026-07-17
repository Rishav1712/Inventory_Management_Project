const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@inventory.com', password: hashedPassword, role: 'admin' },
  });

  const categories = [
    { name: 'Electronics', description: 'Electronic devices and accessories', color: '#4f46e5' },
    { name: 'Furniture', description: 'Office and home furniture', color: '#059669' },
    { name: 'Stationery', description: 'Office stationery and supplies', color: '#d97706' },
    { name: 'Clothing', description: 'Apparel and accessories', color: '#dc2626' },
    { name: 'Food & Beverages', description: 'Food items and drinks', color: '#7c3aed' },
    { name: 'Sports', description: 'Sports equipment and gear', color: '#0891b2' },
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }

  const suppliers = [
    { name: 'TechWorld Distributors', email: 'sales@techworld.com', phone: '+91-9876543210', address: 'Mumbai, Maharashtra', contact: 'Rajesh Kumar' },
    { name: 'OfficePlus Supplies', email: 'info@officeplus.com', phone: '+91-9876543211', address: 'Delhi, NCR', contact: 'Priya Sharma' },
    { name: 'StyleHub Traders', email: 'orders@stylehub.com', phone: '+91-9876543212', address: 'Bangalore, Karnataka', contact: 'Amit Patel' },
    { name: 'FreshCart Wholesale', email: 'bulk@freshcart.com', phone: '+91-9876543213', address: 'Chennai, Tamil Nadu', contact: 'Sneha Reddy' },
  ];

  const supplierMap = {};
  for (const sup of suppliers) {
    const created = await prisma.supplier.create({ data: sup });
    supplierMap[sup.name] = created.id;
  }

  const products = [
    { name: 'Wireless Mouse', sku: 'ELEC-001', quantity: 150, minStock: 20, price: 599, costPrice: 350, unit: 'pcs', location: 'Shelf A1', categoryId: categoryMap['Electronics'], supplierId: supplierMap['TechWorld Distributors'] },
    { name: 'Mechanical Keyboard', sku: 'ELEC-002', quantity: 75, minStock: 15, price: 2499, costPrice: 1500, unit: 'pcs', location: 'Shelf A2', categoryId: categoryMap['Electronics'], supplierId: supplierMap['TechWorld Distributors'] },
    { name: 'USB-C Hub', sku: 'ELEC-003', quantity: 8, minStock: 10, price: 1299, costPrice: 800, unit: 'pcs', location: 'Shelf A3', categoryId: categoryMap['Electronics'], supplierId: supplierMap['TechWorld Distributors'] },
    { name: 'Webcam HD', sku: 'ELEC-004', quantity: 45, minStock: 10, price: 1899, costPrice: 1100, unit: 'pcs', location: 'Shelf A4', categoryId: categoryMap['Electronics'], supplierId: supplierMap['TechWorld Distributors'] },
    { name: 'Monitor Stand', sku: 'FURN-001', quantity: 30, minStock: 8, price: 1499, costPrice: 900, unit: 'pcs', location: 'Shelf B1', categoryId: categoryMap['Furniture'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'Ergonomic Chair', sku: 'FURN-002', quantity: 12, minStock: 5, price: 8999, costPrice: 5500, unit: 'pcs', location: 'Shelf B2', categoryId: categoryMap['Furniture'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'Standing Desk', sku: 'FURN-003', quantity: 3, minStock: 5, price: 14999, costPrice: 9000, unit: 'pcs', location: 'Shelf B3', categoryId: categoryMap['Furniture'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'A4 Paper Ream', sku: 'STAT-001', quantity: 200, minStock: 50, price: 299, costPrice: 180, unit: 'ream', location: 'Shelf C1', categoryId: categoryMap['Stationery'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'Gel Pen Pack', sku: 'STAT-002', quantity: 120, minStock: 30, price: 149, costPrice: 70, unit: 'pack', location: 'Shelf C2', categoryId: categoryMap['Stationery'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'Whiteboard Markers', sku: 'STAT-003', quantity: 4, minStock: 15, price: 199, costPrice: 100, unit: 'pack', location: 'Shelf C3', categoryId: categoryMap['Stationery'], supplierId: supplierMap['OfficePlus Supplies'] },
    { name: 'Cotton T-Shirt', sku: 'CLO-001', quantity: 85, minStock: 20, price: 499, costPrice: 250, unit: 'pcs', location: 'Rack D1', categoryId: categoryMap['Clothing'], supplierId: supplierMap['StyleHub Traders'] },
    { name: 'Formal Shirt', sku: 'CLO-002', quantity: 40, minStock: 10, price: 899, costPrice: 500, unit: 'pcs', location: 'Rack D2', categoryId: categoryMap['Clothing'], supplierId: supplierMap['StyleHub Traders'] },
    { name: 'Green Tea Box', sku: 'FB-001', quantity: 60, minStock: 25, price: 350, costPrice: 200, unit: 'box', location: 'Shelf E1', categoryId: categoryMap['Food & Beverages'], supplierId: supplierMap['FreshCart Wholesale'] },
    { name: 'Coffee Beans 1kg', sku: 'FB-002', quantity: 2, minStock: 10, price: 799, costPrice: 500, unit: 'pack', location: 'Shelf E2', categoryId: categoryMap['Food & Beverages'], supplierId: supplierMap['FreshCart Wholesale'] },
    { name: 'Yoga Mat', sku: 'SPT-001', quantity: 25, minStock: 8, price: 999, costPrice: 550, unit: 'pcs', location: 'Rack F1', categoryId: categoryMap['Sports'], supplierId: supplierMap['StyleHub Traders'] },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    });
  }

  console.log('Seed data created successfully!');
  console.log('Login: admin@inventory.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());