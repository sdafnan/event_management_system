import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closePassModal } from '../redux/slices/registrationsSlice';
import {
  Ticket,
  X,
  Calendar,
  MapPin,
  QrCode,
  Printer,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

const DigitalPassModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activePassModal } = useSelector((state) => state.registrations);
  const closeModal = () => dispatch(closePassModal());
  const dialogRef = useModalAccessibility(Boolean(activePassModal), closeModal);

  if (!activePassModal) return null;

  const reg = activePassModal;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToMyEvents = () => {
    dispatch(closePassModal());
    navigate('/my-events');
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content animate-scale-up"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="digital-pass-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
          padding: '0.5rem'
        }}
      >
        {/* Ticket Container */}
        <div
          style={{
            background: 'linear-gradient(145deg, #161f36, #0d1322)',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25)',
            position: 'relative'
          }}
        >
          {/* Top Notch & Header */}
          <div
            style={{
              padding: '1.5rem 1.75rem 1rem',
              background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                <Ticket size={18} color="#fff" />
              </div>
              <div>
                <div id="digital-pass-modal-title" style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>
                  EVENT PASS
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  OFFICIAL DIGITAL REGISTRATION
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close digital pass dialog"
              onClick={closeModal}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-main)',
                borderRadius: '50%',
                padding: '6px',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '1.5rem 1.75rem' }}>
            {/* Status & Code */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <span className="badge badge-success" style={{ gap: '4px' }}>
                <CheckCircle2 size={13} /> {reg.status.toUpperCase()}
              </span>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  letterSpacing: '0.08em',
                  background: 'rgba(99, 102, 241, 0.12)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(99, 102, 241, 0.25)'
                }}
              >
                {reg.confirmationCode}
              </div>
            </div>

            {/* Event Name */}
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: '1rem',
                color: '#fff'
              }}
            >
              {reg.eventName}
            </h2>

            {/* Event Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Date & Time
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {reg.eventDate}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {reg.eventTime || 'Time TBA'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Location / Venue
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reg.eventVenue}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {reg.eventCity}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Attendee
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {reg.userName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {reg.userEmail}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Tickets / Tier
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {reg.ticketCount} × {reg.ticketTier}
                </div>
              </div>
            </div>

            {/* QR Code and Barcode Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                color: '#0f172a'
              }}
            >
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Scan at Entrance
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                  This pass is a visual preview only; its code graphics are not scannable for entry.
                </div>
                {/* Simulated Barcode lines */}
                <div style={{ display: 'flex', gap: '3px', marginTop: '8px', height: '28px', alignItems: 'stretch' }}>
                  {[4, 2, 5, 2, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 2, 4, 1, 3, 5, 2, 4].map((w, idx) => (
                    <div key={idx} style={{ width: `${w}px`, background: '#0f172a' }} />
                  ))}
                </div>
              </div>

              {/* QR Code Graphic */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  background: '#f8fafc',
                  border: '2px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <QrCode size={56} color="#0f172a" />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: '1rem 1.75rem 1.5rem',
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.45rem' }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button
              onClick={handleGoToMyEvents}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.45rem' }}
            >
              View in My Events <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPassModal;
