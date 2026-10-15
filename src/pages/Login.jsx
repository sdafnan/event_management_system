import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/uiSlice';
import { LogIn, Mail, Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Route to return to after logging in (e.g. from an event details page or /my-events)
  const from = location.state?.from?.pathname || '/events';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginUser({ email, password }));
  };

  // Quick fill demo user credentials
  const handleQuickFillDemo = () => {
    setEmail('alex@example.com');
    setPassword('password123');
    setFieldErrors({});
    dispatch(clearAuthError());
  };

  return (
    <div className="page-wrapper" style={{ padding: '3.5rem 1rem', maxWidth: '480px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <LogIn size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to manage and register for your events
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              color: '#fca5a5',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              <span>Email Address</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-email"
                type="email"
                className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
                style={{ paddingLeft: '2.6rem' }}
              />
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />
            </div>
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type="password"
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
                style={{ paddingLeft: '2.6rem' }}
              />
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)'
                }}
              />
            </div>
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Fill Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleQuickFillDemo}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.825rem', gap: '0.4rem' }}
          >
            <Sparkles size={15} color="var(--primary)" />
            Fill Demo Account (alex@example.com)
          </button>
        </div>

        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}
        >
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
