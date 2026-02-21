# GoRestro - Food Delivery System

A complete food delivery platform built with React, Node.js, and MongoDB.

## 🚀 Features

### Customer Features
- 🍕 Browse food items by category
- 🛒 Add items to cart with quantity management
- 👤 User authentication (signup/login)
- 📦 Order placement and tracking
- 💳 Payment integration ready
- 📱 Responsive design

### Admin Features
- ➕ Add/Manage food items
- 📋 View all food inventory
- 📦 Order management system
- 📊 Order status tracking
- 🔐 Admin-only access control
- 🖼️ Image upload for food items

## 🛠️ Tech Stack

### Frontend (Customer)
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- React Toastify

### Frontend (Admin)
- React 18
- Vite
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer (file upload)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file in backend directory:
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=4000
```

### 3. Database Setup
Run the setup script to create admin user and sample data:
```bash
node setupDatabase.js
```

### 4. Start Backend
```bash
npm start
```

### 5. Frontend Setup (Customer App)
```bash
cd frontend
npm install
npm run dev
```

### 6. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

## 🔑 Default Admin Credentials

- **Email:** wizard7@gmail.com
- **Password:** wizGoFood2004

## 📱 Access URLs

- **Customer App:** http://localhost:5173
- **Admin Panel:** http://localhost:5174
- **Backend API:** http://localhost:4000

## 📁 Project Structure

```
Food-Delivery/
├── backend/                 # Node.js API server
│   ├── controllers/         # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── uploads/            # File upload directory
├── frontend/               # Customer React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Images and assets
│   │   └── context/        # React context
├── admin/                  # Admin React app
│   ├── src/
│   │   ├── components/     # Admin components
│   │   ├── pages/          # Admin pages
│   │   └── assets/         # Admin assets
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/user/register` - User signup
- `POST /api/user/login` - User login

### Food Management
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add new food item (admin only)
- `POST /api/food/remove` - Remove food item (admin only)

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get cart items

### Orders
- `POST /api/order/place` - Place new order
- `GET /api/order/list` - Get all orders (admin only)
- `POST /api/order/status` - Update order status (admin only)

## 🔧 Configuration

### Port Settings
- Backend: 4000
- Frontend: 5173
- Admin: 5174

### Database
The system uses MongoDB with the following collections:
- `users` - User accounts and authentication
- `foods` - Food items and inventory
- `orders` - Customer orders

## 🎨 Customization

### Logo
Replace `newlogo.png` in:
- `frontend/src/assets/frontend_assets/`
- `admin/src/assets/`

### Colors & Styling
Modify CSS files in respective component directories.

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Build and deploy to your preferred platform
3. Update frontend URLs to point to deployed backend

### Frontend Deployment
1. Build the React apps
2. Deploy to static hosting services
3. Ensure API URLs are correctly configured

## 📄 License

This project is a standalone food delivery system. All rights reserved.

## 🤝 Support

For technical support or questions, please refer to the documentation or contact the development team.

---

**Note:** This is a standalone project with no external dependencies or GitHub connections.
