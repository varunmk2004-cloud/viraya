import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const nav = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/cart');
      setCart(r.data);
    } catch (err) {
      showToast('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (pid) => {
    setUpdating({ ...updating, [pid]: true });
    try {
      await axios.delete(`/cart/remove/${pid}`);
      await loadCart();
      showToast('Item removed from cart', 'success');
    } catch (err) {
      showToast('Failed to remove item', 'error');
    } finally {
      setUpdating({ ...updating, [pid]: false });
    }
  };

  const updateQty = async (pid, newQty) => {
    if (newQty < 1) return;
    setUpdating({ ...updating, [pid]: true });
    try {
      await axios.put(`/cart/update/${pid}`, { qty: newQty });
      await loadCart();
    } catch (err) {
      showToast('Failed to update quantity', 'error');
    } finally {
      setUpdating({ ...updating, [pid]: false });
    }
  };

  const goCheckout = () => nav('/checkout');

  if (loading) {
    return <Loading fullScreen />;
  }

  const total = cart?.items.reduce((sum, item) => {
    const price = item.product.price || item.product.rental?.pricePerDay || 0;
    return sum + price * item.qty;
  }, 0) || 0;

  return (
    <>
      <div className="container">
      <h1 
        className="display-5 fw-bold mb-4 gold-accent"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Shopping Cart
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div 
          className="alert alert-info text-center py-5"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.05), rgba(42, 82, 152, 0.05))',
            border: '1px solid rgba(30, 60, 114, 0.2)',
          }}
        >
          <div className="display-1 mb-3" style={{ fontSize: '4rem' }}>
            <FiShoppingBag className="text-primary" />
          </div>
          <h3 
            className="h4 fw-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your cart is empty
          </h3>
          <p 
            className="mb-4"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem'
            }}
          >
            Start adding premium items to your cart
          </p>
          <Link to="/" className="btn btn-primary d-inline-flex align-items-center gap-2">
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 mb-4">
            {cart.items.map((i) => {
              const price = i.product.price || i.product.rental?.pricePerDay || 0;
              const itemTotal = price * i.qty;
              return (
                <div key={i._id} className="card mb-3 shadow-sm">
                  <div style={{ padding: '1rem' }}>
                    <div className="row align-items-center">
                      <div className="col-xs-3 col-sm-2">
                        <div
                          className="rounded"
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)',
                            overflow: 'hidden',
                          }}
                        >
                          {(i.product.image || (i.product.images && i.product.images[0])) ? (
                            <img
                              src={i.product.image || (i.product.images && i.product.images[0])}
                              alt={i.product.title}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <span style={{ fontSize: '2rem' }}>📦</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xs-9 col-sm-10">
                        <Link
                          to={`/product/${i.product._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h5 className="fw-bold mb-1">{i.product.title}</h5>
                        </Link>
                        <p className="text-muted small mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {i.product.description}
                        </p>
                        <div className="row align-items-center">
                          <div style={{ flex: '0 0 auto', width: 'auto' }}>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQty(i.product._id, i.qty - 1)}
                                disabled={updating[i.product._id] || i.qty <= 1}
                              >
                                <FiMinus />
                              </button>
                              <span className="fw-semibold" style={{ minWidth: '2rem', textAlign: 'center' }}>
                                {i.qty}
                              </span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => updateQty(i.product._id, i.qty + 1)}
                                disabled={updating[i.product._id]}
                              >
                                <FiPlus />
                              </button>
                            </div>
                          </div>
                          <div className="text-end" style={{ flex: 1 }}>
                            <div className="fw-bold fs-5">₹{itemTotal.toFixed(2)}</div>
                            <div className="text-muted small">₹{price} each</div>
                          </div>
                          <div style={{ flex: '0 0 auto', width: 'auto' }}>
                            <button
                              className="btn btn-link text-danger"
                              style={{ padding: 0 }}
                              onClick={() => remove(i.product._id)}
                              disabled={updating[i.product._id]}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ padding: '1rem' }}>
                <h2 className="h4 fw-bold mb-4">Order Summary</h2>
                <div className="mb-4">
                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted mb-3">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold fs-4 text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={goCheckout}
                  className="btn btn-primary w-100 mb-3"
                  style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                >
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    Proceed to Checkout <FiArrowRight />
                  </span>
                </button>
                <Link to="/" className="text-center d-block text-primary text-decoration-none fw-semibold">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
