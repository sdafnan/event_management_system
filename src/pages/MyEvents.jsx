import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  cancelEventRegistration,
  deleteRegistrationRecord,
  setActivePassModal
} from '../redux/slices/registrationsSlice';
import { addToast } from '../redux/slices/uiSlice';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';

const MyEvents = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.auth);
  const { items: registrations } = useSelector((state) => state.registrations);

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'all'

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Categorize events by date
  const isEventUpcoming = (reg) => {
    if (reg.status === 'cancelled') return false;
    if (!reg.eventDate) return true;
    const eventD = new Date(reg.eventDate);
    return eventD >= today;
  };

  const isEventCompleted = (reg) => {
    if (reg.status === 'cancelled') return false;
    if (!reg.eventDate) return false;
    const eventD = new Date(reg.eventDate);
    return eventD < today;
  };

  const upcomingEvents = registrations.filter(isEventUpcoming);
  const completedEvents = registrations.filter(isEventCompleted);
  const cancelledEvents = registrations.filter((r) => r.status === 'cancelled');

  let displayedEvents = registrations;
  if (activeTab === 'upcoming') {
    displayedEvents = upcomingEvents;
  } else if (activeTab === 'completed') {
    displayedEvents = completedEvents;
  } else if (activeTab === 'cancelled') {
    displayedEvents = cancelledEvents;
  }

  const handleCancel = (regId, eventName) => {
    if (window.confirm(`Are you sure you want to cancel your registration for "${eventName}"?`)) {
      dispatch(cancelEventRegistration(regId));
      dispatch(
        addToast({
          type: 'info',
          message: `Registration for "${eventName}" was cancelled.`
        })
      );
    }
  };

  const handleDelete = (regId) => {
    if (window.confirm('Delete this registration record completely?')) {
      dispatch(deleteRegistrationRecord(regId));
      dispatch(
        addToast({
          type: 'info',
          message: 'Registration record removed.'
        })
      );
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Title & User Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CalendarCheck size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Registered Events</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your live attendance, download digital ticket passes, and track upcoming vs completed shows.
        </p>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Registrations
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>
            {registrations.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 600 }}>
            Upcoming Events
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--color-success)' }}>
            {upcomingEvents.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 600 }}>
            Completed Events
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--accent-cyan)' }}>
            {completedEvents.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 600 }}>
            Cancelled
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#f87171' }}>
            {cancelledEvents.length}
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Upcoming ({upcomingEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed / Past ({completedEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Registrations ({registrations.length})
        </button>

        {cancelledEvents.length > 0 && (
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`btn btn-sm ${activeTab === 'cancelled' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Cancelled ({cancelledEvents.length})
          </button>
        )}
      </div>

      {/* Registered Events List */}
      {displayedEvents.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            maxWidth: '520px',
            margin: '0 auto'
          }}
        >
          <Ticket size={46} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            No {activeTab} events found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {activeTab === 'upcoming'
              ? "You don't have any upcoming registered events scheduled right now."
              : 'No event records currently match this filter.'}
          </p>
          <Link to="/events" className="btn btn-primary btn-sm">
            Explore Available Events <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayedEvents.map((reg) => {
            const isCancelled = reg.status === 'cancelled';
            const isCompleted = isEventCompleted(reg);

            return (
              <div
                key={reg.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  padding: '1.25rem 1.5rem',
                  gap: '1.5rem',
                  opacity: isCancelled ? 0.75 : 1
                }}
              >
                {/* Event Thumbnail */}
                <div
                  style={{
                    width: '120px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#1f2937'
                  }}
                >
                  <img
                    src={reg.eventImage}
                    alt={reg.eventName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Event Specs */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                    <span className="badge badge-primary">{reg.eventCategory}</span>
                    {isCancelled ? (
                      <span className="badge badge-danger">Cancelled</span>
                    ) : isCompleted ? (
                      <span className="badge badge-subtle">Completed</span>
                    ) : (
                      <span className="badge badge-success">Upcoming</span>
                    )}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: 'var(--text-dim)',
                        marginLeft: 'auto'
                      }}
                    >
                      {reg.confirmationCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>
                    {reg.eventName}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      flexWrap: 'wrap',
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span>{reg.eventDate} ({reg.eventTime || 'Time TBA'})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--accent-pink)" />
                      <span>{reg.eventVenue}, {reg.eventCity}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ticket size={14} color="var(--color-warning)" />
                      <span>{reg.ticketCount} × {reg.ticketTier}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {!isCancelled && (
                    <button
                      onClick={() => dispatch(setActivePassModal(reg))}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Ticket size={15} /> View Digital Pass
                    </button>
                  )}

                  <Link to={`/events/${reg.eventId}`} className="btn btn-secondary btn-sm">
                    Details
                  </Link>

                  {!isCancelled ? (
                    <button
                      onClick={() => handleCancel(reg.id, reg.eventName)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#f87171' }}
                      title="Delete record"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
