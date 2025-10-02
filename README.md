# Teabuff

> **A modern, responsive e-commerce web app for tea lovers** — browse blends, place orders, manage products, and enjoy a cozy shopping experience.

---

## Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Environment Variables](#environment-variables)
  * [Run Locally](#run-locally)
* [Available Scripts](#available-scripts)
* [Deployment](#deployment)
* [Testing](#testing)
* [Contributing](#contributing)
* [Troubleshooting & Tips](#troubleshooting--tips)
* [License](#license)
* [Contact](#contact)

---

## Demo

Add your demo link, screenshots, or GIFs here once available.

---

## Features

* Product catalog with categories and filters
* Product detail pages with images, price, and descriptions
* Cart and checkout flow (mock or real payment integration)
* User authentication (signup / login / profile)
* Admin panel to manage products, orders, and users
* Responsive design that works on mobile and desktop
* Search and sort functionality
* Email/notification integration for order status (optional)

---

## Tech Stack

**Frontend:** React (Vite / Create React App), React Router, Tailwind / Bootstrap (optional)

**Backend:** Node.js, Express

**Database:** MongoDB (Atlas or local)

**Auth:** JWT or session-based

**Storage / CDN:** Cloudinary / S3 for product images

**Deployment:** Vercel / Netlify for frontend, Heroku / Render / DigitalOcean App for backend

---

## Folder Structure

Example (adjust to your project):

```
/teabuff
  /frontend
    /public
    /src
      /components
      /pages
      /services
      /styles
      App.jsx
      index.jsx
  /backend
    /config
    /controllers
    /models
    /routes
    server.js
  README.md
  .env.example
```

---

## Getting Started

These instructions will get Teabuff running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB instance (local or Atlas)

### Installation

Clone the repo:

```bash
git clone <your-repo-url>
cd teabuff
```

Install frontend and backend dependencies:

```bash
# from project root
cd frontend
npm install

# in a separate terminal
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` folder (and optionally in `frontend` for runtime config). Example variables:

**backend/.env**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_HOST=smtp.example.com
EMAIL_USER=...
EMAIL_PASS=...
```

**frontend/.env** (if needed)

```
VITE_API_URL=http://localhost:5000/api
REACT_APP_API_URL=http://localhost:5000/api
```

> Keep secrets out of version control. Use `.env.example` with placeholder values.

### Run Locally

Start the backend:

```bash
cd backend
npm run dev
# or
node server.js
```

Start the frontend:

```bash
cd frontend
npm run dev
# or
npm start
```

Open your browser at `http://localhost:3000` or the port shown by your frontend dev server.

---

## Available Scripts

From the **frontend** folder:

* `npm run dev` / `npm start` — start dev server
* `npm run build` — build production bundle
* `npm test` — run frontend tests (if configured)

From the **backend** folder:

* `npm run dev` — start server with nodemon
* `npm start` — start server
* `npm test` — run backend tests (if configured)

---

## Deployment

1. Build the frontend: `npm run build` in `/frontend`.
2. Serve static files from the backend (optional) or host frontend separately on Vercel/Netlify.
3. Set environment variables in your hosting provider.
4. Connect your production MongoDB database.

---

## Testing

* Add unit and integration tests where appropriate (Jest, React Testing Library, Supertest).
* Describe test instructions here if you've added test suites.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add ..."`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request describing your changes

Please keep commit messages clear and run linters/tests before submitting.

---

## Troubleshooting & Tips

* If you get CORS errors, ensure backend CORS is enabled for your frontend origin.
* If images don't upload, check your Cloudinary/AWS credentials.
* For auth issues, verify `JWT_SECRET` and token expiration settings.
* Use `POSTMAN` to test API endpoints during development.

---

## Contact

Project maintained by: **Balaji007k**

Found a bug or want a feature? Open an issue on the repo.

---

*Happy brewing ☕ — Teabuff*
