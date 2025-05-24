# Buy Sell @ IIIT

A web application for buying and selling items within the IIIT community. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Authentication
- JWT-based authentication

### User Features
- Profile management
- Seller reviews and ratings
- AI-powered chatbot support using Google's Gemini

### Item Management
- List items for sale with details and images
- Search items with case-insensitive search
- Filter items by categories
- View detailed item information

### Shopping Features
- Shopping cart functionality
- Secure checkout process
- OTP-based delivery verification
- Order history tracking

### Order Management
- Separate views for pending orders, purchase history, and sales history
- OTP generation for order verification
- Order status tracking

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB Atlas
- npm

### Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/user` - Get current user

### Items
- `GET /api/items/search` - Search items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:itemId` - Remove from cart
- `POST /api/cart/checkout` - Checkout

### Orders
- `GET /api/orders/pending` - Get pending orders
- `GET /api/orders/purchases` - Get purchase history
- `GET /api/orders/sales` - Get sales history
- `POST /api/orders/verify-otp/:orderId` - Verify delivery OTP

### Reviews
- `GET /api/reviews/seller/:sellerId` - Get seller reviews
- `POST /api/reviews/:sellerId` - Add seller review

### Chat
- `POST /api/chat` - Send message to AI chatbot

## Technologies Used

### Frontend
- React.js
- Redux Toolkit
- Material-UI
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google's Generative AI (Gemini)
- bcryptjs for password hashing

### Security Features
- JWT-based authentication
- Password hashing
- Protected routes
- Input validation
- Error handling

