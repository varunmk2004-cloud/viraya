import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiCalendar } from 'react-icons/fi';

export default function ProductCard({ p }) {
  const [imageError, setImageError] = useState(false);
  const isRental = p.isRental || p.rental?.pricePerDay;
  const price = isRental 
    ? `₹${p.rental?.pricePerDay || 0}/day` 
    : `₹${p.price || 0}`;
  
  const lowStockThreshold = p.lowStockThreshold || 10;
  const isLowStock = p.stock !== undefined && p.stock <= lowStockThreshold && p.stock > 0;
  const isOutOfStock = p.stock !== undefined && p.stock === 0;
  
  // Handle image URLs - supports base64, external URLs, and local paths
  const getImageUrl = (url) => {
    if (!url) return null;
    // If it's a base64 data URL (from admin upload), use it as-is
    // Also handle case where it might have a leading slash
    if (url.startsWith('data:image/')) {
      return url;
    }
    if (url.startsWith('/data:image/')) {
      return url.substring(1); // Remove leading slash
    }
    // If it's already a full URL (http/https), use it as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it starts with /, it's a public folder path - Vite will serve it
    if (url.startsWith('/')) {
      return url;
    }
    // Otherwise, assume it's a public folder path
    return `/${url}`;
  };
  
  const imageUrl = getImageUrl(p.image || (p.images && p.images[0]));

  return (
    <Link to={`/product/${p._id}`} className="text-decoration-none" style={{ color: 'inherit' }}>
      <div className="card h-100 shadow-sm">
        <div className="position-relative" style={{ height: '200px', minHeight: '200px', overflow: 'hidden', background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', display: imageError ? 'none' : 'block' }}
              className="card-img-hover"
              onError={(e) => {
                setImageError(true);
              }}
              onLoad={() => {
                setImageError(false);
              }}
              loading="lazy"
            />
          ) : null}
          {(!imageUrl || imageError) && (
            <div className="d-flex align-items-center justify-content-center h-100" style={{ position: imageUrl ? 'absolute' : 'relative', top: 0, left: 0, right: 0, bottom: 0 }}>
              <div style={{ fontSize: '3rem', color: '#94a3b8' }}>
                {isRental ? <FiCalendar /> : <FiShoppingBag />}
              </div>
            </div>
          )}
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
            {isRental && (
              <span
                className="badge bg-primary"
                style={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Rental
              </span>
            )}
            {isOutOfStock && (
              <span
                className="badge bg-danger"
                style={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Out of Stock
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span
                className="badge bg-warning text-dark"
                style={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Low Stock
              </span>
            )}
          </div>
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
              <span className="fs-4 fw-bold text-primary">{price}</span>
              {!isRental && p.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  ₹{p.originalPrice}
                </span>
              )}
            </div>
            <span className="fw-semibold text-primary">View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
