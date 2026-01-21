import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const nav = useNavigate();
  const { showToast } = useToast();
  const { login } = React.useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) newErrors.name = 'Name can only contain letters and spaces';
    
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);
    setEmailExists(false);
    try {
      const res = await axios.post('/auth/register', { ...form, role: 'customer' });
      if (res.data.success) {
        setSuccess(true);
        showToast('Account created successfully! Redirecting to login...', 'success');
        
        if (res.data.data?.token && res.data.data?.user) {
          login(res.data.data.user, res.data.data.token, res.data.data.refreshToken);
          setTimeout(() => {
            nav('/');
            showToast('Welcome! You have been automatically logged in.', 'success');
          }, 2000);
        } else {
          setTimeout(() => {
            nav('/login');
          }, 2500);
        }
      } else {
        if (res.data.code === 'EMAIL_EXISTS' || res.data.message?.toLowerCase().includes('already exists')) {
          setEmailExists(true);
          showToast(res.data.message || 'An account with this email already exists.', 'error');
        } else {
          showToast(res.data.message || 'Registration failed. Please try again.', 'error');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          (err.response?.data?.errors && err.response.data.errors.map(e => e.message).join(', ')) ||
                          'Registration failed. Please try again.';
      
      if (err.response?.data?.code === 'EMAIL_EXISTS' || 
          err.response?.status === 400 && 
          (errorMessage.toLowerCase().includes('already exists') || 
           errorMessage.toLowerCase().includes('email'))) {
        setEmailExists(true);
        showToast(errorMessage, 'error');
      } else {
        setEmailExists(false);
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        <div className="row justify-content-center">
          <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow">
              <div className="p-5">
                <div className="text-center mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: success 
                        ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                        : 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                      boxShadow: success 
                        ? '0 4px 20px rgba(40, 167, 69, 0.3)'
                        : '0 4px 20px rgba(212, 175, 55, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {success ? (
                      <FiCheckCircle style={{ color: '#fff' }} size={28} />
                    ) : (
                      <FiUserPlus style={{ color: '#fff' }} size={28} />
                    )}
                  </div>
                  <h1 className="h2 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {success ? 'Account Created Successfully!' : 'Create Account'}
                  </h1>
                  <p className="text-muted" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    {success ? 'Your account has been created. Redirecting...' : 'Join us and start shopping today'}
                  </p>
                </div>

                {success && (
                  <div className="alert alert-success mb-4 d-flex align-items-center gap-2">
                    <FiCheckCircle size={20} />
                    <div>
                      <strong>Success!</strong> Your account has been created successfully. 
                      {form.email && <div className="small mt-1">Welcome, {form.name}!</div>}
                    </div>
                  </div>
                )}

                {emailExists && !success && (
                  <div className="alert alert-danger mb-4 d-flex align-items-start gap-2">
                    <FiAlertCircle size={20} style={{ marginTop: '0.25rem' }} />
                    <div className="flex-grow-1">
                      <strong>Account Already Exists</strong>
                      <div className="mt-1">
                        An account with the email <strong>{form.email}</strong> already exists. 
                        Please{' '}
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}>
                          sign in here
                        </Link>
                        {' '}or use a different email address.
                      </div>
                    </div>
                  </div>
                )}

                {!success && (
                <form onSubmit={submit}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="position-relative">
                      <FiUser className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    {errors.name && <div className="form-text text-danger">{errors.name}</div>}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <div className="position-relative">
                      <FiMail className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <div className="form-text text-danger">{errors.email}</div>}
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="position-relative">
                      <FiLock className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Create a password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>
                    {errors.password && <div className="form-text text-danger">{errors.password}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
                )}

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
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
