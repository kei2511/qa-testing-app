# 📦 Product Inventory Manager — QA Testing App

A full-stack **Product Inventory Manager** built with **Next.js** and **Neon PostgreSQL**, designed as a testing playground for QA engineers to practice:

- ✅ **UI Testing** — Login, register, CRUD operations, search, filter, pagination
- ✅ **API Testing** — RESTful endpoints with JWT authentication
- ✅ **SQL Testing** — Direct database queries, schema validation, data integrity

---

## 🏗️ Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | Next.js (React)     |
| Backend  | Next.js API Routes  |
| Database | Neon PostgreSQL     |
| Auth     | JWT + bcrypt        |
| Deploy   | Vercel              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.local` and update with your credentials:
```env
DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Setup Database
Run the `schema.sql` file on your Neon database to create tables and seed data:
```sql
-- Execute schema.sql via Neon Console or pgAdmin
```

### 4. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Demo Login
```
Email:    admin@example.com
Password: password123
```

---

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login & get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/products` | ✅ | List products (search, filter, paginate, sort) |
| GET | `/api/products/:id` | ✅ | Get product detail |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/:id` | ✅ | Update product |
| DELETE | `/api/products/:id` | ✅ | Delete product |
| GET | `/api/categories` | ✅ | List categories |
| POST | `/api/categories` | ✅ | Create category |

### Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Query Parameters (GET /api/products)
- `search` — Search by name or description
- `category` — Filter by category ID
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `sort` — Sort column: name, price, stock, created_at (default: created_at)
- `order` — Sort order: asc, desc (default: desc)

---

## 🗄️ Database Schema

```sql
-- users: id, name, email, password, role, created_at
-- categories: id, name, description
-- products: id, name, description, price, stock, category_id, created_by, created_at, updated_at
```

See `schema.sql` for full DDL and seed data.

---

## 🧪 Testing Guide

### UI Testing
- Login & register flow
- CRUD products (Add, Edit, Delete)
- Search & category filter
- Table sorting by columns
- Pagination navigation
- Form validation (empty fields, invalid email, etc.)
- Success/error messages
- Modal open/close behavior
- Responsive design

### API Testing (Postman)
- Test all endpoints with valid/invalid tokens
- Test input validation (missing fields, wrong types)
- Test edge cases (duplicate email, non-existent product)
- Test query parameters combinations
- Verify correct HTTP status codes

### SQL Testing
- Verify table structure and constraints
- Test foreign key relationships
- Run SELECT queries with JOINs
- Test INSERT/UPDATE/DELETE with constraints
- Verify data integrity after operations

---

## 📁 Project Structure

```
Testing App/
├── schema.sql              # Database DDL + seed data
├── .env.local              # Environment variables
├── src/
│   ├── app/
│   │   ├── layout.js       # Root layout
│   │   ├── page.js         # Login/Register page
│   │   ├── globals.css     # Design system
│   │   ├── dashboard/
│   │   │   └── page.js     # Dashboard (CRUD, search, filter)
│   │   └── api/
│   │       ├── auth/       # register, login, me
│   │       ├── products/   # CRUD + [id]
│   │       └── categories/ # list + create
│   ├── lib/
│   │   ├── db.js           # PostgreSQL connection pool
│   │   └── auth.js         # JWT helpers
│   └── components/
│       ├── LoginForm.js
│       ├── RegisterForm.js
│       ├── Navbar.js
│       ├── ProductTable.js
│       ├── ProductModal.js
│       ├── SearchBar.js
│       └── Pagination.js
```
