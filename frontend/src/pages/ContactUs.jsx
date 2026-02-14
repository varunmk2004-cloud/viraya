import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle, FiUser, FiFileText } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Thank you! Your message has been sent successfully.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <>
      <div>
      {/* Hero Section */}
      <div
        className="rounded-0 mb-5 text-white position-relative overflow-hidden slow-motion"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          padding: '80px 40px',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          className="position-absolute top-0 left-0 w-100 h-100"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231e3c72\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        ></div>
        <div className="mx-auto text-center animate-fade-in-up" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                boxShadow: '0 4px 20px rgba(30, 60, 114, 0.4)',
              }}
            >
              <FiMessageCircle size={40} style={{ color: '#ffffff' }} />
            </div>
          </div>
          <h1 
            className="display-4 fw-bold mb-3"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            Get In Touch
          </h1>
          <p 
            className="lead mb-0"
            style={{ 
              opacity: 0.95,
              fontSize: '1.25rem',
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: '0.05em',
            }}
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="row g-4">
          {/* Contact Information */}
          <div className="col-md-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card h-100 shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
                <div className="p-4">
                  <h3 
                    className="h4 fw-bold mb-4 gold-accent"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Contact Information
                  </h3>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                        }}
                      >
                        <FiMail style={{ color: '#ffffff' }} size={20} />
                      </div>
                      <div>
                        <h5 className="fw-semibold mb-1">Email</h5>
                        <p className="text-muted mb-0">virayaproductionspvtltd@gmail.com</p>
                        <p className="text-muted mb-0">support@virayaproductions.com</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                        }}
                      >
                        <FiPhone style={{ color: '#ffffff' }} size={20} />
                      </div>
                      <div>
                        <h5 className="fw-semibold mb-1">Phone</h5>
                        <p className="text-muted mb-0">+919113869169</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                        }}
                      >
                        <FiMapPin style={{ color: '#ffffff' }} size={20} />
                      </div>
                      <div>
                        <h5 className="fw-semibold mb-1">Address</h5>
                        <p className="text-muted mb-0">
                          Shop no. <br />
                          APMC Market<br />
                          Amargol,Hubballi<br />
                          Karnataka India
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3" style={{ borderTop: '1px solid rgba(30, 60, 114, 0.2)' }}>
                    <h5 className="fw-semibold mb-3">Business Hours</h5>
                    <div className="text-muted small">
                      <p className="mb-2"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                      <p className="mb-2"><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                      <p className="mb-0"><strong>Sunday:</strong> Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-8">
            <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
              <div className="p-5">
                <h3 
                  className="h4 fw-bold mb-4 gold-accent"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Send Us a Message
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">Full Name *</label>
                        <div className="position-relative">
                          <FiUser className="position-absolute translate-middle-y" style={{ color: '#6c757d', zIndex: 10, left: '0.75rem', top: '50%' }} />
                          <input
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            style={{ paddingLeft: '3rem', border: '1px solid #e8e0d1', fontSize: '1rem', padding: '0.875rem 1rem' }}
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.name && <div className="form-text text-danger">{errors.name}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">Email Address *</label>
                        <div className="position-relative">
                          <FiMail className="position-absolute translate-middle-y" style={{ color: '#6c757d', zIndex: 10, left: '0.75rem', top: '50%' }} />
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            style={{ paddingLeft: '3rem', border: '1px solid #e8e0d1', fontSize: '1rem', padding: '0.875rem 1rem' }}
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.email && <div className="form-text text-danger">{errors.email}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Subject *</label>
                    <div className="position-relative">
                      <FiFileText className="position-absolute translate-middle-y" style={{ color: '#6c757d', zIndex: 10, left: '0.75rem', top: '50%' }} />
                      <input
                        type="text"
                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '3rem', border: '1px solid #e8e0d1', fontSize: '1rem', padding: '0.875rem 1rem' }}
                        name="subject"
                        placeholder="What is this regarding?"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.subject && <div className="form-text text-danger">{errors.subject}</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label fw-semibold">Message *</label>
                    <textarea
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      rows={6}
                      name="message"
                      placeholder="Tell us more about your enquiry..."
                      value={form.message}
                      onChange={handleChange}
                      style={{
                        border: '1px solid #e8e0d1',
                        fontSize: '1rem',
                        padding: '0.875rem 1rem',
                        resize: 'vertical',
                      }}
                    />
                    {errors.message && <div className="form-text text-danger">{errors.message}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend style={{ marginRight: '0.5rem' }} />
                        Send Message
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
