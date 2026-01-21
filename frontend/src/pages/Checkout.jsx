import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiCreditCard, FiMapPin, FiUser, FiMail, FiPhone, FiCheck } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
  });
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
      nav('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.post('/orders/checkout', form);
      showToast('Order placed successfully!', 'success');
      setTimeout(() => nav('/'), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setProcessing(false);
    }
  };

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
          Checkout
        </h1>

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm">
              <div className="p-4">
                <h2 className="h4 fw-bold mb-4 d-flex align-items-center gap-2">
                  <FiMapPin className="text-primary" /> Shipping Information
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">Full Name *</label>
                        <div className="position-relative">
                          <FiUser className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                          <input
                            type="text"
                            className="form-control"
                            style={{ paddingLeft: '3rem' }}
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">Email *</label>
                        <div className="position-relative">
                          <FiMail className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                          <input
                            type="email"
                            className="form-control"
                            style={{ paddingLeft: '3rem' }}
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <div className="position-relative">
                      <FiPhone className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                      <input
                        type="tel"
                        className="form-control"
                        style={{ paddingLeft: '3rem' }}
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Address *</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">ZIP Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={form.zipCode}
                          onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-4 mb-4">
                    <h3 className="h5 fw-semibold mb-3 d-flex align-items-center gap-2">
                      <FiCreditCard className="text-primary" /> Payment Method
                    </h3>
                    <div className="form-check mb-2" style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="payment-card"
                        name="payment"
                        value="card"
                        checked={form.paymentMethod === 'card'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="payment-card">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="form-check" style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="payment-cod"
                        name="payment"
                        value="cod"
                        checked={form.paymentMethod === 'cod'}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="payment-cod">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <strong>Note:</strong> This is a demo checkout. Replace with Stripe/PayPal integration for production.
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck style={{ marginRight: '0.5rem' }} /> Place Order
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ padding: '1rem' }}>
                <h2 className="h4 fw-bold mb-4">Order Summary</h2>
                <div className="mb-4">
                  {cart?.items.map((item) => {
                    const price = item.product.price || item.product.rental?.pricePerDay || 0;
                    return (
                      <div key={item._id} className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">
                          {item.product.title} × {item.qty}
                        </span>
                        <span className="fw-medium">₹{(price * item.qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                <hr />
                <div className="mb-2">
                  <div className="d-flex justify-content-between text-muted mb-2">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-muted mb-3">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold fs-5">Total</span>
                      <span className="fw-bold fs-4" style={{ color: '#d4af37' }}>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
