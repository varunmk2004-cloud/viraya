import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiMail, FiLock, FiShield, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimating(true);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Trim email and password to remove any whitespace
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      console.log('Attempting login with:', { email: trimmedEmail, hasPassword: !!trimmedPassword });
      console.log('API Base URL:', axios.defaults.baseURL || 'http://localhost:5000/api');
      
      const res = await axios.post('/auth/login', { 
        email: trimmedEmail, 
        password: trimmedPassword 
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.data.success) {
        const { token, refreshToken, user } = res.data.data;
        
        // Allow only admin login (delivery removed)
        if (user.role !== 'admin') {
          showToast('Access denied. Admin privileges required.', 'error');
          setLoading(false);
          return;
        }
        
        login(user, token, refreshToken);
        showToast('Admin login successful!', 'success');
        nav('/admin');
      } else {
        showToast(res.data.message || 'Login failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || err.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server. Please ensure:\n1. Backend server is running (npm run dev in backend folder)\n2. Server is on port 5000\n3. No firewall is blocking the connection';
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The server may be slow or unresponsive.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response.data?.message || 'Invalid email or password';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        style={{ 
          minHeight: 'calc(100vh - 70px)',
          paddingTop: '2rem', 
          paddingBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.02) 0%, rgba(212, 175, 55, 0.05) 100%)',
          position: 'relative'
        }}
      >
        {/* Decorative background elements */}
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(26, 26, 26, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0
          }}
        />

        <div className="row justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <Link 
              to="/" 
              className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
              style={{ 
                color: '#1a1a1a',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.color = '#d4af37'}
              onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
            >
              <FiArrowLeft /> Back to Home
            </Link>
            
            <div 
              className="card shadow-lg"
              style={{
                border: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: isAnimating ? 'slideInUp 0.6s ease-out, fadeIn 0.6s ease-out' : 'none'
              }}
            >
              {/* Header section with gradient */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative pattern */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                    opacity: 0.3
                  }}
                />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                      boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)',
                      border: '3px solid rgba(255, 255, 255, 0.2)',
                      animation: isAnimating ? 'pulse 1.5s ease-in-out 0.3s, scaleIn 0.5s ease-out 0.2s' : 'none',
                      transform: isAnimating ? 'scale(1)' : 'scale(0)'
                    }}
                  >
                    <FiShield 
                      style={{ 
                        color: '#1a1a1a',
                        animation: isAnimating ? 'rotateIn 0.8s ease-out 0.4s' : 'none',
                        transform: isAnimating ? 'rotate(0deg)' : 'rotate(-180deg)'
                      }} 
                      size={36} 
                    />
                  </div>
                  <h1 
                    className="h2 fw-bold mb-2" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      color: '#ffffff',
                      fontSize: '2rem'
                    }}
                  >
                    Admin Portal
                  </h1>
                  <p 
                    style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: '1.1rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0
                    }}
                  >
                    Secure access to administrative dashboard
                  </p>
                </div>
              </div>

              <div className="p-5">
                {/* Security notice */}
                <div 
                  className="d-flex align-items-start gap-2 mb-4 p-3"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                  }}
                >
                  <FiAlertCircle style={{ color: '#d4af37', marginTop: '2px', flexShrink: 0 }} size={18} />
                  <p 
                    className="mb-0 small"
                    style={{ 
                      color: '#1a1a1a',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}
                  >
                    This is a restricted area. Only authorized administrators are allowed to access this portal.
                  </p>
                </div>

                <form onSubmit={submit}>
                  <div className="form-group mb-4">
                    <label 
                      className="form-label fw-semibold mb-2"
                      style={{ 
                        color: '#1a1a1a',
                        fontSize: '0.95rem',
                        letterSpacing: '0.3px'
                      }}
                    >
                      Email Address
                    </label>
                    <div className="position-relative">
                      <FiMail 
                        className="position-absolute translate-middle-y" 
                        style={{ 
                          color: errors.email ? '#dc3545' : '#6c757d', 
                          left: '1rem', 
                          top: '50%',
                          zIndex: 2
                        }} 
                        size={18}
                      />
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        style={{ 
                          paddingLeft: '3rem',
                          paddingRight: '1rem',
                          paddingTop: '0.75rem',
                          paddingBottom: '0.75rem',
                          border: errors.email ? '2px solid #dc3545' : '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          background: errors.email ? '#fff5f5' : '#ffffff'
                        }}
                        placeholder="admin@viraya.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors({ ...errors, email: '' });
                          }
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.email ? '#dc3545' : '#e0e0e0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    {errors.email && (
                      <div 
                        className="form-text text-danger mt-1 d-flex align-items-center gap-1"
                        style={{ fontSize: '0.875rem' }}
                      >
                        <FiAlertCircle size={14} /> {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <label 
                      className="form-label fw-semibold mb-2"
                      style={{ 
                        color: '#1a1a1a',
                        fontSize: '0.95rem',
                        letterSpacing: '0.3px'
                      }}
                    >
                      Password
                    </label>
                    <div className="position-relative">
                      <FiLock 
                        className="position-absolute translate-middle-y" 
                        style={{ 
                          color: errors.password ? '#dc3545' : '#6c757d', 
                          left: '1rem', 
                          top: '50%',
                          zIndex: 2
                        }} 
                        size={18}
                      />
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        style={{ 
                          paddingLeft: '3rem',
                          paddingRight: '1rem',
                          paddingTop: '0.75rem',
                          paddingBottom: '0.75rem',
                          border: errors.password ? '2px solid #dc3545' : '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          background: errors.password ? '#fff5f5' : '#ffffff'
                        }}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors({ ...errors, password: '' });
                          }
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#d4af37';
                          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.password ? '#dc3545' : '#e0e0e0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    {errors.password && (
                      <div 
                        className="form-text text-danger mt-1 d-flex align-items-center gap-1"
                        style={{ fontSize: '0.875rem' }}
                      >
                        <FiAlertCircle size={14} /> {errors.password}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mb-4"
                    style={{ 
                      fontSize: '1.1rem', 
                      padding: '0.875rem 1.5rem',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 15px rgba(26, 26, 26, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)';
                        e.target.style.boxShadow = '0 6px 20px rgba(26, 26, 26, 0.4)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.target.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
                        e.target.style.boxShadow = '0 4px 15px rgba(26, 26, 26, 0.3)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem' }}></span>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <FiShield size={18} /> Access Admin Dashboard
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0 small" style={{ fontSize: '0.875rem' }}>
                    Regular user?{' '}
                    <Link 
                      to="/login" 
                      className="text-decoration-none fw-semibold"
                      style={{ 
                        color: '#1a1a1a',
                        borderBottom: '1px solid transparent',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#d4af37';
                        e.target.style.borderBottomColor = '#d4af37';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#1a1a1a';
                        e.target.style.borderBottomColor = 'transparent';
                      }}
                    >
                      Customer Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(212, 175, 55, 0.6);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes rotateIn {
          from {
            transform: rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
      
      <Footer />
    </>
  );
}
