import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEvents,
  setKeyword,
  setCategory,
  setCity,
  setSort,
  setPage,
  resetFilters
} from '../redux/slices/eventsSlice';
import { openApiKeyModal } from '../redux/slices/uiSlice';
import EventCard from '../components/EventCard';
import {
  Search,
  SlidersHorizontal,
  Compass,
  Music,
  Trophy,
  Theater,
  Film,
  Sparkles,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Radio,
  KeyRound
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Sparkles },
  { name: 'Music', icon: Music },
  { name: 'Sports', icon: Trophy },
  { name: 'Arts & Theatre', icon: Theater },
  { name: 'Film', icon: Film }
];

const CITIES = [
  'All',
  'New York',
  'Los Angeles',
  'London',
  'Chicago',
  'Las Vegas',
  'Toronto',
  'Austin'
];

const Events = () => {
  const dispatch = useDispatch();
  const {
    items: events,
    loading,
    error,
    filters,
    pagination,
    isLiveApi
  } = useSelector((state) => state.events);

  const [searchInput, setSearchInput] = useState(filters.keyword);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, filters.category, filters.city, filters.sort, pagination.page]);

  // Debounced search dispatch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.keyword) {
        dispatch(setKeyword(searchInput));
        dispatch(fetchEvents());
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch, filters.keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setKeyword(searchInput));
    dispatch(fetchEvents());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setKeyword(''));
    dispatch(fetchEvents());
  };

  // Trending / Featured Event (first event from list)
  const featuredEvent = events && events.length > 0 ? events[0] : null;

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* API Notice Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: isLiveApi ? 'rgba(16, 185, 129, 0.08)' : 'rgba(99, 102, 241, 0.08)',
          border: `1px solid ${isLiveApi ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.25)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.25rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Radio size={16} color={isLiveApi ? 'var(--color-success)' : 'var(--primary)'} className="pulse" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isLiveApi ? (
              <>
                <strong style={{ color: 'var(--color-success)' }}>Live API Connected:</strong> Showing real-time Ticketmaster Discovery events worldwide.
              </>
            ) : (
              <>
                <strong style={{ color: 'var(--primary)' }}>Demo Showcase Mode:</strong> Displaying high-fidelity mock events matching the Ticketmaster API schema.
              </>
            )}
          </span>
        </div>
        <button
          onClick={() => dispatch(openApiKeyModal())}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.785rem', padding: '0.3rem 0.75rem' }}
        >
          <KeyRound size={13} /> {isLiveApi ? 'Manage API Key' : 'Add Ticketmaster API Key'}
        </button>
      </div>

      {/* Hero Header */}
      <section style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            letterSpacing: '0.04em'
          }}
        >
          <Sparkles size={14} /> LIVE EVENT MANAGEMENT PLATFORM
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            maxWidth: '850px',
            margin: '0 auto 1.25rem'
          }}
        >
          Discover & Register For <br />
          <span className="text-gradient">World-Class Live Experiences</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}
        >
          Explore concerts, sports showdowns, theatrical tours, and festivals powered by
          Ticketmaster. Reserve tickets and access your digital pass instantly.
        </p>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(17, 24, 39, 0.85)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 8px 6px 20px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <Search size={20} color="var(--text-dim)" style={{ flexShrink: 0, marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search by artist, event name, genre, or venue..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '6px',
                display: 'flex',
                marginRight: '6px'
              }}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.4rem' }}>
            Search
          </button>
        </form>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginTop: '2rem'
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => dispatch(setCategory(cat.name))}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.5rem 1.1rem',
                  fontSize: '0.85rem',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                }}
              >
                <Icon size={15} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary Filter Bar */}
      <section
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
            <SlidersHorizontal size={16} /> Filters:
          </div>

          {/* City Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>City:</span>
            <select
              className="form-select"
              value={filters.city}
              onChange={(e) => dispatch(setCity(e.target.value))}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Sort:</span>
            <select
              className="form-select"
              value={filters.sort}
              onChange={(e) => dispatch(setSort(e.target.value))}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto', borderRadius: 'var(--radius-sm)' }}
            >
              <option value="date,asc">Date (Soonest first)</option>
              <option value="date,desc">Date (Furthest first)</option>
              <option value="name,asc">Name (A — Z)</option>
            </select>
          </div>
        </div>

        {/* Results summary & Reset button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{events.length}</strong> {events.length === 1 ? 'event' : 'events'}
          </span>
          {(filters.keyword || filters.category !== 'All' || filters.city !== 'All') && (
            <button
              onClick={() => {
                setSearchInput('');
                dispatch(resetFilters());
                dispatch(fetchEvents());
              }}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.785rem' }}
            >
              <RefreshCw size={13} /> Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Events Grid / Loading / Error / Empty State */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-card"
              style={{
                height: '380px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                animation: 'pulseGlow 1.5s infinite ease-in-out'
              }}
            >
              <div style={{ height: '200px', background: 'rgba(255, 255, 255, 0.04)' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ height: '18px', width: '40%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', marginBottom: '12px' }} />
                <div style={{ height: '24px', width: '85%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', marginBottom: '12px' }} />
                <div style={{ height: '16px', width: '60%', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 2rem',
            marginBottom: '3rem',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <div style={{ color: 'var(--color-danger)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Unable to load events
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            {error}
          </p>
          <button onClick={() => dispatch(fetchEvents())} className="btn btn-primary btn-sm">
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      ) : events.length === 0 ? (
        <div
          className="glass-card animate-fade-in"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            marginBottom: '3rem'
          }}
        >
          <Compass size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No events found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.925rem' }}>
            We couldn't find any events matching your selected criteria. Try searching for different keywords or resetting your filters.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              dispatch(resetFilters());
              dispatch(fetchEvents());
            }}
            className="btn btn-primary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3rem'
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '2rem'
              }}
            >
              <button
                disabled={pagination.page === 0}
                onClick={() => dispatch(setPage(pagination.page - 1))}
                className="btn btn-secondary btn-sm"
                style={{ gap: '4px' }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Page <span style={{ color: 'var(--text-main)' }}>{pagination.page + 1}</span> of{' '}
                <span style={{ color: 'var(--text-main)' }}>{pagination.totalPages}</span>
              </div>

              <button
                disabled={pagination.page >= pagination.totalPages - 1}
                onClick={() => dispatch(setPage(pagination.page + 1))}
                className="btn btn-secondary btn-sm"
                style={{ gap: '4px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
