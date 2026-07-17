# 📦 Inventory Management System

<p align="center">
  <img src="assets/banner.svg" alt="Inventory Management System Banner" width="100%"/>
</p>

<p align="center">
  <strong>Full-stack inventory management system with React, Express, Prisma, and SQLite.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
</p>

---

## ✨ Features

- **🔐 User Authentication** — JWT-based login & register with bcryptjs password hashing
- **📊 Dashboard** — Real-time KPIs, stock movement charts, top products, and category breakdown
- **📦 Product Management** — Full CRUD with search, filter, stock in/out/adjustment tracking
- **🏷️ Category Management** — Color-coded categories with product counts
- **🏢 Supplier Management** — Supplier cards with contact details and linked products
- **⚡ Low Stock Alerts** — Visual indicators for products below minimum stock levels
- **📱 Responsive Design** — Works on desktop and mobile devices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + React Router + Lucide Icons |
| **Backend** | Express.js + REST API |
| **ORM** | Prisma |
| **Database** | SQLite |
| **Auth** | JWT + bcryptjs |
| **Styling** | Custom CSS with gradients and animations |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Rishav1712/Inventory_Management_Project.git
cd Inventory_Management_Project

# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Setup database
cd server
npx prisma generate
npx prisma db push
node seed.js
cd ..

# Run development server
npm run dev
```

The app will be available at **http://localhost:3000**

### 🔑 Default Login

| Email | Password |
|-------|----------|
| `admin@inventory.com` | `admin123` |

## 📁 Project Structure

```
├── server/
│   ├── index.js              # Express entry point
│   ├── seed.js               # Database seeder (admin, categories, suppliers, products)
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── routes/
│       ├── auth.js           # Login, register, profile
│       ├── products.js       # Product CRUD + stock management
│       ├── categories.js     # Category CRUD
│       ├── suppliers.js      # Supplier CRUD
│       └── dashboard.js      # Dashboard KPIs and analytics
└── client/
    ├── index.html
    ├── vite.config.js        # Vite config with API proxy
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Router setup
        ├── api.js            # API helper with auto-redirect
        ├── index.css         # Global styles
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── Sidebar.jsx
        └── pages/
            ├── Login.jsx     # Login / Register
            ├── Dashboard.jsx # KPIs + Charts
            ├── Products.jsx  # Product table + modals
            ├── Categories.jsx# Category cards
            └── Suppliers.jsx # Supplier cards
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all (with search/filter) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/:id/stock` | Stock in/out/adjustment |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all |
| POST | `/api/categories` | Create |
| PUT | `/api/categories/:id` | Update |
| DELETE | `/api/categories/:id` | Delete |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | List all |
| POST | `/api/suppliers` | Create |
| PUT | `/api/suppliers/:id` | Update |
| DELETE | `/api/suppliers/:id` | Delete |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | KPIs, movements, top products |

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Rishav1712">Rishav</a>
</p>
