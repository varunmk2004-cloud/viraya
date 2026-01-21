import React from 'react';

export default function Loading({ size = 'md', fullScreen = false }) {
  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
  };

  const spinnerSize = sizeMap[size];

  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem'
      };

  return (
    <div style={containerStyle}>
      <div
        className="spinner-border"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderColor: '#d4af37',
          borderRightColor: 'transparent'
        }}
      />
    </div>
  );
}
