import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeApiKeyModal, addToast } from '../redux/slices/uiSlice';
import { updateApiKey, fetchEvents } from '../redux/slices/eventsSlice';
import { KeyRound, X, Check, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

const ApiKeyModal = () => {
  const dispatch = useDispatch();
  const { isApiKeyModalOpen } = useSelector((state) => state.ui);
  const { activeApiKey, isLiveApi } = useSelector((state) => state.events);
  const [inputKey, setInputKey] = useState(activeApiKey || '');

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    dispatch(updateApiKey(inputKey.trim()));
    dispatch(closeApiKeyModal());
    dispatch(fetchEvents());
    dispatch(
      addToast({
        type: 'success',
        message: inputKey.trim()
          ? 'Ticketmaster API key updated! Refreshing live events...'
          : 'Using Demo Mode with curated events data.'
      })
    );
  };

  const handleClear = () => {
    setInputKey('');
    dispatch(updateApiKey(''));
    dispatch(closeApiKeyModal());
    dispatch(fetchEvents());
    dispatch(
      addToast({
        type: 'info',
        message: 'Reverted to offline Demo Mode.'
      })
    );
  };

  return (
    <div className="modal-backdrop" onClick={() => dispatch(closeApiKeyModal())}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Ticketmaster API Key</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Configure live Ticketmaster Discovery API v2
              </p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeApiKeyModal())}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '6px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            background: isLiveApi ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isLiveApi ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <ShieldCheck size={20} color={isLiveApi ? 'var(--color-success)' : 'var(--color-warning)'} />
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600, color: isLiveApi ? 'var(--color-success)' : 'var(--color-warning)' }}>
              Status: {isLiveApi ? 'Connected to Live Ticketmaster API' : 'Demo Mode (Sample Events Active)'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.785rem' }}>
              {isLiveApi
                ? 'Your queries are requesting live events worldwide.'
                : 'Showing rich mock events. You can provide an API key to switch to live data.'}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="apiKeyInput">
            <span>API Consumer Key</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Stored in localStorage</span>
          </label>
          <input
            id="apiKeyInput"
            type="text"
            className="form-input"
            placeholder="Paste your Ticketmaster API Key..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
          />
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
            Need an API key?
          </div>
          <ol style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: 1.5 }}>
            <li>Register at the official portal.</li>
            <li>Go to "My Apps" and create a free application.</li>
            <li>Copy your "Consumer Key" and paste it above.</li>
          </ol>
          <a
            href="https://developer.ticketmaster.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '0.6rem',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            Open Ticketmaster Developer Portal <ExternalLink size={13} />
          </a>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {activeApiKey && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClear}>
              Reset to Demo Mode
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Check size={16} /> Save & Apply Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
