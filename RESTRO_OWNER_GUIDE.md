# Restaurant Owner Portal Guide

## Overview
The Restaurant Owner Portal allows restaurant owners to register, get approved by admin, and manage their food items independently.

## Features

### For Restaurant Owners
- **Registration with Approval**: Restaurant owners can sign up and wait for admin approval
- **Food Management**: Add, edit, and remove their own food items
- **Order Management**: View and manage orders for their restaurant
- **Authentication**: Secure login with role-based access

### For Admins
- **Approval System**: Review and approve/reject restaurant owner registration requests
- **Owner Management**: View all approved restaurant owners
- **Full Control**: Admin can still manage all food items and orders

## Access URLs

- **Customer App**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Restaurant Owner Portal**: http://localhost:5175
- **Backend API**: http://localhost:4000

## Registration Process

### Step 1: Restaurant Owner Registration
1. Go to http://localhost:5175
2. Click "Create a new account"
3. Fill in:
   - Your name
   - Email
   - Password
   - Restaurant name
   - Restaurant address
4. Submit registration

### Step 2: Admin Approval
1. Admin logs into http://localhost:5174
2. Navigate to "Restro Owners" in sidebar
3. View pending requests
4. Approve or reject requests

### Step 3: Restaurant Owner Login
1. Once approved, restaurant owner can login at http://localhost:5175
2. Use email and password
3. Access food management features

## User Roles & Permissions

### Admin (wizard7@gmail.com)
- Can manage all food items
- Can view all orders
- Can approve/reject restaurant owners
- Full system access

### Restaurant Owner
- Can add/remove their own food items only
- Can view orders for their restaurant
- Must be approved by admin to access features

### Customer
- Can browse all food items
- Can place orders
- Can manage cart

## API Endpoints

### Restaurant Owner Management
- `GET /api/restro-owner/pending` - Get pending approval requests
- `GET /api/restro-owner/approved` - Get approved restaurant owners
- `POST /api/restro-owner/approve` - Approve restaurant owner
- `POST /api/restro-owner/reject` - Reject restaurant owner
- `POST /api/restro-owner/profile` - Get restaurant owner profile

### User Registration (Updated)
- `POST /api/user/register` - Register new user (supports restro_owner role)

### Authentication (Updated)
- `POST /api/user/login` - Login with approval status check

## Database Schema Updates

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // "user", "admin", "restro_owner"
  isApproved: Boolean, // false for pending restro_owner approval
  restaurantName: String, // for restro_owner
  restaurantAddress: String, // for restro_owner
  cartData: Object
}
```

### Food Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  addedBy: ObjectId // Reference to user who added the item
}
```

## Running the Application

### Install All Dependencies
```bash
npm run install:all
```

### Start All Services
```bash
npm run dev
```

### Start Individual Services
```bash
npm run start:backend      # Backend on port 4000
npm run start:frontend     # Customer app on port 5173
npm run start:admin        # Admin panel on port 5174
npm run start:restro-owner # Restaurant owner portal on port 5175
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for different user types
- **Approval Workflow**: Restaurant owners need admin approval
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Email validation and password strength checks

## Troubleshooting

### Common Issues

1. **Restaurant owner can't login**
   - Check if admin has approved the account
   - Verify email and password are correct

2. **Can't add food items**
   - Ensure restaurant owner account is approved
   - Check authentication token is valid

3. **Admin can't see pending requests**
   - Verify admin login credentials
   - Check database connection

### Default Credentials

- **Admin Email**: wizard7@gmail.com
- **Admin Password**: wizGoFood2004

## Development Notes

The restaurant owner functionality is built with the same tech stack as the existing admin panel:
- React 18 with Vite
- TailwindCSS for styling
- Axios for API calls
- React Router for navigation
- React Toastify for notifications

All restaurant owner features are protected by authentication middleware and role-based access control.
