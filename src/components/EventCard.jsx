import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openRegisterModal } from '../redux/slices/uiSlice';
import { Calendar, MapPin, Tag, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: myRegistrations } = useSelector((state) => state.registrations);

  // Check if currently logged in user has already registered for this event
  const isRegistered = myRegistrations.some(
    (reg) => reg.eventId === event.id && reg.status !== 'cancelled'
  );

  // Helper for image extraction with priority to high-res or ratio
  const imageUrl =
    event.images?.find((img) => img.ratio === '16_9' && img.width > 500)?.url ||
    event.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop';

  // Helper for venue name & city
  const venue = event._embedded?.venues?.[0];
  const venueName = venue?.name || 'Venue TBA';
  const cityName = venue?.city?.name || venue?.country?.name || 'Global';

  // Category & segment
  const categoryName =
    event.classifications?.[0]?.segment?.name ||
    event.classifications?.[0]?.genre?.name ||
    'Live Event';

  // Format date
  const rawDate = event.dates?.start?.localDate;
  const rawTime = event.dates?.start?.localTime;
  let formattedDate = 'Date TBA';
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      formattedDate = rawDate;
    }
  }

  // Price range
  const priceMin = event.priceRanges?.[0]?.min;
  const priceMax = event.priceRanges?.[0]?.max;
  const currency = event.priceRanges?.[0]?.currency || 'USD';

  const handleQuickRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${event.id}` } } });
      return;
    }

    dispatch(openRegisterModal(event));
  };

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Event Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={event.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.1) 60%, transparent 100%)'
          }}
        />

        {/* Category Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className="badge badge-primary" style={{ background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(6px)' }}>
            {categoryName}
          </span>
        </div>

        {/* Already Registered Tag */}
        {isRegistered && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span className="badge badge-success" style={{ gap: '4px' }}>
              <CheckCircle2 size={12} /> Registered
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Date and Time Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--primary)',
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}
        >
          <Calendar size={14} />
          <span>{formattedDate}</span>
          {rawTime && <span style={{ color: 'var(--text-dim)' }}>• {rawTime.slice(0, 5)}</span>}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.65rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          title={event.name}
        >
          {event.name}
        </h3>

        {/* Venue & Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          <MapPin size={15} style={{ flexShrink: 0, color: 'var(--accent-pink)' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {venueName} — {cityName}
          </span>
        </div>

        {/* Price & Action Buttons */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.9rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Tickets from
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {priceMin ? `${currency} $${priceMin}` : 'See Details'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link
              to={`/events/${event.id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.45rem 0.75rem' }}
              title="View full details"
            >
              Details
            </Link>

            <button
              onClick={handleQuickRegister}
              className={`btn btn-sm ${isRegistered ? 'btn-secondary' : 'btn-primary'}`}
              style={{ padding: '0.45rem 0.85rem' }}
            >
              {isRegistered ? 'Manage' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
