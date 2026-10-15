import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';
import { openApiKeyModal, addToast } from '../redux/slices/uiSlice';
import {
  Compass,
  CalendarCheck,
  User,
  LogOut,
  KeyRound,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Radio
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const { items: myRegistrations } = useSelector((state) => state.registrations);
  const { isLiveApi } = useSelector((state) => state.events);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    dispatch(
      addToast({
        type: 'info',
        message: 'You have been logged out.'
      })
    );
    navigate('/login');
  };

  const confirmedCount = myRegistrations.filter((r) => r.status !== 'cancelled').length;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="page-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/events"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)'
            }}
          >
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              Event<span className="text-gradient">Sphere</span>
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              Ticketmaster Discovery
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/events"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            })}
          >
            <Compass size={18} />
            <span>Explore Events</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-events"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.925rem',
                fontWeight: 600,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                position: 'relative',
                transition: 'color var(--transition-fast)'
              })}
            >
              <CalendarCheck size={18} />
              <span>My Events</span>
              {confirmedCount > 0 && (
                <span
                  style={{
                    background: 'var(--gradient-brand)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    marginLeft: '2px'
                  }}
                >
                  {confirmedCount}
                </span>
              )}
            </NavLink>
          )}

          {/* API Key Status Pill */}
          <button
            onClick={() => dispatch(openApiKeyModal())}
            className="btn btn-outline btn-sm"
            style={{
              padding: '0.35rem 0.8rem',
              fontSize: '0.785rem',
              borderColor: isLiveApi ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
              background: isLiveApi ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              color: isLiveApi ? '#34d399' : '#fbbf24',
              borderRadius: 'var(--radius-full)'
            }}
            title="Click to configure Ticketmaster API Key"
          >
            <Radio size={12} className={isLiveApi ? '' : 'pulse'} />
            <span>{isLiveApi ? 'Live API' : 'Demo Mode'}</span>
            <KeyRound size={13} style={{ marginLeft: '2px' }} />
          </button>
        </nav>

        {/* Right Section: Auth buttons / User Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated && currentUser ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px 4px 4px',
                  color: 'var(--text-main)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    background: 'var(--primary)'
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <ChevronDown size={15} color="var(--text-muted)" />
              </button>

              {isDropdownOpen && (
                <div
                  className="glass-card animate-scale-up"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '220px',
                    padding: '0.5rem',
                    zIndex: 100
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '0.35rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.email}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <User size={16} /> Profile Details
                  </Link>

                  <Link
                    to="/my-events"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <CalendarCheck size={16} /> My Events ({confirmedCount})
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      dispatch(openApiKeyModal());
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      background: 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    <KeyRound size={16} /> API Key Settings
                  </button>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.35rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: '#f87171',
                      background: 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{
              background: 'transparent',
              color: 'var(--text-main)',
              padding: '6px',
              display: 'none'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Link
            to="/events"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontWeight: 600 }}
          >
            <Compass size={18} /> Explore Events
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-events"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontWeight: 600 }}
            >
              <CalendarCheck size={18} /> My Registered Events ({confirmedCount})
            </Link>
          )}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              dispatch(openApiKeyModal());
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: isLiveApi ? 'var(--color-success)' : 'var(--color-warning)',
              background: 'transparent',
              textAlign: 'left'
            }}
          >
            <KeyRound size={18} /> API Settings ({isLiveApi ? 'Live' : 'Demo'})
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
