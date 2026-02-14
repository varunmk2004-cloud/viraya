import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiShoppingCart, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Rental availability state
  const [dates, setDates] = useState({ start: '', end: '' });
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showToast('Failed to load product', 'error');
      });
  }, [id]);

  useEffect(() => {
    if (dates.start && dates.end && new Date(dates.start) < new Date(dates.end)) {
      setCheckingAvailability(true);
      axios.get(`/products/${id}/availability?start=${dates.start}&end=${dates.end}`)
        .then(res => setAvailability(res.data))
        .catch(err => {
          console.error(err);
          setAvailability(null);
        })
        .finally(() => setCheckingAvailability(false));
    } else {
      setAvailability(null);
    }
  }, [dates.start, dates.end, id]);

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
      <div className="container text-center py-5">
        <div className="alert alert-info">Product not found</div>
        <button onClick={() => nav('/')} className="btn btn-primary mt-3">
          Go Home
        </button>
      </div>
    );
  }

  const isRental = product.isRental || product.rental?.pricePerDay;
  const price = isRental
    ? `₹${product.rental?.pricePerDay || 0}/day`
    : `₹${product.price || 0}`;
  
  const lowStockThreshold = product.lowStockThreshold || 10;
  const isLowStock = product.stock !== undefined && product.stock <= lowStockThreshold && product.stock > 0;
  const isOutOfStock = product.stock !== undefined && product.stock === 0;

  return (
    <>
      <div className="container">
        <button onClick={() => nav(-1)} className="btn btn-link mb-4" style={{ padding: 0, textDecoration: 'none' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back
        </button>

        <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
          <div className="col-12 col-md-6 mb-4 mb-md-0" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <div className="card shadow-sm">
              <div
                className="position-relative"
                style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)',
                  overflow: 'hidden',
                }}
              >
                {(product.image || (product.images && product.images[0])) ? (
                  <img
                    src={product.image || (product.images && product.images[0])}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <span style={{ fontSize: '4rem' }}>📦</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
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
    </>
  );
}
