import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiShoppingCart, FiCalendar, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // Rental availability state
  const [dates, setDates] = useState({ start: '', end: '' });
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setProduct(null);
    
    const abortController = new AbortController();
    
    axios
      .get(`/products/${id}`, { signal: abortController.signal })
      .then((r) => {
        setProduct(r.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return; // Request was cancelled, ignore
        }
        console.error('Error loading product:', err);
        setLoading(false);
        setProduct(null);
        if (err.response?.status === 429) {
          showToast('Too many requests. Please wait a moment and try again.', 'error');
        } else {
          showToast('Failed to load product', 'error');
        }
      });
    
    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (product) {
      setImageError(false);
      setSelectedImageIndex(0);
    }
  }, [product]);

  // Debounced availability check to prevent too many API calls
  useEffect(() => {
    if (!dates.start || !dates.end || new Date(dates.start) >= new Date(dates.end)) {
      setAvailability(null);
      return;
    }

    let abortController = null;
    
    // Debounce the API call by 500ms
    const timeoutId = setTimeout(() => {
      setCheckingAvailability(true);
      abortController = new AbortController();
      
      axios.get(`/products/${id}/availability?start=${dates.start}&end=${dates.end}`, {
        signal: abortController.signal
      })
        .then(res => setAvailability(res.data))
        .catch(err => {
          if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
            return; // Request was cancelled, ignore
          }
          if (err.response?.status === 429) {
            showToast('Too many requests. Please wait a moment.', 'warning');
          }
          setAvailability(null);
        })
        .finally(() => setCheckingAvailability(false));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (abortController) {
        abortController.abort();
      }
    };
  }, [dates.start, dates.end, id, showToast]);

  // Reset image error when selected image index changes
  useEffect(() => {
    if (product) {
      const allImages = product.images && product.images.length > 0 
        ? product.images 
        : product.image 
          ? [product.image] 
          : [];
      const currentImage = allImages[selectedImageIndex] || product.image || '';
      if (currentImage) {
        setImageError(false);
      }
    }
  }, [selectedImageIndex, product]);

  const addToCart = async () => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      return nav('/login');
    }
    setAddingToCart(true);
    try {
      await axios.post('/cart/add', { productId: id, qty: 1, type: 'purchase' });
      showToast('Added to cart!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const goRental = () => {
    let url = `/rental/${id}`;
    if (dates.start && dates.end) {
        url += `?start=${dates.start}&end=${dates.end}`;
    }
    nav(url);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return (
      <div className="container text-center py-5" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="alert alert-info">Product not found</div>
        <button onClick={() => nav('/')} className="btn btn-primary mt-3">
          Go Home
        </button>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">Invalid product ID</div>
        <button onClick={() => nav('/')} className="btn btn-primary mt-3">
          Go Home
        </button>
      </div>
    );
  }

  const isRental = product?.isRental || product?.rental?.pricePerDay;
  const price = isRental
    ? `₹${product?.rental?.pricePerDay || 0}/day`
    : `₹${product?.price || 0}`;
  
  const lowStockThreshold = product?.lowStockThreshold || 10;
  const isLowStock = product?.stock !== undefined && product.stock <= lowStockThreshold && product.stock > 0;
  const isOutOfStock = product?.stock !== undefined && product.stock === 0;
  
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
  
  const allImages = product?.images && product.images.length > 0 
    ? product.images.map(getImageUrl).filter(Boolean)
    : product?.image 
      ? [getImageUrl(product.image)].filter(Boolean)
      : [];
  
  const currentImage = allImages[selectedImageIndex] || getImageUrl(product?.image) || '';

  const nextImage = () => {
    if (allImages.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
        <button onClick={() => nav(-1)} className="btn btn-link mb-4" style={{ padding: 0, textDecoration: 'none' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back
        </button>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm">
              <div
                className="position-relative"
                style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)',
                  overflow: 'hidden',
                  minHeight: '300px'
                }}
              >
                {currentImage ? (
                  <>
                    <img
                      src={currentImage}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: imageError ? 'none' : 'block' }}
                      onError={(e) => {
                        setImageError(true);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => {
                        setImageError(false);
                      }}
                      loading="lazy"
                    />
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.preventDefault(); prevImage(); }}
                          className="position-absolute"
                          style={{
                            top: '50%',
                            left: '10px',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          <FiChevronLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); nextImage(); }}
                          className="position-absolute"
                          style={{
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }}
                        >
                          <FiChevronRight size={20} />
                        </button>
                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                          <span className="badge bg-dark bg-opacity-75">
                            {selectedImageIndex + 1} / {allImages.length}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : null}
                {(!currentImage || imageError) && (
                  <div className="d-flex align-items-center justify-content-center h-100" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <span style={{ fontSize: '4rem' }}>📦</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="d-flex gap-2 mt-3" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className="rounded"
                    style={{
                      width: '80px',
                      height: '80px',
                      minWidth: '80px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImageIndex === idx ? '3px solid #4169E1' : '2px solid #dee2e6',
                      opacity: selectedImageIndex === idx ? 1 : 0.7,
                      transition: 'all 0.3s'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <div>
              {isRental && (
                <span className="badge bg-primary mb-3">Rental Available</span>
              )}
              <h1 
                className="display-5 fw-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.title}
              </h1>
              <div className="d-flex align-items-baseline gap-3 mb-4">
                <span className="display-6 fw-bold text-primary">{price}</span>
                {!isRental && product.originalPrice && (
                  <span className="h4 text-muted text-decoration-line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Information */}
              {product.stock !== undefined && (
                <div className="mb-4">
                  {isOutOfStock ? (
                    <div className="alert alert-danger mb-0">
                      <strong>Out of Stock</strong> - This item is currently unavailable.
                    </div>
                  ) : isLowStock ? (
                    <div className="alert alert-warning mb-0">
                      <strong>Low Stock</strong> - Only {product.stock} {product.stock === 1 ? 'item' : 'items'} remaining!
                    </div>
                  ) : (
                    <div className="alert alert-success mb-0">
                      <strong>In Stock</strong> - {product.stock} {product.stock === 1 ? 'item' : 'items'} available
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <h3 className="h5 fw-semibold mb-2">Description</h3>
                <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {isRental && product.rental && (
                <div className="alert alert-info mb-4">
                  <h5 className="fw-semibold mb-2">Rental Information</h5>
                  <ul className="mb-0" style={{ paddingLeft: '1.5rem' }}>
                    <li>Price: ₹{product.rental.pricePerDay} per day</li>
                    {product.rental.minDays && (
                      <li>Minimum rental: {product.rental.minDays} days</li>
                    )}
                  </ul>
                  
                  <div className="mt-3 pt-3 border-top">
                    <h6 className="fw-semibold mb-2">Check Availability</h6>
                    <div className="row g-2">
                        <div className="col-6">
                            <small className="d-block text-muted mb-1">Start Date</small>
                            <input 
                                type="date" 
                                className="form-control form-control-sm"
                                value={dates.start}
                                onChange={e => setDates({...dates, start: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="col-6">
                            <small className="d-block text-muted mb-1">End Date</small>
                            <input 
                                type="date" 
                                className="form-control form-control-sm"
                                value={dates.end}
                                onChange={e => setDates({...dates, end: e.target.value})}
                                min={dates.start || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                    
                    {checkingAvailability && <div className="text-muted small mt-2">Checking...</div>}
                    
                    {availability && (
                        <div className={`mt-2 p-2 rounded ${availability.available > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                            <strong>{availability.available > 0 ? 'Available' : 'Out of Stock'}</strong>
                            <div className="small">
                                {availability.available} units available (Total Stock: {availability.totalStock})
                            </div>
                            {availability.available > 0 && availability.available <= (product.lowStockThreshold || 10) && (
                                <div className="small mt-1 text-warning">
                                    <strong>⚠ Low Stock Warning:</strong> Only {availability.available} units available for these dates!
                                </div>
                            )}
                        </div>
                    )}
                    
                    {!availability && product.stock !== undefined && (
                        <div className="mt-2 p-2 rounded bg-info bg-opacity-10 text-info">
                            <div className="small">
                                Total Stock: {product.stock} units
                                {isLowStock && (
                                    <span className="text-warning ms-2">
                                        <strong>⚠ Low Stock</strong>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-top">
                {!isRental ? (
                  <button
                    onClick={addToCart}
                    disabled={addingToCart || isOutOfStock}
                    className="btn btn-primary w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : isOutOfStock ? (
                      <>
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <FiShoppingCart style={{ marginRight: '0.5rem' }} /> Add to Cart
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={goRental}
                    className="btn btn-primary w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                  >
                    <FiCalendar style={{ marginRight: '0.5rem' }} /> Request Rental
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
