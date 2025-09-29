# Customer Management Web

A full-stack web application for managing customers and their addresses, built with Angular, Node.js, and CockroachDB.

## Features

- Create, Read, Update, Delete (CRUD) customers.
- Add multiple addresses for each customer.
- Filter customers by city, state, or pincode (case-insensitive).
- Pagination support.
- Responsive web interface.

## Tech Stack

### Frontend

- **Framework:** Angular 16
- **Language:** TypeScript
- **Styling:** CSS
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router
- **Forms:** Angular Reactive Forms

### Backend

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Database:** CockroachDB
- **Database Driver:** `pg` (PostgreSQL driver)
- **UUID Generation:** `uuid`
- **Middleware:** Express JSON parser, custom error handler

### Database

- **CockroachDB** (compatible with PostgreSQL)
- Tables: `customers`, `addresses`

### Project Structure

customer-management-web/
├── backend/
│ ├── controllers/ # Customer and Address controllers
│ ├── db.js # DB connection
│ ├── middlewares/ # Error handling middleware
│ ├── routes/ # API routes
│ └── migrations/ # Database schema
├── frontend/
│ ├── src/app/
│ │ ├── components/ # Customer form and list components
│ │ └── services/ # Customer and Address services
│ └── angular.json # Angular config
├── package.json # Node.js dependencies
└── README.md


## Setup

### Backend

1. Install dependencies:
   cd backend
   npm install
2. Configure db.js with your CockroachDB connection string.

3. Run migrations to create tables.

4. Start server: npm run dev

Frontend

1. Install dependencies:
   cd frontend
   npm install
2. Start Angular development server: ng serve
3. Access the app at http://localhost:4200

Environment:

Backend: http://localhost:4000/api/customers

Frontend: http://localhost:4200

Notes:

CRUD operations reflect immediately in CockroachDB.

Search filters (city, state, pincode) are case-insensitive.

Pagination defaults to 20 records per page.
