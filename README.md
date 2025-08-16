Samadhan Food Court - Admin Panel
📝 Overview
This is the official admin panel for the Samadhan Food Court. It is an internal, secure web application designed for administrators to manage the restaurant's operations. This dashboard provides full control over menu items and allows for real-time monitoring of customer orders.

This project is a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and is secured using Firebase Authentication for role-based access control.

🛠️ Tech Stack
Frontend: React.js, React Router, Axios

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: Firebase Authentication (Email/Password & Google OAuth)

🚀 Getting Started
Prerequisites
Node.js (v14 or later)

npm

MongoDB (or a MongoDB Atlas account)

A Firebase project




samadhan-food-court-admin/
├── .gitignore
├── README.md
│
├── client/            # Admin Dashboard Frontend (React.js)
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── api/             # Functions for making authenticated API calls
│   │   │   ├── menuApi.js   # (create, read, update, delete menu items)
│   │   │   └── orderApi.js  # (read, update orders)
│   │   │
│   │   ├── assets/          # CSS, images, fonts
│   │   │
│   │   ├── components/      # Reusable UI components for the dashboard
│   │   │   ├── admin/       # Components specific to admin tasks
│   │   │   │   ├── MenuItemForm.js
│   │   │   │   ├── MenuItemsTable.js
│   │   │   │   ├── OrdersTable.js
│   │   │   │   └── StatCard.js      # For dashboard stats (e.g., total orders)
│   │   │   │
│   │   │   ├── common/      # Generic components (Button, Modal, Spinner)
│   │   │   └── layout/      # Structural components (Navbar, Sidebar, Footer)
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js # Manages admin's authentication state
│   │   │
│   │   ├── firebase/
│   │   │   └── config.js    # Firebase initialization
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js   # Custom hook to access auth context
│   │   │
│   │   ├── pages/           # Main pages for the admin dashboard
│   │   │   ├── DashboardPage.js     # Main overview page with stats
│   │   │   ├── LoginPage.js         # Admin login page
│   │   │   ├── MenuManagementPage.js  # Page to manage menu items
│   │   │   └── OrderManagementPage.js # Page to view and manage orders
│   │   │
│   │   ├── routing/
│   │   │   └── ProtectedRoute.js  # Prevents access to dashboard if not logged in
│   │   │
│   │   ├── App.js           # Main app component with routing
│   │   └── index.js         # Entry point
│   │
│   ├── .env
│   └── package.json
│
└── server/            # Protected Backend API (Node.js)
    ├── config/
    │   └── db.js
    │
    ├── controllers/       # Logic for CRUD operations
    │   ├── menuController.js
    │   └── orderController.js
    │
    ├── middleware/
    │   ├── authMiddleware.js  # Verifies Firebase token AND checks for 'admin' role
    │   └── errorMiddleware.js
    │
    ├── models/
    │   ├── User.js        # Mongoose schema with a 'role' field (e.g., role: 'admin')
    │   ├── MenuItem.js
    │   └── Order.js
    │
    ├── routes/            # All routes will be protected by authMiddleware
    │   ├── menuRoutes.js    # Defines CRUD endpoints for menu items
    │   └── orderRoutes.js   # Defines CRUD endpoints for orders
    │
    ├── .env
    ├── server.js
    └── package.json
