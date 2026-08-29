# NOVA — Digital Restaurant Menu

A full-stack Ethiopian restaurant menu application. Customers can browse the available dishes selected for today, while administrators can manage the restaurant's complete menu and curate the daily menu.

## Features

### Customer website

- Browse today's available menu without an account.
- Filter dishes by category.
- View each dish's image, description, category, and price in ETB.
- Responsive design for desktop, tablet, and mobile.
- Helpful loading, empty-menu, image fallback, and retryable error states.

### Admin dashboard

- Secure admin signup and login using an HTTP-only JWT cookie.
- Protected dashboard, menu-management, and daily-menu screens.
- Create, edit, delete, and toggle availability for reusable menu items.
- Create today's daily menu automatically when an admin opens the page.
- Add existing menu items to today's menu.
- Remove a dish from today's menu without deleting it from the main collection.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS, Fetch API |
| Backend | Node.js, Express, Zod |
| Database | PostgreSQL / Neon, Prisma ORM |
| Authentication | bcryptjs, JSON Web Tokens, HTTP-only cookies |

## Project structure

```text
Digital-restaurant-menu/
├── backend/
│   ├── prisma/                 # Prisma schema and migrations
│   ├── src/
│   │   ├── controllers/        # Auth, menu, and daily-menu logic
│   │   ├── middlewares/        # JWT and validation middleware
│   │   ├── routes/             # Public and protected API routes
│   │   └── validators/         # Zod request schemas
│   └── app.js
├── frontend/
│   └── src/
│       ├── components/         # Customer and admin UI components
│       ├── context/            # Client-side admin session state
│       ├── pages/              # Home and admin pages
│       ├── routes/             # Protected route wrapper
│       └── services/           # Fetch API helpers
└── README.md
```

## Getting started

### Prerequisites

- Node.js 18 or later
- PostgreSQL database, such as a Neon database

### 1. Configure the backend

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
NODE_ENV="development"
```

Install dependencies and apply the database schema:

```powershell
cd backend
npm install
npx prisma migrate deploy
node app.js
```

The backend runs on `http://localhost:5000` by default.

### 2. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Routes

### Frontend

| Route | Purpose |
| --- | --- |
| `/` | Customer-facing restaurant website |
| `/admin/login` | Admin sign-in |
| `/admin/signup` | Private admin account setup page |
| `/admin/dashboard` | Admin overview |
| `/admin/menu-items` | Manage all reusable menu items |
| `/admin/today-menu` | Curate today's menu |

The signup route is deliberately not linked from the customer website. In a production deployment, signup should also be restricted on the backend with an invite or approval flow.

### API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/admin/signup` | Create an admin account |
| `POST` | `/api/admin/login` | Log in and receive a JWT cookie |
| `GET` | `/api/admin/menu-items` | Get all menu items |
| `POST` | `/api/admin/menu-items` | Create a menu item |
| `PATCH` | `/api/admin/menu-items/:id` | Update a menu item or availability |
| `DELETE` | `/api/admin/menu-items/:id` | Delete a menu item |
| `POST` | `/api/admin/daily-menu` | Create today's menu if it does not exist |
| `POST` | `/api/admin/daily-menu/items` | Add an existing item to today's menu |
| `DELETE` | `/api/admin/daily-menu/items/:id` | Remove an item from today's menu |
| `GET` | `/api/menu/today` | Get today's customer-facing menu |

## Authentication

On signup or login, the backend sends a JWT as an HTTP-only `jwt` cookie. The token is not stored in localStorage. The frontend sends the cookie with protected requests through `credentials: "include"`.

## Quality checks

From `frontend/`:

```powershell
npm run lint
npm run build
```

## Notes

- A main `Menu` item is reusable. A `DailyMenu` is the subset being served today.
- Disabling availability hides a dish from the customer website, even when it remains selected for the daily menu.
- The backend CORS configuration expects the Vite frontend at `http://localhost:5173` during local development.
