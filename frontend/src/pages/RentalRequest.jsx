const text = encodeURIComponent(lines.join('\n'));
const phone = '7483425793';
window.open(`https://wa.me/${phone}?text=${text}`, '_blank');import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiCalendar, FiArrowLeft, FiClock, FiMessageCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

export default function RentalRequest() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ startDate: '', endDate: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { showToast } = useToast();
  const { user } = useContext(AuthContext);

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

  const validate = () => {
    const newErrors = {};
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate) newErrors.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const pricePerDay = product?.rental?.pricePerDay || 0;
    return days * pricePerDay;
  };

  const openWhatsApp = () => {
    const days = calculateDays();
    const pricePerDay = product?.rental?.pricePerDay || 0;
    const totalAmount = calculateTotal();
    const deposit = product?.rental?.deposit || 0;

    const lines = [
      'Hello, I would like to request a rental:',
      '',
      `Product: ${product?.title || ''}`,
      product?.category ? `Category: ${product.category}` : '',
      '',
      `Start date: ${form.startDate}`,
      `End date: ${form.endDate}`,
      `Days: ${days}`,
      '',
      `Price per day: ₹${pricePerDay}`,
      `Total amount: ₹${totalAmount.toFixed(2)}`,
      deposit ? `Deposit: ₹${deposit}` : '',
      '',
      user ? `Customer: ${user.name} (${user.email})` : '',
      'Please confirm availability and next steps.'
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const phone = '919480009349';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await axios.post('/rentals/request', {
        productId: id,
        startDate: form.startDate,
        endDate: form.endDate,
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save rental request, opening WhatsApp anyway', 'error');
    } finally {
      setSubmitting(false);
      openWhatsApp();
    }
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

  const days = calculateDays();
  const total = calculateTotal();

  return (
    <>
      <div className="container">
        <button onClick={() => nav(-1)} className="btn btn-link mb-4" style={{ padding: 0, textDecoration: 'none' }}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back
        </button>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="p-5">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <FiCalendar className="text-white" size={28} />
                  </div>
                  <h1 
                    className="h2 fw-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Request Rental
                  </h1>
                  <p className="text-muted">{product.title}</p>
                </div>

                {product.rental && (
                  <div className="alert alert-info mb-4">
                    <div className="row">
                      <div className="col">
                        <p className="mb-1 small fw-semibold">Rental Rate</p>
                        <p className="h4 fw-bold mb-0">
                          ₹{product.rental.pricePerDay} <span className="small fw-normal">/ day</span>
                        </p>
                      </div>
                      {product.rental.minDays && (
                        <div className="col text-end">
                          <p className="mb-1 small fw-semibold">Minimum Rental</p>
                          <p className="h5 fw-bold mb-0">{product.rental.minDays} days</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label fw-semibold">Start Date *</label>
                        <div className="position-relative">
                          <FiCalendar className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                          <input
                            type="date"
                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                            style={{ paddingLeft: '3rem' }}
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        {errors.startDate && <div className="form-text text-danger">{errors.startDate}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label fw-semibold">End Date *</label>
                        <div className="position-relative">
                          <FiCalendar className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                          <input
                            type="date"
                            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                            style={{ paddingLeft: '3rem' }}
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            min={form.startDate || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        {errors.endDate && <div className="form-text text-danger">{errors.endDate}</div>}
                      </div>
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="alert alert-light mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <FiClock className="text-primary" />
                          <span className="fw-semibold">Rental Duration</span>
                        </div>
                        <span className="h5 fw-bold mb-0">{days} days</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h6 fw-semibold text-muted">Total Amount</span>
                        <span className="display-6 fw-bold" style={{ color: '#d4af37' }}>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiMessageCircle style={{ marginRight: '0.5rem' }} /> Request Rental on WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
