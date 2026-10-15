import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2rem' }}>
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '1rem'
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          The page you are looking for doesn't exist or has moved. Let's get you back on track to exploring live events.
        </p>
        <Link to="/events" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Compass size={18} /> Explore Live Events
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
