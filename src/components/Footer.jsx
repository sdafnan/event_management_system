import React from 'react';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.95)',
        padding: '3rem 0 2rem',
        marginTop: 'auto'
      }}
    >
      <div className="page-wrapper">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Event<span className="text-gradient">Sphere</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              A next-generation live event management and discovery platform built with React, Redux Toolkit,
              and the Ticketmaster Discovery API v2.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Quick Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/events" style={{ color: 'var(--text-secondary)' }}>Explore Events</Link>
              </li>
              <li>
                <Link to="/my-events" style={{ color: 'var(--text-secondary)' }}>My Registered Events</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Account Sign In</Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Assignment & Course Info */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Academic Submission
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong>Course:</strong> Web Programming — Assignment 2</div>
              <div><strong>Instructor:</strong> Mahhek Tahir</div>
              <div><strong>Architecture:</strong> React.js, Redux Toolkit, React Router</div>
              <div><strong>API:</strong> Ticketmaster Discovery API v2</div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} EventSphere. Developed by Raja Omar. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://developer.ticketmaster.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}
            >
              Ticketmaster Developer Docs <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
