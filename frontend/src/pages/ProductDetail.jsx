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

  const goRental = () => nav(`/rental/${id}`);

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
                <span className="display-6 fw-bold" style={{ color: '#d4af37' }}>{price}</span>
                {!isRental && product.originalPrice && (
                  <span className="h4 text-muted text-decoration-line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

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
                </div>
              )}

              <div className="pt-4 border-top">
                {!isRental ? (
                  <button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="btn btn-primary w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
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
