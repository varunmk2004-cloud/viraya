import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, refreshToken, user } = res.data.data;
        login(user, token, refreshToken);
        showToast(res.data.message || 'Welcome back!', 'success');
        nav('/');
      } else {
        showToast(res.data.message || 'Login failed. Please try again.', 'error');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.msg || 'Login failed. Please try again.';
      showToast(errorMessage, 'error');
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
                      background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                      boxShadow: '0 4px 20px rgba(30, 60, 114, 0.3)',
                    }}
                  >
                    <FiLogIn style={{ color: '#fff' }} size={28} />
                  </div>
                  <h1 className="h2 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome Back</h1>
                  <p className="text-muted" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>Sign in to your account to continue</p>
                </div>

                <form onSubmit={submit}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <div className="position-relative">
                      <FiMail className="position-absolute translate-middle-y" style={{ color: '#6c757d', left: '0.75rem', top: '50%' }} />
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Sign up here
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
