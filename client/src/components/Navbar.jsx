import React from 'react';
import { Brain, MessageSquare, ClipboardList, HeartPulse, Calendar, LineChart, ShieldAlert, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, role, setRole }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '16px 32px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          }}>
            <Brain color="#ffffff" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: '700', background: 'linear-gradient(90deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MindCare AI — Student Wellness Platform
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Sri Krishna College of Engineering & Technology | CSE Dept (PWP-I)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: '#151c2c', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {role === 'student' ? (
            <>
              <button
                onClick={() => setActiveTab('chat')}
                style={navBtnStyle(activeTab === 'chat')}
              >
                <MessageSquare size={16} /> AI Chatbot
              </button>
              <button
                onClick={() => setActiveTab('assessment')}
                style={navBtnStyle(activeTab === 'assessment')}
              >
                <ClipboardList size={16} /> PHQ-9 / GAD-7 Quiz
              </button>
              <button
                onClick={() => setActiveTab('coping')}
                style={navBtnStyle(activeTab === 'coping')}
              >
                <HeartPulse size={16} /> Coping Hub
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                style={navBtnStyle(activeTab === 'booking')}
              >
                <Calendar size={16} /> Book Counselor
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('counselor')}
              style={navBtnStyle(activeTab === 'counselor')}
            >
              <ShieldAlert size={16} /> Counselor Triage Portal
            </button>
          )}
        </div>

        {/* Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Portal Mode:</span>
          <button
            onClick={() => {
              const newRole = role === 'student' ? 'counselor' : 'student';
              setRole(newRole);
              setActiveTab(newRole === 'student' ? 'chat' : 'counselor');
            }}
            style={{
              background: role === 'counselor' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              color: role === 'counselor' ? '#f43f5e' : '#6366f1',
              border: `1px solid ${role === 'counselor' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <UserCheck size={16} />
            {role === 'student' ? 'Switch to Counselor Portal' : 'Switch to Student View'}
          </button>
        </div>

      </div>
    </header>
  );
}

function navBtnStyle(isActive) {
  return {
    background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
    color: isActive ? '#ffffff' : '#94a3b8',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
  };
}
