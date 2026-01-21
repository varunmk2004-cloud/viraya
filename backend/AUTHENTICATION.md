# Secure Authentication API Documentation

## Overview
This authentication system implements industry-standard security practices including JWT tokens, refresh tokens, rate limiting, input validation, and password security.

## Security Features

### 1. **Password Security**
- Minimum 8 characters
- Must contain uppercase, lowercase, and numbers
- Bcrypt hashing with 12 salt rounds
- Password reset functionality with secure tokens

### 2. **Token Management**
- **Access Tokens**: Short-lived (15 minutes default) for API requests
- **Refresh Tokens**: Long-lived (7 days default) for obtaining new access tokens
- Tokens stored securely in database
- Token blacklisting on logout

### 3. **Rate Limiting**
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Password reset**: 3 requests per hour per IP
- **General API**: 100 requests per 15 minutes per IP

### 4. **Account Protection**
- Account lockout after 5 failed login attempts (30 minutes)
- Login attempt tracking
- Account activation status check

### 5. **Input Validation**
- Email format validation
- Password strength validation
- Name validation (letters and spaces only)
- Input sanitization and normalization

### 6. **Security Headers**
- Helmet.js for HTTP security headers
- CORS configuration
- Request size limits

## API Endpoints

### Public Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "customer" // optional: customer, seller, admin
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "access_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "access_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### POST `/api/auth/refresh-token`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST `/api/auth/request-password-reset`
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent."
}
```

#### POST `/api/auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new password."
}
```

### Protected Endpoints (Require Authentication)

#### POST `/api/auth/logout`
Logout user and invalidate refresh token.

**Headers:**
```
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/change-password`
Change password for authenticated user.

**Headers:**
```
Authorization: Bearer access_token_here
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### GET `/api/auth/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer access_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_minimum_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Client URL (for CORS and password reset links)
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Security Best Practices

1. **Never expose sensitive information** in error messages
2. **Use HTTPS** in production
3. **Store refresh tokens securely** (consider httpOnly cookies)
4. **Implement email verification** for production
5. **Monitor failed login attempts** for security alerts
6. **Rotate JWT secrets** regularly
7. **Use strong passwords** (enforced by validation)
8. **Keep dependencies updated** for security patches

## Frontend Integration

### Storing Tokens
```javascript
// Store tokens securely
localStorage.setItem('token', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### Making Authenticated Requests
```javascript
axios.get('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Token Refresh on 401
```javascript
// In axios interceptor
if (error.response?.status === 401) {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post('/api/auth/refresh-token', { refreshToken });
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  // Retry original request
}
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`

3. Start the server:
```bash
npm run dev
```

## Notes

- Password reset tokens expire after 1 hour
- Account lockout duration: 30 minutes after 5 failed attempts
- Access tokens expire after 15 minutes (configurable)
- Refresh tokens expire after 7 days (configurable)
- All passwords are hashed with bcrypt (12 rounds)


