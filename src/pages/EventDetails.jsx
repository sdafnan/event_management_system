import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventById, clearSelectedEvent } from '../redux/slices/eventsSlice';
import { openRegisterModal, addToast } from '../redux/slices/uiSlice';
import {
  setActivePassModal,
  cancelEventRegistration
} from '../redux/slices/registrationsSlice';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  DollarSign,
  Info,
  AlertTriangle,
  ArrowLeft,
  Ticket,
  CheckCircle2,
  ExternalLink,
  Share2,
  Building2,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent: event, detailsLoading: loading, detailsError: error } = useSelector(
    (state) => state.events
  );
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const { items: userRegistrations } = useSelector((state) => state.registrations);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [id, dispatch]);

  // Check if currently registered
  const activeRegistration = userRegistrations.find(
    (r) => r.eventId === id && r.status !== 'cancelled'
  );

  if (loading) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading event details from Ticketmaster Discovery...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
          <AlertTriangle size={42} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Event Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || "The requested event could not be found or has expired."}
          </p>
          <Link to="/events" className="btn btn-primary btn-sm">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Extract venue details
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || 'Venue TBA';
  const venueAddress = venue?.address?.line1 || '';
  const cityName = venue?.city?.name || '';
  const stateName = venue?.state?.name || venue?.state?.stateCode || '';
  const countryName = venue?.country?.name || '';
  const postalCode = venue?.postalCode || '';

  // Extract date & time
  const rawDate = event.dates?.start?.localDate;
  const rawTime = event.dates?.start?.localTime;
  const timezone = event.dates?.timezone || 'Local Time';

  let formattedDate = 'Date TBA';
  let daysToGo = null;
  if (rawDate) {
    try {
      const target = new Date(rawDate);
      formattedDate = target.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const diffTime = target - new Date();
      daysToGo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      formattedDate = rawDate;
    }
  }

  // Image extraction
  const heroImage =
    event.images?.find((img) => img.width >= 1000)?.url ||
    event.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200';

  // Categories
  const segment = event.classifications?.[0]?.segment?.name || 'Live Event';
  const genre = event.classifications?.[0]?.genre?.name;
  const subGenre = event.classifications?.[0]?.subGenre?.name;

  // Pricing
  const priceMin = event.priceRanges?.[0]?.min;
  const priceMax = event.priceRanges?.[0]?.max;
  const currency = event.priceRanges?.[0]?.currency || 'USD';

  // Registration handler
  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${event.id}` } } });
      return;
    }
    dispatch(openRegisterModal(event));
  };

  const handleCancelRegistration = () => {
    if (window.confirm('Are you sure you want to cancel your registration for this event?')) {
      dispatch(cancelEventRegistration(activeRegistration.id));
      dispatch(
        addToast({
          type: 'info',
          message: 'Your registration has been cancelled.'
        })
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Check out ${event.name} on EventSphere!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      dispatch(addToast({ type: 'success', message: 'Event link copied to clipboard!' }));
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/events" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Event Exploration
        </Link>
        <button onClick={handleShare} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Share2 size={15} /> Share Event
        </button>
      </div>

      {/* Hero Banner Card */}
      <div
        className="glass-card"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ height: '360px', width: '100%', position: 'relative' }}>
          <img
            src={heroImage}
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 15, 25, 1) 0%, rgba(11, 15, 25, 0.4) 50%, rgba(11, 15, 25, 0.2) 100%)'
            }}
          />

          {/* Badges on Banner */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-primary" style={{ padding: '0.35rem 0.85rem' }}>
              {segment}
            </span>
            {genre && (
              <span className="badge badge-subtle" style={{ padding: '0.35rem 0.85rem' }}>
                {genre}
              </span>
            )}
            {daysToGo !== null && daysToGo > 0 && (
              <span className="badge badge-warning" style={{ padding: '0.35rem 0.85rem' }}>
                In {daysToGo} Days
              </span>
            )}
          </div>
        </div>

        {/* Hero Title & Primary Call-To-Action Box */}
        <div style={{ padding: '2rem 2.5rem', marginTop: '-60px', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                {event.name}
              </h1>

              {/* Sub-headline / Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building2 size={16} color="var(--primary)" />
                  <span>{venueName}</span>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={16} color="var(--accent-pink)" />
                  <span>{cityName ? `${cityName}, ${countryName}` : countryName}</span>
                </div>
              </div>
            </div>

            {/* Registration Status / Action Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minWidth: '260px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Admission</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {priceMin != null
                    ? `${formatCurrency(priceMin, currency)}${priceMax != null ? ` - ${formatCurrency(priceMax, currency)}` : ''}`
                    : 'Free / Available'}
                </span>
              </div>

              {activeRegistration ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      background: 'var(--color-success-bg)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={15} /> You have registered for this event!
                  </div>
                  <button
                    onClick={() => dispatch(setActivePassModal(activeRegistration))}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Ticket size={16} /> View Digital Ticket Pass
                  </button>
                  <button
                    onClick={handleCancelRegistration}
                    className="btn btn-danger btn-sm"
                    style={{ width: '100%', fontSize: '0.785rem' }}
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', gap: '0.5rem' }}
                >
                  <Ticket size={18} /> Register for Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {/* Left Column: Event Specs & Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Date, Time & Schedule Box */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary)" /> Date & Schedule
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Date</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{formattedDate}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Start Time</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>
                  {rawTime ? `${rawTime.slice(0, 5)} (${timezone})` : 'Doors Open TBA'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Ticket Status</div>
                <div style={{ marginTop: '4px' }}>
                  <span className="badge badge-success">
                    {event.dates?.status?.code || 'On Sale'}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Classification</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {segment} {genre ? `• ${genre}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Important Notes */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} color="var(--accent-cyan)" /> Event Overview
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              {event.info ||
                event.description ||
                `Join thousands of live enthusiasts for ${event.name}. An unforgettable live production organized in partnership with world-class performers and venues.`}
            </p>

            {event.pleaseNote && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  display: 'flex',
                  gap: '0.75rem'
                }}
              >
                <AlertTriangle size={18} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-warning)' }}>Please Note:</strong> {event.pleaseNote}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Venue, Map & Ticketmaster Direct Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Venue Location Details */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--accent-pink)" /> Venue & Location
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{venueName}</div>
              {venueAddress && <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{venueAddress}</div>}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {[cityName, stateName, postalCode, countryName].filter(Boolean).join(', ')}
              </div>
            </div>

            {/* Directions link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${venueName} ${venueAddress} ${cityName} ${countryName}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ width: '100%', gap: '0.5rem', marginBottom: '1rem' }}
            >
              <Compass size={15} /> Get Directions on Google Maps <ExternalLink size={13} />
            </a>

            {venue?.boxOfficeInfo?.openHoursDetail && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <strong>Box Office:</strong> {venue.boxOfficeInfo.openHoursDetail}
              </div>
            )}
          </div>

          {/* Official Ticketmaster Booking Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#fff' }}>
              Official Ticket Source
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              This event is indexed via Ticketmaster Discovery API v2. You can register for our local attendee list above or inspect the primary commercial ticketing page on Ticketmaster.
            </p>

            <a
              href={event.url || 'https://www.ticketmaster.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              Open on Ticketmaster.com <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
