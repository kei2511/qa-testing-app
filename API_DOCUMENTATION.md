# 📘 API Documentation — Product Inventory Manager

## Base URL

```
Production : https://qa-testing-app-autumns-projects-0e37cc7f.vercel.app
Local      : http://localhost:3000
```

---

## 🔑 Authentication

API ini menggunakan **JWT (JSON Web Token)**. Setelah login atau register, kamu akan mendapat `token` di response. Token ini harus dikirim di **header** untuk mengakses endpoint yang dilindungi.

### Header Format

```
Authorization: Bearer <token>
Content-Type: application/json
```

> ⚠️ Jika token tidak dikirim atau invalid, API akan mengembalikan status `401 Unauthorized`.

---

## 📌 Endpoints

---

### 1. POST `/api/auth/register`

Mendaftarkan user baru.

**Auth Required:** ❌ Tidak

**Request Body:**

| Field    | Type   | Required | Rules                        |
|----------|--------|----------|------------------------------|
| name     | string | ✅       | Tidak boleh kosong           |
| email    | string | ✅       | Format email valid, unik     |
| password | string | ✅       | Minimal 6 karakter           |

**Request Example:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Response Success — `201 Created`:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response Error:**

| Status | Condition                    | Response Body                              |
|--------|------------------------------|--------------------------------------------|
| 400    | Field kosong                 | `{ "error": "Name, email, and password are required" }` |
| 400    | Password < 6 karakter        | `{ "error": "Password must be at least 6 characters" }` |
| 400    | Format email invalid         | `{ "error": "Invalid email format" }`      |
| 409    | Email sudah terdaftar        | `{ "error": "Email already registered" }`  |
| 500    | Server error                 | `{ "error": "Internal server error" }`     |

---

### 2. POST `/api/auth/login`

Login dan mendapatkan JWT token.

**Auth Required:** ❌ Tidak

**Request Body:**

| Field    | Type   | Required | Rules              |
|----------|--------|----------|--------------------|
| email    | string | ✅       | Email terdaftar    |
| password | string | ✅       | Password yang benar|

**Request Example:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Success — `200 OK`:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response Error:**

| Status | Condition                    | Response Body                              |
|--------|------------------------------|--------------------------------------------|
| 400    | Field kosong                 | `{ "error": "Email and password are required" }` |
| 401    | Email tidak ditemukan        | `{ "error": "Invalid email or password" }` |
| 401    | Password salah               | `{ "error": "Invalid email or password" }` |
| 500    | Server error                 | `{ "error": "Internal server error" }`     |

---

### 3. GET `/api/auth/me`

Mendapatkan informasi user yang sedang login.

**Auth Required:** ✅ Ya

**Request Body:** Tidak ada

**Response Success — `200 OK`:**

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2026-02-15T09:30:00.000Z"
  }
}
```

**Response Error:**

| Status | Condition         | Response Body                          |
|--------|-------------------|----------------------------------------|
| 401    | Token missing/invalid | `{ "error": "Unauthorized" }`      |
| 404    | User tidak ada    | `{ "error": "User not found" }`       |

---

### 4. GET `/api/products`

Mendapatkan daftar produk dengan fitur search, filter, pagination, dan sorting.

**Auth Required:** ✅ Ya

**Query Parameters:**

| Param    | Type    | Default      | Description                                      |
|----------|---------|--------------|--------------------------------------------------|
| search   | string  | _(kosong)_   | Cari berdasarkan nama atau deskripsi (case insensitive) |
| category | integer | _(kosong)_   | Filter berdasarkan category_id                   |
| page     | integer | 1            | Halaman ke-berapa                                |
| limit    | integer | 10           | Jumlah item per halaman                          |
| sort     | string  | created_at   | Kolom untuk sorting: `name`, `price`, `stock`, `created_at`, `updated_at` |
| order    | string  | desc         | Urutan: `asc` atau `desc`                        |

**Request Example:**

```
GET /api/products?search=mouse&category=1&page=1&limit=5&sort=price&order=asc
```

**Response Success — `200 OK`:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse with USB receiver",
      "price": "29.99",
      "stock": 150,
      "category_id": 1,
      "created_by": 1,
      "created_at": "2026-02-15T09:30:00.000Z",
      "updated_at": "2026-02-15T09:30:00.000Z",
      "category_name": "Electronics",
      "creator_name": "Admin User"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

**Response Error:**

| Status | Condition             | Response Body                      |
|--------|-----------------------|------------------------------------|
| 401    | Token missing/invalid | `{ "error": "Unauthorized" }`      |

---

### 5. GET `/api/products/:id`

Mendapatkan detail satu produk berdasarkan ID.

**Auth Required:** ✅ Ya

**Path Parameter:**

| Param | Type    | Description     |
|-------|---------|-----------------|
| id    | integer | ID produk       |

**Request Example:**

```
GET /api/products/1
```

**Response Success — `200 OK`:**

```json
{
  "product": {
    "id": 1,
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": "29.99",
    "stock": 150,
    "category_id": 1,
    "created_by": 1,
    "created_at": "2026-02-15T09:30:00.000Z",
    "updated_at": "2026-02-15T09:30:00.000Z",
    "category_name": "Electronics",
    "creator_name": "Admin User"
  }
}
```

**Response Error:**

| Status | Condition             | Response Body                      |
|--------|-----------------------|------------------------------------|
| 401    | Token missing/invalid | `{ "error": "Unauthorized" }`      |
| 404    | Produk tidak ada      | `{ "error": "Product not found" }` |

---

### 6. POST `/api/products`

Membuat produk baru.

**Auth Required:** ✅ Ya

**Request Body:**

| Field       | Type    | Required | Rules                           |
|-------------|---------|----------|---------------------------------|
| name        | string  | ✅       | Tidak boleh kosong              |
| description | string  | ❌       | Opsional                        |
| price       | number  | ✅       | Harus angka positif (≥ 0)       |
| stock       | integer | ❌       | Harus angka non-negatif, default: 0 |
| category_id | integer | ❌       | ID kategori yang valid          |

**Request Example:**

```json
{
  "name": "Bluetooth Speaker",
  "description": "Portable wireless speaker",
  "price": 45.99,
  "stock": 200,
  "category_id": 1
}
```

**Response Success — `201 Created`:**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 11,
    "name": "Bluetooth Speaker",
    "description": "Portable wireless speaker",
    "price": "45.99",
    "stock": 200,
    "category_id": 1,
    "created_by": 1,
    "created_at": "2026-02-16T08:00:00.000Z",
    "updated_at": "2026-02-16T08:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Condition                      | Response Body                                      |
|--------|--------------------------------|----------------------------------------------------|
| 400    | Name atau price kosong         | `{ "error": "Name and price are required" }`       |
| 400    | Price bukan angka/negatif      | `{ "error": "Price must be a positive number" }`   |
| 400    | Stock negatif                  | `{ "error": "Stock must be a non-negative number" }` |
| 401    | Token missing/invalid          | `{ "error": "Unauthorized" }`                      |

---

### 7. PUT `/api/products/:id`

Mengupdate produk yang sudah ada.

**Auth Required:** ✅ Ya

**Path Parameter:**

| Param | Type    | Description     |
|-------|---------|-----------------|
| id    | integer | ID produk       |

**Request Body:** (sama seperti POST)

| Field       | Type    | Required | Rules                           |
|-------------|---------|----------|---------------------------------|
| name        | string  | ✅       | Tidak boleh kosong              |
| description | string  | ❌       | Opsional                        |
| price       | number  | ✅       | Harus angka positif (≥ 0)       |
| stock       | integer | ❌       | Harus angka non-negatif         |
| category_id | integer | ❌       | ID kategori yang valid          |

**Request Example:**

```
PUT /api/products/1
```

```json
{
  "name": "Wireless Mouse Pro",
  "description": "Updated ergonomic wireless mouse",
  "price": 39.99,
  "stock": 120,
  "category_id": 1
}
```

**Response Success — `200 OK`:**

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "name": "Wireless Mouse Pro",
    "description": "Updated ergonomic wireless mouse",
    "price": "39.99",
    "stock": 120,
    "category_id": 1,
    "created_by": 1,
    "created_at": "2026-02-15T09:30:00.000Z",
    "updated_at": "2026-02-16T08:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Condition                      | Response Body                                      |
|--------|--------------------------------|----------------------------------------------------|
| 400    | Name atau price kosong         | `{ "error": "Name and price are required" }`       |
| 400    | Price bukan angka/negatif      | `{ "error": "Price must be a positive number" }`   |
| 400    | Stock negatif                  | `{ "error": "Stock must be a non-negative number" }` |
| 401    | Token missing/invalid          | `{ "error": "Unauthorized" }`                      |
| 404    | Produk tidak ditemukan         | `{ "error": "Product not found" }`                 |

---

### 8. DELETE `/api/products/:id`

Menghapus produk berdasarkan ID.

**Auth Required:** ✅ Ya

**Path Parameter:**

| Param | Type    | Description     |
|-------|---------|-----------------|
| id    | integer | ID produk       |

**Request Example:**

```
DELETE /api/products/1
```

**Response Success — `200 OK`:**

```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": 1,
    "name": "Wireless Mouse"
  }
}
```

**Response Error:**

| Status | Condition             | Response Body                      |
|--------|-----------------------|------------------------------------|
| 401    | Token missing/invalid | `{ "error": "Unauthorized" }`      |
| 404    | Produk tidak ada      | `{ "error": "Product not found" }` |

---

### 9. GET `/api/categories`

Mendapatkan daftar semua kategori beserta jumlah produk di masing-masing kategori.

**Auth Required:** ✅ Ya

**Request Example:**

```
GET /api/categories
```

**Response Success — `200 OK`:**

```json
{
  "categories": [
    { "id": 4, "name": "Books", "description": "Physical and digital books", "product_count": 2 },
    { "id": 2, "name": "Clothing", "description": "Apparel and fashion items", "product_count": 2 },
    { "id": 1, "name": "Electronics", "description": "Electronic devices and gadgets", "product_count": 3 },
    { "id": 3, "name": "Food & Beverages", "description": "Food products and drinks", "product_count": 2 },
    { "id": 5, "name": "Home & Garden", "description": "Home improvement and garden supplies", "product_count": 1 }
  ]
}
```

**Response Error:**

| Status | Condition             | Response Body                 |
|--------|-----------------------|-------------------------------|
| 401    | Token missing/invalid | `{ "error": "Unauthorized" }` |

---

### 10. POST `/api/categories`

Membuat kategori baru.

**Auth Required:** ✅ Ya

**Request Body:**

| Field       | Type   | Required | Rules                            |
|-------------|--------|----------|----------------------------------|
| name        | string | ✅       | Tidak boleh kosong, harus unik   |
| description | string | ❌       | Opsional                         |

**Request Example:**

```json
{
  "name": "Sports",
  "description": "Sports equipment and accessories"
}
```

**Response Success — `201 Created`:**

```json
{
  "message": "Category created successfully",
  "category": {
    "id": 6,
    "name": "Sports",
    "description": "Sports equipment and accessories"
  }
}
```

**Response Error:**

| Status | Condition              | Response Body                                 |
|--------|------------------------|-----------------------------------------------|
| 400    | Name kosong            | `{ "error": "Category name is required" }`    |
| 401    | Token missing/invalid  | `{ "error": "Unauthorized" }`                 |
| 409    | Nama kategori duplikat | `{ "error": "Category already exists" }`      |

---

## 🗄️ Database Info

### Seed Users (untuk testing)

| Email                | Password      | Role  |
|----------------------|---------------|-------|
| admin@example.com    | password123   | admin |
| user@example.com     | password123   | user  |

### Seed Categories

| ID | Name             |
|----|------------------|
| 1  | Electronics      |
| 2  | Clothing         |
| 3  | Food & Beverages |
| 4  | Books            |
| 5  | Home & Garden    |

### Seed Products (10 items)

| ID | Name                | Price  | Stock | Category    |
|----|---------------------|--------|-------|-------------|
| 1  | Wireless Mouse      | 29.99  | 150   | Electronics |
| 2  | Mechanical Keyboard | 89.99  | 75    | Electronics |
| 3  | USB-C Hub           | 49.99  | 200   | Electronics |
| 4  | Cotton T-Shirt      | 19.99  | 500   | Clothing    |
| 5  | Denim Jacket        | 59.99  | 120   | Clothing    |
| 6  | Green Tea Pack      | 12.99  | 300   | Food & Bev  |
| 7  | Dark Chocolate Bar  | 4.99   | 450   | Food & Bev  |
| 8  | JavaScript Guide    | 39.99  | 80    | Books       |
| 9  | Design Patterns     | 44.99  | 60    | Books       |
| 10 | LED Desk Lamp       | 34.99  | 180   | Home&Garden |

---

## 📝 HTTP Status Codes Reference

| Code | Meaning               | Kapan Muncul                                   |
|------|-----------------------|------------------------------------------------|
| 200  | OK                    | Request berhasil (GET, PUT, DELETE)             |
| 201  | Created               | Resource baru berhasil dibuat (POST)           |
| 400  | Bad Request           | Input tidak valid / field required kosong       |
| 401  | Unauthorized          | Token tidak ada, expired, atau invalid         |
| 404  | Not Found             | Resource (product/user) tidak ditemukan         |
| 409  | Conflict              | Data duplikat (email/category sudah ada)       |
| 500  | Internal Server Error | Error di server / database                     |
