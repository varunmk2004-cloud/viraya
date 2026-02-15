import React, { useState, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, padding: '1rem' }}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: <FiCheckCircle style={{ color: '#28a745' }} />,
    error: <FiXCircle style={{ color: '#dc3545' }} />,
    info: <FiInfo style={{ color: '#0dcaf0' }} />,
    warning: <FiAlertCircle style={{ color: '#ffc107' }} />,
  };

  const bgColors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#0dcaf0',
    warning: '#ffc107',
  };

  const textColor = toast.type === 'error' || toast.type === 'success' ? '#fff' : '#000';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      style={{
        backgroundColor: bgColors[toast.type],
        color: textColor,
        padding: '0.75rem 1.25rem',
        marginBottom: '0.5rem',
        borderRadius: '0.375rem',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        minWidth: '300px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}
    >
      <div style={{ marginRight: '0.5rem' }}>{icons[toast.type]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Notification</div>
        <div>{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: 0,
          lineHeight: 1
        }}
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
