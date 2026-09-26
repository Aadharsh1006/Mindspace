import React, { useState } from 'react';
import axios from 'axios';
import { Brain, User, UserCheck, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { EXPRESS_URL } from '../config/api';

export default function AuthModal({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student'); // 'student' | 'counselor' | 'admin'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('Prefer not to say');
  const [institution, setInstitution] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicName, setClinicName] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isLogin
      ? `${EXPRESS_URL}/api/auth/login`
      : `${EXPRESS_URL}/api/auth/register`;

    const payload = isLogin
      ? { email, password }
      : {
          name,
          email,
          password,
          role,
          age: Number(age),
          gender,
          institution,
          qualification,
          experience,
          licenseNumber,
          clinicName
        };

    try {
      const res = await axios.post(url, payload);
      const { token, user } = res.data;

      // Claude / ChatGPT persistent long-term token storage
      localStorage.setItem('mindcare_token', token);
      localStorage.setItem('mindcare_user', JSON.stringify(user));

      onLoginSuccess(user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Shortcut Logins
  const handleQuickDemo = (demoType) => {
    let demoUser = null;
    let demoToken = 'DEMO_TOKEN_' + Date.now();

    if (demoType === 'student') {
      demoUser = {
        id: 'USER_001',
        name: 'Aadharsh R',
        email: 'student@mindspace.org',
        role: 'student',
        age: 21,
        gender: 'Male',
        student_id: 'STUDENT_0001'
      };
    } else if (demoType === 'counselor') {
      demoUser = {
        id: 'USER_COUNSELOR',
        name: 'Mr. R. Karunamoorthi',
        email: 'counselor@mindspace.org',
        role: 'counselor',
        age: 38,
        gender: 'Male',
        qualification: 'M.Sc. Clinical Psychology, CBT Specialist',
        experience: '12 Years',
        licenseNumber: 'PSY-88492',
        counselor_id: 'COUNSELOR_001'
      };
    } else if (demoType === 'admin') {
      demoUser = {
        id: 'USER_ADMIN',
        name: 'System Administrator',
        email: 'admin@mindspace.org',
        role: 'admin',
        age: 35
      };
    }

    localStorage.setItem('mindcare_token', demoToken);
    localStorage.setItem('mindcare_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '36px',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
          }}>
            <Brain color="#ffffff" size={30} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(90deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MindSpace AI
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Longitudinal Emotional Trajectory & Counseling Platform
          </p>
        </div>

        {/* Tab Switcher: Log In vs Sign Up */}
        <div style={{ display: 'flex', gap: '8px', background: '#0b0f19', padding: '4px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: isLogin ? '#6366f1' : 'transparent',
              color: isLogin ? 'white' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: !isLogin ? '#6366f1' : 'transparent',
              color: !isLogin ? 'white' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Tabs during Registration */}
        {!isLogin && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Select Account Type:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: `1px solid ${role === 'student' ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                  background: role === 'student' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: role === 'student' ? '#a5b4fc' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                👨‍🎓 Student / User
              </button>
              <button
                type="button"
                onClick={() => setRole('counselor')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: `1px solid ${role === 'counselor' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  background: role === 'counselor' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: role === 'counselor' ? '#6ee7b7' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                👩‍⚕️ Counselor
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {!isLogin && (
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Aadharsh R"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address *</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Student Specific Registration Fields */}
          {!isLogin && role === 'student' && (
            <>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Age *</label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    placeholder="20"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Gender</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Institution / University (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SKCET / General Student"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Counselor Specific Registration Fields */}
          {!isLogin && role === 'counselor' && (
            <>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Counselor Service Scope *</label>
                <select
                  value={institution && institution !== 'General' ? 'College' : 'General'}
                  onChange={(e) => setInstitution(e.target.value === 'College' ? 'SKCET' : 'General')}
                  style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                >
                  <option value="College">🎓 College-Dedicated Counselor (Assigned to a specific University)</option>
                  <option value="General">🌐 General / Public Counselor (Available to all Institutions)</option>
                </select>
              </div>

              {institution !== 'General' && (
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>College / University Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. SKCET, PSG Tech, MIT, Anna University"
                    value={institution === 'General' ? '' : institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Age *</label>
                  <input
                    type="number"
                    min="21"
                    max="90"
                    placeholder="35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Years of Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Qualification / Specialization *</label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc. Clinical Psychology, CBT Specialist"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>License Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. PSY-88492"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Room / Office Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Wellness Block 204"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account & Stay Logged In')}</span>
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginBottom: '10px', fontWeight: '600' }}>
            ⚡ 1-Click Instant Demo Login:
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleQuickDemo('student')}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: '6px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#a5b4fc',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👨‍🎓 Student Demo
            </button>

            <button
              onClick={() => handleQuickDemo('counselor')}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#6ee7b7',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👩‍⚕️ Counselor Demo
            </button>

            <button
              onClick={() => handleQuickDemo('admin')}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#fcd34d',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '16px' }}>
          🔒 Session saved securely. Auto-logs in on return.
        </p>

      </div>
    </div>
  );
}
