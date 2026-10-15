import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/uiSlice';
import { UserPlus, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        addToast({
          type: 'success',
          message: 'Account created successfully! Welcome to EventSphere.'
        })
      );
      navigate('/events', { replace: true });
    }
  }, [isAuthenticated, navigate, dispatch]);

  const validate = () => {
    const errs = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email format.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errs.terms = 'You must accept the terms of service.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="page-wrapper" style={{ padding: '3.5rem 1rem', maxWidth: '520px' }}>
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
            <UserPlus size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join EventSphere to discover, save, and register for world-class events
          </p>
        </div>

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
            <label className="form-label" htmlFor="register-name">
              <span>Full Name</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-name"
                type="text"
                className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                }}
                style={{ paddingLeft: '2.6rem' }}
              />
              <User
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
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              <span>Email Address</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-email"
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
            <label className="form-label" htmlFor="register-password">
              <span>Password</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Min 6 characters</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
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

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              <span>Confirm Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-confirm-password"
                type="password"
                className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
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
            {fieldErrors.confirmPassword && <div className="form-error">{fieldErrors.confirmPassword}</div>}
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the EventSphere Terms of Service & Privacy Policy
            </label>
          </div>
          {fieldErrors.terms && <div className="form-error" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>{fieldErrors.terms}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            Create Account <ArrowRight size={18} />
          </button>
        </form>

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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
