import React, { useState } from 'react';
import { Plus, MessageSquare, ClipboardList, HeartPulse, Calendar, ShieldAlert, Shield, LogOut, Trash2, Edit2, Check, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  threads,
  activeThreadId,
  onSelectThread,
  onNewChat,
  onDeleteThread,
  onRenameThread,
  onLogout,
  theme,
  onToggleTheme
}) {
  const isLight = theme === 'light';
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startRenaming = (e, t) => {
    e.stopPropagation();
    setEditingThreadId(t.id);
    setEditingTitle(t.title);
  };

  const saveRenaming = (e, threadId) => {
    e.stopPropagation();
    if (editingTitle.trim() && onRenameThread) {
      onRenameThread(threadId, editingTitle.trim());
    }
    setEditingThreadId(null);
  };

  const cancelRenaming = (e) => {
    e.stopPropagation();
    setEditingThreadId(null);
  };

  const handleDelete = (e, threadId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat thread?')) {
      if (onDeleteThread) onDeleteThread(threadId);
    }
  };

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 90,
      padding: '16px',
      boxShadow: isLight ? '2px 0 12px rgba(0,0,0,0.03)' : 'none',
      transition: 'background-color 0.25s ease, border-color 0.25s ease'
    }}>
      
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '18px' }}>🧠</span>
        </div>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-heading)' }}>MindSpace AI</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Psychological Support Portal</p>
        </div>
      </div>

      {/* New Chat Button for Students */}
      {user?.role === 'student' && (
        <button
          onClick={onNewChat}
          style={{
            marginTop: '16px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: '#6366f1',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '10px 14px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Plus size={16} /> New Chat Thread
        </button>
      )}

      {/* Navigation Links based on Role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
        {user?.role === 'student' && (
          <>
            <button onClick={() => setActiveTab('chat')} style={navItemStyle(activeTab === 'chat', isLight)}>
              <MessageSquare size={16} /> AI Chatbot
            </button>
            <button onClick={() => setActiveTab('assessment')} style={navItemStyle(activeTab === 'assessment', isLight)}>
              <ClipboardList size={16} /> PHQ-9 / GAD-7 Quiz
            </button>
            <button onClick={() => setActiveTab('coping')} style={navItemStyle(activeTab === 'coping', isLight)}>
              <HeartPulse size={16} /> Coping Hub
            </button>
            <button onClick={() => setActiveTab('booking')} style={navItemStyle(activeTab === 'booking', isLight)}>
              <Calendar size={16} /> Book Counselor
            </button>
          </>
        )}

        {user?.role === 'counselor' && (
          <button onClick={() => setActiveTab('counselor')} style={navItemStyle(activeTab === 'counselor', isLight)}>
            <ShieldAlert size={16} /> Counselor Triage Queue
          </button>
        )}

        {user?.role === 'admin' && (
          <button onClick={() => setActiveTab('admin')} style={navItemStyle(activeTab === 'admin', isLight)}>
            <Shield size={16} color="#f59e0b" /> Admin Control Console
          </button>
        )}
      </div>

      {/* Chat Threads History (ChatGPT Style for Students) */}
      {user?.role === 'student' && threads && threads.length > 0 && (
        <div style={{ marginTop: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '4px' }}>
            Recent Conversations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {threads.map((t) => {
              const isSelected = activeThreadId === t.id && activeTab === 'chat';
              const isEditing = editingThreadId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => { onSelectThread(t.id); setActiveTab('chat'); }}
                  className="thread-item-container"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isSelected ? (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)') : 'transparent',
                    color: isSelected ? 'var(--text-heading)' : 'var(--text-muted)',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, overflow: 'hidden' }}>
                    <MessageSquare size={13} style={{ flexShrink: 0 }} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRenaming(e, t.id);
                          if (e.key === 'Escape') cancelRenaming(e);
                        }}
                        autoFocus
                        style={{
                          background: '#1e293b',
                          color: '#ffffff',
                          border: '1px solid #6366f1',
                          borderRadius: '4px',
                          fontSize: '12px',
                          padding: '2px 6px',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isSelected ? '600' : '400' }}>
                        {t.title}
                      </span>
                    )}
                  </div>

                  {/* Actions (Rename & Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => saveRenaming(e, t.id)}
                          title="Save title"
                          style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', padding: '2px' }}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={(e) => cancelRenaming(e)}
                          title="Cancel"
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                        >
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => startRenaming(e, t)}
                          title="Rename thread"
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', opacity: isSelected ? 1 : 0.6 }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, t.id)}
                          title="Delete thread"
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', opacity: isSelected ? 1 : 0.6 }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Area: Dedicated Theme Switcher & User Profile */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        
        {/* In-Sidebar Theme Switcher */}
        {onToggleTheme && (
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} variant="sidebar" />
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user?.role === 'admin' ? '#f59e0b' : user?.role === 'counselor' ? '#10b981' : '#6366f1', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.role || 'student'}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Log Out"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}

function navItemStyle(isActive, isLight) {
  return {
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease'
  };
}
