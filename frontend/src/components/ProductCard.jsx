import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiCalendar } from 'react-icons/fi';

export default function ProductCard({ p }) {
  const isRental = p.isRental || p.rental?.pricePerDay;
  const price = isRental 
    ? `₹${p.rental?.pricePerDay || 0}/day` 
    : `₹${p.price || 0}`;

  return (
    <Link to={`/product/${p._id}`} className="text-decoration-none" style={{ color: 'inherit' }}>
      <div className="card h-100 shadow-sm">
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden', background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)' }}>
          {(p.image || (p.images && p.images[0])) ? (
            <img
              src={p.image || (p.images && p.images[0])}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              className="card-img-hover"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div style={{ fontSize: '3rem', color: '#94a3b8' }}>
                {isRental ? <FiCalendar /> : <FiShoppingBag />}
              </div>
            </div>
          )}
          {isRental && (
            <span
              className="badge bg-primary position-absolute"
              style={{ 
                top: '0.5rem',
                right: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Rental
            </span>
          )}
        </div>
        <div className="d-flex flex-column" style={{ padding: '1rem' }}>
          <h5 
            className="fw-bold mb-2" 
            style={{ 
              fontSize: '1.1rem', 
              minHeight: '3rem',
              fontFamily: "'Playfair Display', serif",
              margin: 0
            }}
          >
            {p.title}
          </h5>
          <p className="text-muted small mb-3 flex-grow-1" style={{ minHeight: '3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
            {p.description || 'No description available'}
          </p>
          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
            <div>
              <span className="fs-4 fw-bold" style={{ color: '#d4af37' }}>{price}</span>
              {!isRental && p.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  ₹{p.originalPrice}
                </span>
              )}
            </div>
            <span className="fw-semibold" style={{ color: '#d4af37' }}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
