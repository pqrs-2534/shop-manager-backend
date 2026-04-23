# Shop Manager — Backend API

## Folder Structure

```
shop-manager-backend/
├── config/
│   └── db.js              ← MongoDB connection
├── middleware/
│   └── auth.js            ← JWT protection for routes
├── models/
│   ├── User.js            ← Shopkeeper accounts
│   ├── Product.js         ← Inventory items
│   ├── Sale.js            ← Sale transactions
│   └── Expense.js         ← Shop expenses
├── routes/
│   ├── auth.js            ← /api/auth/*
│   ├── products.js        ← /api/products/*
│   ├── sales.js           ← /api/sales/*
│   ├── expenses.js        ← /api/expenses/*
│   └── dashboard.js       ← /api/dashboard
├── .env.example           ← Template for your .env file
├── .gitignore
├── package.json
└── server.js              ← Main entry point
```

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |
| GET  | /api/products | Get all products |
| POST | /api/products | Add product |
| PUT  | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET  | /api/sales | Get all sales |
| POST | /api/sales | Record sale (auto-reduces stock) |
| DELETE | /api/sales/:id | Delete sale (restores stock) |
| GET  | /api/expenses | Get all expenses |
| POST | /api/expenses | Add expense |
| DELETE | /api/expenses/:id | Delete expense |
| GET  | /api/dashboard | All stats in one call |
