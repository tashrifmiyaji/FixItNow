# FixItNow Backend

## Project Overview

FixItNow is a home service marketplace backend built with Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT authentication, and Stripe payment integration.

This repository contains API endpoints for:
- User registration and login
- Role-based access for Customer, Technician, and Admin
- Service and category management
- Booking creation and status management
- Stripe payment session creation and confirmation
- Reviews for completed bookings

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Create `.env` with these values:

```env
PORT=5000
DATABASE_URL=your_postgres_url
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
```

3. Run the server

```bash
npm run dev
```

4. API base URL

```text
http://localhost:5000/api
```

## Postman Collection

Import the file `FixItNow.postman_collection.json` into Postman to create the full API collection.

## Authentication

### Register
`POST /api/auth/register`

Body example:

```json
{
  "name": "tashrif",
  "email": "tashrif@gmail.com",
  "password": "password123",
  "phone": "01712345678",
  "role": "CUSTOMER"
}
```

### Login
`POST /api/auth/login`

Body example:

```json
{
  "email": "tashrif@gmail.com",
  "password": "password123"
}
```

### Refresh Token
`POST /api/auth/refresh-token`

Uses the cookie `refreshToken` set by login.

### Get Current User
`GET /api/auth/me`

Requires header:

```http
Authorization: Bearer {{accessToken}} and cookies
```

## User Endpoints

### Get My Profile
`GET /api/users/me`

### Update My Profile
`PATCH /api/users/me`

Body example:

```json
{
  "name": "Tashrif Miaji",
  "phone": "01712345678"
}
```

### Admin: Get All Users
`GET /api/admin/users`

Requires admin role.

## Category Endpoints

### Get All Categories
`GET /api/category`

### Get Category by ID
`GET /api/category/:id`

### Create Category
`POST /api/category`

Body example:

```json
{
  "name": "Plumbing",
  "description": "Home plumbing and pipe repair services"
}
```

### Update Category
`PATCH /api/category/:id`

Body example:

```json
{
  "name": "Electrical",
  "description": "Electrical wiring and repair services"
}
```

### Delete Category
`DELETE /api/category/:id`

Requires admin role.

## Service Endpoints

### Get All Services
`GET /api/service`

### Get Service by ID
`GET /api/service/:id`

### Create Service (Technician only)
`POST /api/service`

Body example:

```json
{
  "title": "House Wiring",
  "description": "Full house wiring and electrical maintenance",
  "price": 2500,
  "categoryId": "<category-id>"
}
```

### Update Service (Technician only)
`PATCH /api/service/:id`

Body example:

```json
{
  "price": 3000
}
```

### Delete Service (Technician only)
`DELETE /api/service/:id`

## Technician Endpoints

### Get All Technicians
`GET /api/technician`

### Get Technician by ID
`GET /api/technician/:id`

### Create Technician Profile
`POST /api/technician/profile`

Body example:

```json
{
  "bio": "Experienced electrician and handyman.",
  "experience": 4,
  "location": "Dhaka"
}
```

### Update Technician Profile
`PUT /api/technician/profile`

Body example:

```json
{
  "bio": "Experienced electrician and handyman with 5 years of work.",
  "experience": 5
}
```

## Booking Endpoints

### Create Booking
`POST /api/booking`

Body example:

```json
{
  "serviceId": "<service-id>",
  "bookingDate": "2026-08-10T10:00:00.000Z"
}
```

### Get My Bookings
`GET /api/booking`

### Get Booking by ID
`GET /api/booking/:id`

### Update Booking Status (Technician only)
`PATCH /api/booking/:id`

Body example:

```json
{
  "status": "ACCEPTED"
}
```

## Payment Endpoints

### Create Payment Session
`POST /api/payment/create`

Body example:

```json
{
  "bookingId": "<booking-id>"
}
```

### Confirm Payment
`POST /api/payment/confirm`

Body example:

```json
{
  "sessionId": "<stripe-session-id>"
}
```

### Get My Payments
`GET /api/payment`

### Get Payment by ID
`GET /api/payment/:id`

## Review Endpoints

### Get All Reviews
`GET /api/review`

### Create Review
`POST /api/review`

Body example:

```json
{
  "bookingId": "<booking-id>",
  "rating": 5,
  "comment": "Excellent job, very professional."
}
```

### Update Review
`PATCH /api/review/:id`

Body example:

```json
{
  "rating": 4,
  "comment": "Work was good, but arrival was slightly delayed."
}
```

## Admin Endpoints

### Get All Bookings
`GET /api/admin/bookings`

### Update User Status
`PATCH /api/admin/users/:id`

Body example:

```json
{
  "status": "BANNED"
}
```

## Error Response Format

All errors return structured JSON:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorDetails": [
    {
      "path": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

## Notes

- Use `Authorization: Bearer <token>` header for protected routes.
- Stripe webhook endpoint is available at `POST /api/payments/webhook/stripe`.
- Register any user role using `/api/auth/register`, including `ADMIN`, `CUSTOMER`, and `TECHNICIAN`.
