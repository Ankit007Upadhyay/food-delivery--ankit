# 🚀 GoRestro Standalone - Quick Setup Guide

## 📋 What You Have

✅ **Complete standalone food delivery system**  
✅ **No GitHub connections or dependencies**  
✅ **All assets, code, and configurations included**  
✅ **Ready to run locally**  

## 🎯 Project Location
```
C:\Users\ankit\OneDrive\Desktop\GoRestro-Standalone\
```

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd "C:\Users\ankit\OneDrive\Desktop\GoRestro-Standalone"
npm run install:all
```

### Step 2: Setup Database
```bash
npm run setup
```

### Step 3: Start All Services
```bash
npm run dev
```

## 🔑 Access Your System

- **Customer App:** http://localhost:5173
- **Admin Panel:** http://localhost:5174  
- **Backend API:** http://localhost:4000

**Admin Login:**
- Email: `wizard7@gmail.com`
- Password: `wizGoFood2004`

## 📁 Complete Project Structure

```
GoRestro-Standalone/
├── Food-Delivery/
│   ├── backend/                 # Node.js API + MongoDB
│   │   ├── controllers/         # User, Food, Order logic
│   │   ├── models/             # Database schemas
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth middleware
│   │   ├── config/             # DB connection
│   │   ├── uploads/            # Image storage
│   │   ├── .env                # Environment variables
│   │   └── package.json        # Backend dependencies
│   ├── frontend/               # Customer React App
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Home, Cart, Orders
│   │   │   ├── assets/         # Images, logos
│   │   │   └── context/        # State management
│   │   └── package.json        # Frontend dependencies
│   └── admin/                  # Admin React App
│       ├── src/
│       │   ├── components/     # Admin components
│       │   ├── pages/          # Add, List, Orders
│       │   └── assets/         # Admin assets
│       └── package.json        # Admin dependencies
├── README.md                   # Detailed documentation
└── package.json                # Root scripts
```

## 🛠️ What's Included

### Backend Dependencies
- express, mongoose, cors, dotenv
- jsonwebtoken, bcryptjs
- multer, validator

### Frontend Dependencies  
- react, react-dom, react-router-dom
- vite, tailwindcss
- axios, react-toastify

### Assets Included
- All food images (32 items)
- Logo files (logo.png, newlogo.png)
- Icons and UI elements
- Complete image library

## 🔧 Manual Setup (if needed)

### Backend
```bash
cd backend
npm install
# Create .env file with MONGO_URL, JWT_SECRET, PORT
node setupDatabase.js
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin
```bash
cd admin
npm install  
npm run dev
```

## ✅ Features Ready

### Customer Features
- ✅ Browse food by category
- ✅ Add to cart functionality
- ✅ User signup/login
- ✅ Order placement
- ✅ Order tracking
- ✅ Responsive design

### Admin Features
- ✅ Add/remove food items
- ✅ Manage inventory
- ✅ View all orders
- ✅ Update order status
- ✅ Image upload
- ✅ Role-based access

## 🎨 Customization

### Change Logo
Replace `newlogo.png` in:
- `frontend/src/assets/frontend_assets/`
- `admin/src/assets/`

### Modify Colors
Edit CSS files in component directories.

### Add Food Categories
Update options in admin Add page component.

## 🚀 Deployment Ready

This standalone project can be deployed to:
- Vercel, Netlify (frontend)
- Heroku, DigitalOcean (backend)
- MongoDB Atlas (database)

## 📞 Support

All documentation is included in the project. No external dependencies required.

---

**🎉 Your standalone GoRestro system is ready!**
