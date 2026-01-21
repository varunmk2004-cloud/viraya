# Technologies Used in Viraya Productions Project

## 🏗️ Architecture
**MERN Stack** - MongoDB, Express.js, React, Node.js

---

## 🔧 Backend Technologies

### Core Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** (v4.18.2) - Web application framework
- **ES Modules** - Modern JavaScript module system (`"type": "module"`)

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v7.3.0) - MongoDB object modeling for Node.js

### Authentication & Security
- **jsonwebtoken** (v9.0.1) - JWT token generation and verification
- **bcryptjs** (v2.4.3) - Password hashing (12 salt rounds)
- **helmet** (v7.2.0) - HTTP security headers
- **express-rate-limit** (v7.5.1) - Rate limiting to prevent brute force attacks
- **express-validator** (v7.3.1) - Input validation and sanitization
- **validator** (v13.15.23) - String validation utilities

### Middleware & Utilities
- **cors** (v2.8.5) - Cross-Origin Resource Sharing
- **dotenv** (v16.3.1) - Environment variable management

### Development Tools
- **nodemon** (v2.0.22) - Auto-restart server during development

---

## 🎨 Frontend Technologies

### Core Framework
- **React** (v18.2.0) - JavaScript UI library
- **React DOM** (v18.2.0) - React renderer for web
- **Vite** (v5.0.0) - Build tool and dev server (faster than Create React App)

### Routing
- **React Router DOM** (v6.12.1) - Client-side routing

### UI Framework & Styling
- **Bootstrap** (v5.3.8) - CSS framework
- **React Bootstrap** (v2.10.10) - Bootstrap components for React
- **Custom CSS** - Additional styling

### Icons
- **React Icons** (v5.5.0) - Icon library (Feather Icons - Fi)

### HTTP Client
- **Axios** (v1.4.0) - Promise-based HTTP client for API calls

---

## 🔐 Security Features Implemented

### Authentication
- JWT-based authentication
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Token blacklisting on logout
- Password reset functionality

### Security Measures
- Rate limiting (prevents brute force)
- Account lockout (5 failed attempts = 30 min lockout)
- Password strength enforcement
- Input validation and sanitization
- CORS protection
- Security headers (Helmet)
- Bcrypt password hashing

---

## 📦 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth, validation, rate limiting
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   └── seed/          # Database seeding
├── server.js          # Entry point
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/           # Axios configuration
│   ├── components/    # Reusable components
│   ├── context/       # React Context (Auth)
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── package.json
```

---

## 🚀 Development Tools

### Backend
- **nodemon** - Auto-restart on file changes
- **ES Modules** - Modern import/export syntax

### Frontend
- **Vite** - Fast build tool and HMR (Hot Module Replacement)
- **React DevTools** - Browser extension for debugging

---

## 🌐 API Architecture

### RESTful API Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- RESTful route naming conventions

### API Endpoints
- `/api/auth` - Authentication routes
- `/api/products` - Product management
- `/api/cart` - Shopping cart
- `/api/orders` - Order management
- `/api/rentals` - Rental services
- `/api/admin` - Admin operations

---

## 💾 Data Storage

### Database
- **MongoDB Atlas** (Cloud) or Local MongoDB
- Document-based NoSQL database
- Mongoose ODM for schema definition

### Client-Side Storage
- **localStorage** - Token and user data storage
- Session management

---

## 🎯 Key Features

### Backend Features
- User authentication & authorization
- Role-based access control (customer, seller, admin)
- Product management
- Shopping cart functionality
- Order processing
- Rental request system
- Admin dashboard APIs

### Frontend Features
- Responsive design (Bootstrap)
- Client-side routing
- Authentication context
- Toast notifications
- Loading states
- Protected routes
- Dynamic UI components

---

## 📝 Code Patterns

### Backend
- **MVC Pattern** - Model-View-Controller architecture
- **Middleware Pattern** - Request processing pipeline
- **Async/Await** - Asynchronous operations
- **ES6+ Syntax** - Modern JavaScript features

### Frontend
- **Functional Components** - React hooks
- **Context API** - Global state management
- **Custom Hooks** - Reusable logic
- **Component Composition** - Modular design

---

## 🔄 Data Flow

1. **Frontend** → Axios → **Backend API**
2. **Backend** → Mongoose → **MongoDB**
3. **Backend** → JWT → **Frontend** (tokens)
4. **Frontend** → localStorage → **Browser Storage**

---

## 🌍 Environment Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb_connection_string
JWT_SECRET=jwt_secret_key
JWT_REFRESH_SECRET=refresh_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
- API Base URL: `http://localhost:5000/api`
- Development server: Vite (usually port 5173)

---

## 📊 Version Information

- **Node.js**: Compatible with Node 14+
- **React**: 18.2.0
- **Express**: 4.18.2
- **MongoDB**: 7.3.0 (Mongoose)
- **Bootstrap**: 5.3.8

---

## 🛠️ Build & Deployment

### Backend
```bash
npm install
npm run dev    # Development with nodemon
npm start      # Production
```

### Frontend
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

---

## 📚 Additional Libraries & Tools

- **React Router** - Navigation and routing
- **React Bootstrap** - Pre-built UI components
- **Axios Interceptors** - Automatic token refresh
- **React Context** - State management
- **React Hooks** - useState, useEffect, useContext

---

## 🔍 Code Quality & Best Practices

- ES6+ JavaScript syntax
- Async/await for asynchronous operations
- Error handling with try-catch
- Input validation on both client and server
- Security best practices implemented
- RESTful API design
- Component-based architecture
- Separation of concerns




