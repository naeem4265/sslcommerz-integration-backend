# Alumni Get Together Backend

Backend service for the Alumni Get Together registration system built with NestJS, TypeORM, and SSLCommerz for payment integration.

---

## 🔐 Security

**IMPORTANT:** This project uses **JWT authentication**, **admin secret keys**, and **payment gateway credentials**. These should **never be committed** into version control.

### 1. Setup Environment Variables

1. Copy `.env.example` → `.env`
2. Update the `.env` file with **secure values**:

```bash
# Generate a secure JWT or admin key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Features

- Alumni registration with department, batch, designation, etc.
- Integrated payment workflow via **SSLCommerz**
- Admin dashboard with statistics and paginated records
- RESTful API with complete Swagger docs
- Payment status callback handling from SSLCommerz

---

## ⚙️ Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL or MongoDB (depending on setup)
- npm or yarn
- SSLCommerz sandbox credentials

---

## 📦 Installation

```bash
git clone git@naeem4265:naeem4265/sslcommerz-integration-backend.git
cd sslcommerz-integration-backend
npm install
```

---

## 🛠️ Environment Config Example

```env
PORT=3000

# JWT
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=your_admin_secret

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=alumni

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
SSLCOMMERZ_SUCCESS_URL=https://yourdomain.com/api/v1/payment/success
SSLCOMMERZ_FAIL_URL=https://yourdomain.com/api/v1/payment/fail
SSLCOMMERZ_CANCEL_URL=https://yourdomain.com/api/v1/payment/cancel
```

---

## ▶️ Running the App

```bash
npm run start:dev
```

Visit: [http://localhost:3000/api/v1/swagger](http://localhost:3000/api/v1/swagger)

---

## 📚 API Endpoints

### 🔵 Registration

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/registration`              | Create a new registration          |
| GET    | `/registration`              | List all registrations (admin)     |
| GET    | `/registration/:id`          | Get a single registration          |
| POST   | `/registration/:id/payment`  | Update payment status manually     |

### 🟢 Payment

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| POST   | `/payment/initiate`       | Starts a payment via SSLCommerz             |
| POST   | `/payment/verify`         | Called internally to verify a payment        |
| GET    | `/payment/success`        | SSLCommerz success redirect callback (GET)   |
| POST   | `/payment/success`        | SSLCommerz success form callback (POST)      |
| POST   | `/payment/ipn`            | IPN verification from SSLCommerz             |

---

## 🧪 Migrations

```bash
# generate migration
npm run migration:generate src/migrations/MigrationName

# run migrations
npm run migration:run

# revert last migration
npm run migration:revert
```

---

## 🧾 License

This project is licensed under the **MIT License**.