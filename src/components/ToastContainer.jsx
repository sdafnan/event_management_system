import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../redux/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass} animate-fade-in`}>
            <Icon size={20} className="toast-icon" />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
