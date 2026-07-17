# Inventory Management System

Full-stack inventory management system with React, Express, Prisma, and SQLite.

## Features
- User authentication (JWT)
- Product CRUD with search and filter
- Stock in/out/adjustment tracking
- Category management with colors
- Supplier management
- Dashboard with KPIs

## Tech Stack
- **Frontend:** React 18 + Vite + React Router + Lucide Icons
- **Backend:** Express.js + Prisma ORM
- **Database:** SQLite
- **Auth:** JWT + bcryptjs

## Quick Start

```bash
# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Setup database
cd server && npx prisma generate && npx prisma db push && node seed.js && cd ..

# Run development
npm run dev
```

**Login:** `admin@inventory.com` / `admin123`

## Project Structure

```
├── server/
│   ├── index.js          # Express entry point
│   ├── seed.js           # Database seeder
│   ├── prisma/schema.prisma
│   ├── middleware/auth.js
│   └── routes/
│       ├── auth.js
│       ├── products.js
│       ├── categories.js
│       ├── suppliers.js
│       └── dashboard.js
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── context/AuthContext.jsx
    │   ├── components/Sidebar.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Dashboard.jsx
    │       ├── Products.jsx
    │       ├── Categories.jsx
    │       └── Suppliers.jsx
    └── vite.config.js
```