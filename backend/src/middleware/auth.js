import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Get JWT secret with validation
const getJwtSecret = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET env var is missing');
  }
  return jwtSecret;
};

// Protect routes - verify access token
export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized. Please provide a valid token.' 
    });
  }
  
  try {
    // Verify token
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists.' 
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please login again.' 
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired. Please refresh your token or login again.' 
      });
    }
    console.error('Auth middleware error:', err);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed.' 
    });
  }
};

// Verify refresh token
export const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Refresh token is required' 
      });
    }
    
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!jwtRefreshSecret) {
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired refresh token' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Token verification failed' 
    });
  }
};
