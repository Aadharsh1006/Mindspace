import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggleTheme, variant = 'floating' }) {
  const isDark = theme === 'dark';

  if (variant === 'sidebar') {
    return (
      <button
        onClick={onToggleTheme}
        type="button"
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          color: 'var(--text-main)',
          fontSize: '12.5px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDark ? (
            <Moon size={15} color="#818cf8" />
          ) : (
            <Sun size={15} color="#f59e0b" />
          )}
          <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
        </div>
        
        {/* Toggle Pill Track */}
        <div
          style={{
            width: '36px',
            height: '20px',
            borderRadius: '10px',
            background: isDark ? '#6366f1' : '#cbd5e1',
            position: 'relative',
            transition: 'background 0.25s ease'
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#ffffff',
              position: 'absolute',
              top: '2px',
              left: isDark ? '18px' : '2px',
              transition: 'left 0.25s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </button>
    );
  }

  // Default 'floating' variant (pinned top-right, visible on all pages)
  return (
    <button
      onClick={onToggleTheme}
      type="button"
      className="theme-floating-btn"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      style={{
        position: 'fixed',
        top: '18px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        color: 'var(--text-main)',
        fontSize: '12.5px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: isDark
          ? '0 4px 20px rgba(0, 0, 0, 0.4)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.25s ease'
      }}
    >
      {isDark ? (
        <>
          <Sun size={15} color="#fbbf24" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={15} color="#6366f1" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
