import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { closeRegisterModal, addToast } from '../redux/slices/uiSlice';
import { registerForEvent } from '../redux/slices/registrationsSlice';
import {
  Ticket,
  X,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useModalAccessibility } from '../hooks/useModalAccessibility';

const RegistrationModal = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const navigate = useNavigate();

  const { isRegisterModalOpen, registerModalEvent } = useSelector((state) => state.ui);
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const userRegistrations = useSelector((state) => state.registrations.items);

  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketTier, setTicketTier] = useState('Standard Admission');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const closeModal = () => dispatch(closeRegisterModal());
  const dialogRef = useModalAccessibility(isRegisterModalOpen && Boolean(registerModalEvent), closeModal);

  // Prefill user data when modal opens
  useEffect(() => {
    if (currentUser) {
      setAttendeeName(currentUser.name || '');
      setAttendeeEmail(currentUser.email || '');
    }
    setErrorMsg('');
  }, [currentUser, isRegisterModalOpen]);

  if (!isRegisterModalOpen || !registerModalEvent) return null;

  const event = registerModalEvent;

  // Check if already registered
  const alreadyRegistered = userRegistrations.some(
    (r) => r.eventId === event.id && r.status !== 'cancelled'
  );

  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || 'Main Event Venue';
  const cityName = venue?.city?.name || 'TBA';
  const eventDate = event.dates?.start?.localDate || 'Date TBA';
  const eventTime = event.dates?.start?.localTime || 'Time TBA';
  const eventImage =
    event.images?.find((img) => img.ratio === '16_9')?.url ||
    event.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800';

  const categoryName =
    event.classifications?.[0]?.segment?.name || 'Live Event';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated || !currentUser) {
      dispatch(closeRegisterModal());
      navigate('/login', { state: { from: { pathname: `/events/${event.id}` } } });
      return;
    }

    if (!attendeeName.trim()) {
      setErrorMsg('Attendee name is required.');
      return;
    }

    if (!attendeeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail.trim())) {
      setErrorMsg('A valid email address is required for ticket delivery.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please accept the event registration terms.');
      return;
    }

    // Dispatch registration
    dispatch(
      registerForEvent({
        userId: currentUser.id,
        userEmail: attendeeEmail.trim(),
        userName: attendeeName.trim(),
        eventId: event.id,
        eventName: event.name,
        eventDate,
        eventTime,
        eventVenue: venueName,
        eventCity: cityName,
        eventImage,
        eventCategory: categoryName,
        ticketCount: Number(ticketCount),
        ticketTier,
        specialRequests
      })
    );

    const registrationError = store.getState().registrations.error;
    if (registrationError) {
      setErrorMsg(registrationError);
      dispatch(addToast({ type: 'error', message: registrationError }));
      return;
    }

    dispatch(closeRegisterModal());
    dispatch(
      addToast({
        type: 'success',
        message: `Registered successfully for ${event.name}! Your digital ticket pass is ready.`
      })
    );
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content animate-scale-up"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: '0' }}
      >
        {/* Header Header Image with Overlay */}
        <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
          <img
            src={eventImage}
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.4) 0%, #111827 100%)'
            }}
          />
          <button
            type="button"
            aria-label="Close event registration dialog"
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ position: 'absolute', bottom: '12px', left: '20px', right: '20px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '4px' }}>
              {categoryName}
            </span>
            <h3
              id="registration-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {event.name}
            </h3>
          </div>
        </div>

        <div style={{ padding: '1.75rem 2rem' }}>
          {/* Duplicate check warning */}
          {alreadyRegistered ? (
            <div
              style={{
                background: 'var(--color-warning-bg)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center'
              }}
            >
              <AlertCircle size={32} color="var(--color-warning)" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.4rem' }}>
                Already Registered!
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                You have already secured a registration for this event. Duplicate registrations are prohibited.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => dispatch(closeRegisterModal())}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    dispatch(closeRegisterModal());
                    navigate('/my-events');
                  }}
                >
                  View in My Events
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Event Quick Specs */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  fontSize: '0.825rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={15} color="var(--primary)" />
                  <span>{eventDate} {eventTime !== 'Time TBA' ? `at ${eventTime.slice(0, 5)}` : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="var(--accent-pink)" />
                  <span>{venueName}, {cityName}</span>
                </div>
              </div>

              {errorMsg && (
                <div
                  style={{
                    background: 'var(--color-danger-bg)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Attendee Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    data-dialog-initial-focus
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Ticket Recipient Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-qty">
                    <span>Quantity</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Max 10</span>
                  </label>
                  <select
                    id="reg-qty"
                    className="form-select"
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Ticket' : 'Tickets'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-tier">Ticket Tier / Category</label>
                  <select
                    id="reg-tier"
                    className="form-select"
                    value={ticketTier}
                    onChange={(e) => setTicketTier(e.target.value)}
                  >
                    <option value="Standard Admission">Standard Admission</option>
                    <option value="VIP Experience & Fast Track">VIP Experience & Fast Track</option>
                    <option value="Early Bird Pass">Early Bird Pass</option>
                    <option value="Student / General Concession">Student / General Concession</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-notes">
                  <span>Special Requests / Accessibility Notes</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Optional</span>
                </label>
                <input
                  id="reg-notes"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Wheelchair access, dietary requests, seating group..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="reg-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <label htmlFor="reg-terms" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  I confirm the registration details and accept the event attendance terms.
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => dispatch(closeRegisterModal())}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.6rem' }}>
                  <Sparkles size={16} /> Confirm Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
