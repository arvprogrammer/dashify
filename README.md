# Dashify – Demo SaaS Dashboard

**Dashify** is a demo **SaaS dashboard application** built to showcase full-stack **TypeScript** development skills using **Next.js (App Router)** and **NestJS**.  
It is designed as a **modular monolith**, with a clean architecture that can evolve into microservices if needed.

---


## Notes

⚠️ The live demo is hosted on free-tier platforms.  
The first request may take **10–20 seconds** while the backend server wakes up.

---

## Screenshots / Live Demo

- **Live Demo:** https://dashify-demo.vercel.app
- Screenshots include:
  - Authentication pages
  - Dashboard overview
  - Tables & CRUD flows

---

## Demo Accounts

```
Admin User
Email: admin@dashify.demo
Password: Admin123!

Normal User
Email: user@dashify.demo
Password: User123!
```

---

## Features

### Backend (NestJS)
- Authentication & role-based access (Admin / User)
- JWT-based login & registration
- Modular architecture with clean folder structure
- Prisma + PostgreSQL database
- RESTful APIs (GraphQL-ready)
- Database migrations & seeding
- Role-based authorization that can be extended to protect admin-only features
- Ready for deployment on free-tier platforms (Render / Railway)

### Frontend (Next.js)
- Responsive dashboard UI using **Tailwind CSS** and **shadcn/ui**
- Login / Register pages with demo accounts
- Tables, CRUD forms, and simple analytics
- Modular and scalable component structure
- Optional Dark / Light mode support

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL
- **Deployment:** Vercel (Frontend), Render / Railway (Backend)

---

## Setup Instructions

### 1. Backend
```bash
cd backend
yarn install
yarn prisma:migrate
yarn prisma:seed
yarn start:dev
```

The API will be available at:
```
http://localhost:4000
```

---

### 2. Frontend
```bash
cd frontend
yarn install
yarn dev
```

The web app will be available at:
```
http://localhost:3000
```

---

## Testing & Architecture Notes

- Basic unit tests are included to demonstrate testability and code quality.
- The application follows a modular monolith architecture and can be refactored into microservices as the system scales.

---

## License

MIT License © 2026 Alireza (arv.programmer@gmail.com)
