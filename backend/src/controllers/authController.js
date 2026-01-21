import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Ensure required JWT secrets exist and return them
const getJwtSecrets = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || jwtSecret;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET env var is missing');
  }

  if (!jwtRefreshSecret) {
    throw new Error('JWT_REFRESH_SECRET env var is missing');
  }

  return { jwtSecret, jwtRefreshSecret };
};

// Generate JWT tokens
const generateTokens = (userId, role) => {
  const { jwtSecret, jwtRefreshSecret } = getJwtSecrets();
  
  const accessToken = jwt.sign(
    { id: userId, role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    jwtRefreshSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (role && role !== 'customer') {
      return res.status(400).json({
        success: false,
        message: 'Only customer role is allowed for public registration.',
        code: 'INVALID_ROLE'
      });
    }
    
    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'An account with this email already exists. Please login or use a different email.',
        code: 'EMAIL_EXISTS'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hash, 
      role: 'customer' 
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      data: {
        token: accessToken,
        refreshToken,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again later.' 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email: email?.toLowerCase(), hasPassword: !!password });
    
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +loginAttempts +lockUntil');
    
    if (!user) {
      console.log('User not found for email:', email?.toLowerCase());
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    console.log('User found:', { email: user.email, role: user.role, isActive: user.isActive });
    
    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        success: false,
        message: `Account temporarily locked. Please try again in ${lockTime} minute(s).` 
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }
    
    // Verify password
    console.log('Comparing password...');
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (!match) {
      // Increment login attempts
      const maxAttempts = 5;
      const lockTime = 30 * 60 * 1000; // 30 minutes
      
      if (user.loginAttempts < maxAttempts - 1) {
        user.loginAttempts += 1;
        await user.save({ validateBeforeSave: false });
      } else {
        // Lock account
        user.loginAttempts = 0;
        user.lockUntil = Date.now() + lockTime;
        await user.save({ validateBeforeSave: false });
        return res.status(423).json({ 
          success: false,
          message: 'Too many failed login attempts. Account locked for 30 minutes.' 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    res.json({ 
      success: true,
      message: 'Login successful',
      data: {
        token: accessToken,
        refreshToken,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      email: req.body?.email
    });
    res.status(500).json({ 
      success: false,
      message: err.message || 'Login failed. Please try again later.' 
    });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Refresh token is required' 
      });
    }
    
    // Verify refresh token
    const { jwtRefreshSecret } = getJwtSecrets();
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    
    // Find user with refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
    
    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    
    res.json({ 
      success: true,
      data: {
        token: accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired refresh token' 
      });
    }
    console.error('Refresh token error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Token refresh failed. Please login again.' 
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      // Clear refresh token
      await User.findByIdAndUpdate(userId, { 
        $unset: { refreshToken: 1 } 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Logout failed' 
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return res.json({ 
        success: true,
        message: 'If the email exists, a password reset link has been sent.' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiration (1 hour)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    
    // In production, send email with reset link
    // For now, return token in response (remove in production)
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password reset URL:', resetUrl); // Remove in production
    
    res.json({ 
      success: true,
      message: 'If the email exists, a password reset link has been sent.',
      // Remove this in production - only for development
      ...(process.env.NODE_ENV !== 'production' && { resetToken, resetUrl })
    });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Password reset request failed. Please try again later.' 
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Hash the token to compare with stored hash
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires');
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    
    // Update password and clear reset token
    user.password = hash;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password reset successful. Please login with your new password.' 
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Password reset failed. Please try again.' 
    });
  }
};

// Change password (for authenticated users)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Find user with password field
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hash;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Password change failed. Please try again.' 
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true,
      data: {
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile' 
    });
  }
};
