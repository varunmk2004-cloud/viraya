import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer
      className="mt-5 pt-5 border-top"
      style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.06), rgba(0,0,0,0.02))',
      }}
    >
      <div className="container">
        <div className="row" style={{ marginBottom: '1rem' }}>
          <div className="col-md-4">
            <div className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
              Viraya Productions
            </div>
            <p className="mb-2" style={{ color: '#6c757d', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem' }}>
              Premium event equipment and luxury rentals for unforgettable experiences.
            </p>
            <div className="small text-muted">Thank you for shopping with us.</div>
          </div>

          <div className="col-md-4" style={{ textAlign: 'right', paddingRight: 0 }}>
            <div className="fw-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Quick Links
            </div>
            <div className="d-flex flex-column gap-2" style={{ alignItems: 'flex-end' }}>
              <Link to="/about" className="text-decoration-none text-muted">About Us</Link>
              <Link to="/contact" className="text-decoration-none text-muted">Contact</Link>
              <Link to="/support" className="text-decoration-none text-muted">Support</Link>
              <Link to="/rental-requests" className="text-decoration-none text-muted">Rental Requests</Link>
              <Link to="/privacy" className="text-decoration-none text-muted">Privacy & Terms</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="fw-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Get in Touch
            </div>
            <div className="d-flex align-items-start gap-2 text-muted mb-2">
              <FiMail style={{ marginTop: '0.25rem' }} /> <span>support@virayaproductions.com</span>
            </div>
            <div className="d-flex align-items-start gap-2 text-muted mb-2">
              <FiPhone style={{ marginTop: '0.25rem' }} /> <span>+1 (555) 123-4567</span>
            </div>
            <div className="d-flex align-items-start gap-2 text-muted">
              <FiMapPin style={{ marginTop: '0.25rem' }} /> <span>APMC Market, Amargol, Hubballi, Karnataka</span>
            </div>
          </div>
        </div>

        <hr style={{ margin: '1.5rem 0' }} />

        <div className="d-flex flex-column" style={{ flexDirection: 'column', gap: '0.5rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: window.innerWidth >= 768 ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center', color: '#6c757d', fontSize: '0.875rem' }}>
            <span>© {new Date().getFullYear()} Viraya Productions. All rights reserved.</span>
            <div className="d-flex gap-3 align-items-center" style={{ marginTop: window.innerWidth >= 768 ? 0 : '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/privacy" className="text-decoration-none text-muted">Privacy</Link>
              <Link to="/terms" className="text-decoration-none text-muted">Terms</Link>
              <Link to="/support" className="text-decoration-none text-muted">Support</Link>
              <Link 
                to="/admin/login" 
                className="btn btn-sm btn-outline-primary"
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem',
                  textDecoration: 'none',
                  borderWidth: '1px'
                }}
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
