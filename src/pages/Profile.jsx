import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateUserProfile, logoutUser } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/uiSlice';
import {
  User,
  Mail,
  CalendarCheck,
  LogOut,
  Edit2,
  Check,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.auth);
  const { items: registrations } = useSelector((state) => state.registrations);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');

  if (!currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(updateUserProfile({ name: name.trim() }));
    setIsEditing(false);
    dispatch(addToast({ type: 'success', message: 'Profile updated successfully!' }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(addToast({ type: 'info', message: 'You have been signed out.' }));
    navigate('/login');
  };

  const confirmedCount = registrations.filter((r) => r.status !== 'cancelled').length;

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '3.5rem 1.5rem', maxWidth: '720px' }}>
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Profile Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              border: '3px solid var(--primary)',
              objectFit: 'cover',
              boxShadow: 'var(--shadow-glow)'
            }}
          />

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentUser.name}</h1>
              <span className="badge badge-primary">Active Member</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={15} /> {currentUser.email}
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Edit2 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSave}
            className="animate-fade-in"
            style={{
              padding: '1.5rem 0',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">Display Name</label>
              <input
                id="edit-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <Check size={16} /> Save Changes
            </button>
          </form>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.25rem',
            padding: '2rem 0'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Confirmed Events
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>
              {confirmedCount}
            </div>
            <Link
              to="/my-events"
              style={{
                fontSize: '0.825rem',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '6px'
              }}
            >
              View Registrations &rarr;
            </Link>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Session State
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              Redux + LocalStorage
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Session persists across page reloads
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>
            User ID: <code>{currentUser.id}</code>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
