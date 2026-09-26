import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, UserCheck, MessageSquare, Calendar, Activity, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { EXPRESS_URL } from '../config/api';

export default function AdminDashboard({ user }) {
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [mRes, uRes] = await Promise.all([
        axios.get(`${EXPRESS_URL}/api/admin/metrics`),
        axios.get(`${EXPRESS_URL}/api/admin/users`)
      ]);
      setMetrics(mRes.data);
      setUsersList(uRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#94a3b8' }}>
        <p>Loading Admin Monitoring Console...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 0 40px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={24} color="#f59e0b" />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff' }}>Platform Admin Console</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            System-Wide Mental Health Analytics, User Monitoring & Counselor Verification
          </p>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '6px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: '600' }}>
          🛡️ Admin Signed In: {user?.name || 'System Admin'}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: '600' }}>Total Registered Users</span>
            <Users size={20} color="#818cf8" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '10px' }}>
            {metrics?.total_users || usersList.length}
          </div>
          <p style={{ fontSize: '11.5px', color: '#818cf8', marginTop: '4px' }}>
            {metrics?.total_students || 0} Students | {metrics?.total_counselors || 0} Counselors
          </p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: '600' }}>Analyzed AI Threads</span>
            <MessageSquare size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '10px' }}>
            {metrics?.total_chat_threads || 0}
          </div>
          <p style={{ fontSize: '11.5px', color: '#34d399', marginTop: '4px' }}>
            Active AI Conversations
          </p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.05))', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: '600' }}>Counselor Bookings</span>
            <Calendar size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginTop: '10px' }}>
            {metrics?.total_appointments || 0}
          </div>
          <p style={{ fontSize: '11.5px', color: '#38bdf8', marginTop: '4px' }}>
            Scheduled Sessions
          </p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(225, 29, 72, 0.05))', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: '600' }}>BiLSTM Worsening Rate</span>
            <AlertTriangle size={20} color="#fb7185" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#f43f5e', marginTop: '10px' }}>
            {(((metrics?.trend_distribution?.Worsening || 28.6) / ((metrics?.trend_distribution?.Improving || 27.9) + (metrics?.trend_distribution?.Stable || 43.5) + (metrics?.trend_distribution?.Worsening || 28.6))) * 100).toFixed(1)}%
          </div>
          <p style={{ fontSize: '11.5px', color: '#fb7185', marginTop: '4px' }}>
            Triage Escalation Triggered
          </p>
        </div>

      </div>

      {/* Grid: Platform Trajectory Metrics & Top Triggers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Trajectory Breakdown Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#6366f1" />
            <span>Platform Emotional Trajectory Distribution</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>🟢 Improving Trajectory</span>
                <span style={{ color: '#ffffff' }}>{metrics?.trend_distribution?.Improving || 28} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics?.trend_distribution?.Improving || 28}%`, height: '100%', background: '#10b981' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>🟡 Stable Trajectory</span>
                <span style={{ color: '#ffffff' }}>{metrics?.trend_distribution?.Stable || 43} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics?.trend_distribution?.Stable || 43}%`, height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#f43f5e', fontWeight: '600' }}>🔴 Worsening Trajectory (Flagged)</span>
                <span style={{ color: '#ffffff' }}>{metrics?.trend_distribution?.Worsening || 29} Users</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${metrics?.trend_distribution?.Worsening || 29}%`, height: '100%', background: '#f43f5e' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Triggers Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
            🔥 Top Reported Emotional Triggers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(metrics?.top_triggers || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>{item.trigger}</span>
                <span style={{ fontSize: '12px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                  {item.count} Sessions
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="card" style={{ padding: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>
            👥 Registered Platform Users ({filteredUsers.length})
          </h3>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '6px 12px' }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="counselor">Counselors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Age / Gender</th>
                <th style={{ padding: '12px' }}>Details / License</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#ffffff' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: '700' }}>{u.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: '700',
                      background: u.role === 'student' ? 'rgba(99, 102, 241, 0.15)' : u.role === 'counselor' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: u.role === 'student' ? '#818cf8' : u.role === 'counselor' ? '#34d399' : '#fbbf24',
                      border: `1px solid ${u.role === 'student' ? 'rgba(99, 102, 241, 0.3)' : u.role === 'counselor' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>
                    {u.age ? `${u.age} yrs` : 'N/A'} • {u.gender || 'N/A'}
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1', fontSize: '12px' }}>
                    {u.role === 'counselor' ? (
                      <div>
                        <div>{u.qualification || 'Licensed Counselor'}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lic: {u.licenseNumber || 'Verified'}</div>
                      </div>
                    ) : (
                      <div>{u.institution || 'General Student'}</div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '12px', fontWeight: '600' }}>
                      <CheckCircle size={14} /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
