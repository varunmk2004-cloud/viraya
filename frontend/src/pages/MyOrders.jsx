import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/orders/my');
      setOrders(res.data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 
              className="h2 fw-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              My Orders
            </h1>
            <p className="text-muted mb-0">View your order history</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card shadow-sm text-center py-5" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3 className="h4 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Orders Yet
            </h3>
            <p className="text-muted mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">
              <FiShoppingBag style={{ marginRight: '0.5rem' }} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order._id} className="col-12">
                <div className="card shadow-sm" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FiPackage style={{ color: '#d4af37' }} />
                          <h5 className="fw-bold mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Order #{order._id.slice(-6)}
                          </h5>
                        </div>
                        <div className="text-muted small">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold fs-5 mb-2" style={{ color: '#d4af37' }}>
                          ₹{order.total?.toLocaleString() || 0}
                        </div>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success' : order.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="border-top pt-3">
                      <h6 className="fw-semibold mb-3">Order Items</h6>
                      <div className="row g-3">
                        {order.items?.map((item, idx) => {
                          const product = item.product;
                          const productImage = product?.image || (product?.images && product?.images[0]) || null;
                          return (
                            <div key={idx} className="col-12">
                              <div className="d-flex align-items-center gap-3">
                                {productImage ? (
                                  <img
                                    src={productImage}
                                    alt={product?.title}
                                    style={{
                                      width: '80px',
                                      height: '80px',
                                      objectFit: 'cover',
                                      borderRadius: '0.5rem',
                                      border: '1px solid #dee2e6'
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '80px',
                                      height: '80px',
                                      background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)',
                                      borderRadius: '0.5rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#94a3b8'
                                    }}
                                  >
                                    📦
                                  </div>
                                )}
                                <div style={{ flex: 1 }}>
                                  <Link
                                    to={`/product/${product?._id}`}
                                    className="text-decoration-none"
                                    style={{ color: 'inherit' }}
                                  >
                                    <h6 className="fw-semibold mb-1">{product?.title || 'Product'}</h6>
                                  </Link>
                                  <div className="text-muted small mb-1">
                                    Quantity: {item.qty} {item.type === 'rental' ? '(Rental)' : ''}
                                  </div>
                                  <div className="fw-semibold" style={{ color: '#d4af37' }}>
                                    ₹{((item.price || 0) * item.qty).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
