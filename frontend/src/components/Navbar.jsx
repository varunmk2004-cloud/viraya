import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut, FiHome, FiShield, FiMessageCircle, FiInfo, FiMenu, FiX, FiPackage } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className="navbar"
      style={{ 
        position: 'relative',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        boxShadow: '0 1px 15px rgba(26, 26, 26, 0.04)',
        width: '100%',
        marginTop: 0,
        paddingTop: 0
      }}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.75rem 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <div style={{ width: 'clamp(100px, 20vw, 200px)', height: 'auto', display: 'flex', alignItems: 'center' }}>
              <img src="/logo-bg.png" alt="Viraya Productions" style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="d-none d-md-flex" style={{ alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
              <FiHome /> Home
            </Link>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
              <FiShoppingCart /> Cart
            </Link>
            {user && (
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
                <FiPackage /> Orders
              </Link>
            )}
            <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
              <FiInfo /> About
            </Link>
            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
              <FiMessageCircle /> Contact
            </Link>
            
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
                    <FiShield /> Admin
                  </Link>
                )}
                {user.role === 'delivery' && (
                  <Link to="/delivery" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
                    <FiPackage /> Delivery
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                      }}
                    >
                      <FiUser style={{ color: '#1a1a1a' }} />
                    </div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      transition: 'color 0.3s'
                    }}
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#1a1a1a', padding: '0.5rem', transition: 'color 0.3s' }}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  style={{ textAlign: 'center', padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn d-md-none"
            onClick={toggleMenu}
            style={{
              display: 'block',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#1a1a1a'
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className="d-md-none"
          style={{
            display: isMenuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: '1rem',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
              <FiHome /> Home
            </Link>
            <Link to="/cart" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
              <FiShoppingCart /> Cart
            </Link>
            {user && (
              <Link to="/orders" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
                <FiPackage /> Orders
              </Link>
            )}
            <Link to="/about" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
              <FiInfo /> About
            </Link>
            <Link to="/contact" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
              <FiMessageCircle /> Contact
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
                    <FiShield /> Admin
                  </Link>
                )}
                {user.role === 'delivery' && (
                  <Link to="/delivery" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s' }}>
                    <FiPackage /> Delivery
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem' }}>
                  <div
                    style={{
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    }}
                  >
                    <FiUser style={{ color: '#1a1a1a' }} />
                  </div>
                  <span style={{ fontWeight: 500 }}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '0.375rem',
                    transition: 'background 0.3s'
                  }}
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} style={{ textDecoration: 'none', color: '#1a1a1a', padding: '0.75rem', borderRadius: '0.375rem', transition: 'background 0.3s', textAlign: 'center' }}>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMenu}
                  className="btn btn-primary"
                  style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', display: 'block' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
