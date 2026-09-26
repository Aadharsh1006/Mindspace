import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import Assessment from './components/Assessment';
import CopingHub from './components/CopingHub';
import Booking from './components/Booking';
import CounselorDashboard from './components/CounselorDashboard';
import AdminDashboard from './components/AdminDashboard';
import ThemeToggle from './components/ThemeToggle';
import { EXPRESS_URL } from './config/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState('THREAD_001');
  const [loading, setLoading] = useState(true);

  // Theme Management (Light vs Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mindcare_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mindcare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persistent Session Restoration
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('mindcare_token');
      const savedUser = localStorage.getItem('mindcare_user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Route initial active tab based on role
          if (parsedUser.role === 'counselor') setActiveTab('counselor');
          else if (parsedUser.role === 'admin') setActiveTab('admin');
          else setActiveTab('chat');

          if (parsedUser.role === 'student') {
            fetchChatThreads(parsedUser.student_id);
          }
        } catch (e) {
          localStorage.removeItem('mindcare_token');
          localStorage.removeItem('mindcare_user');
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const fetchChatThreads = async (studentId) => {
    try {
      const idToFetch = studentId || user?.student_id || user?.id;
      if (!idToFetch) return;
      const res = await axios.get(`${EXPRESS_URL}/api/chats/threads?student_id=${idToFetch}`);
      setThreads(res.data);
      if (res.data.length > 0) setActiveThreadId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    if (userProfile.role === 'counselor') setActiveTab('counselor');
    else if (userProfile.role === 'admin') setActiveTab('admin');
    else {
      setActiveTab('chat');
      fetchChatThreads(userProfile.student_id || userProfile.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mindcare_token');
    localStorage.removeItem('mindcare_user');
    setUser(null);
  };

  const handleNewChat = async () => {
    try {
      const currentStudentId = user?.student_id || user?.id;
      const res = await axios.post(`${EXPRESS_URL}/api/chats/threads`, {
        student_id: currentStudentId,
        title: 'New Discussion'
      });
      const newThread = res.data;
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      setActiveTab('chat');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await axios.delete(`${EXPRESS_URL}/api/chats/threads/${threadId}`);
      setThreads((prev) => {
        const filtered = prev.filter((t) => t.id !== threadId);
        if (activeThreadId === threadId) {
          if (filtered.length > 0) setActiveThreadId(filtered[0].id);
          else setActiveThreadId(null);
        }
        return filtered;
      });
    } catch (err) {
      console.error('Failed to delete thread:', err);
    }
  };

  const handleRenameThread = async (threadId, newTitle) => {
    try {
      const res = await axios.put(`${EXPRESS_URL}/api/chats/threads/${threadId}`, { title: newTitle });
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, title: res.data.title } : t))
      );
    } catch (err) {
      console.error('Failed to rename thread:', err);
    }
  };

  const handleThreadUpdated = (updatedThread) => {
    if (!updatedThread) return;
    setThreads((prev) => {
      const exists = prev.some((t) => t.id === updatedThread.id);
      if (exists) {
        return prev.map((t) => (t.id === updatedThread.id ? updatedThread : t));
      }
      return [updatedThread, ...prev];
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-muted)' }}>
        <p>Restoring MindSpace AI Session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', position: 'relative' }}>
        {/* Floating Theme Switcher on Auth Screen */}
        <ThemeToggle theme={theme} onToggleTheme={toggleTheme} variant="floating" />
        <AuthModal onLoginSuccess={handleLoginSuccess} theme={theme} onToggleTheme={toggleTheme} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', position: 'relative' }}>
      
      {/* Universal Floating Theme Switcher */}
      <ThemeToggle theme={theme} onToggleTheme={toggleTheme} variant="floating" />

      {/* ChatGPT / Claude AI Style Collapsible Left Sidebar */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={(id) => setActiveThreadId(id)}
        onNewChat={handleNewChat}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content View per Role */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '0 20px', minHeight: '100vh' }}>
        {/* Student Views */}
        {user.role === 'student' && activeTab === 'chat' && (
          <Chatbot user={user} activeThreadId={activeThreadId} onThreadUpdated={handleThreadUpdated} />
        )}
        {user.role === 'student' && activeTab === 'assessment' && (
          <Assessment user={user} />
        )}
        {user.role === 'student' && activeTab === 'coping' && (
          <CopingHub />
        )}
        {user.role === 'student' && activeTab === 'booking' && (
          <Booking user={user} />
        )}

        {/* Counselor Views */}
        {(user.role === 'counselor' || activeTab === 'counselor') && user.role !== 'admin' && (
          <CounselorDashboard user={user} />
        )}

        {/* Admin Views */}
        {(user.role === 'admin' || activeTab === 'admin') && (
          <AdminDashboard user={user} />
        )}
      </main>

    </div>
  );
}
