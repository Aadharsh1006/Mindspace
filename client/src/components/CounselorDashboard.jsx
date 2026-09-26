import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Users, Calendar, AlertCircle, CheckCircle, Search, Video, FileText, Send, X, RefreshCw, UserCheck, Clock, Building } from 'lucide-react';
import { EXPRESS_URL } from '../config/api';

export default function CounselorDashboard({ user }) {
  const counselorName = user?.name || 'Dr. Counselor';
  const counselorCollege = user?.institution || 'University Campus';
  const counselorTitle = user?.qualification || 'Licensed Counselor';
  const counselorLicense = user?.licenseNumber || 'PSY-88492';
  const counselorRoom = user?.clinicName || 'Counseling Suite';

  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Confirmed' | 'Completed' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Student Case File Modal State
  const [selectedStudentCaseFile, setSelectedStudentCaseFile] = useState(null);
  const [loadingCaseFile, setLoadingCaseFile] = useState(false);

  // Clinical Notes Modal State
  const [editingNotesApt, setEditingNotesApt] = useState(null);
  const [clinicalNotesText, setClinicalNotesText] = useState('');

  // Emergency Outreach Modal State
  const [outreachModalStudent, setOutreachModalStudent] = useState(null);
  const [outreachDate, setOutreachDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [outreachTime, setOutreachTime] = useState('10:00 AM');
  const [outreachNote, setOutreachNote] = useState('Immediate supportive consultation requested based on emotional risk trajectory.');

  useEffect(() => {
    fetchDashboardData();
  }, [counselorName]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // STRICT PRIVACY: Fetch ONLY appointments assigned to THIS counselor
      const [triageRes, aptRes] = await Promise.all([
        axios.get(`${EXPRESS_URL}/api/counselor/triage`),
        axios.get(`${EXPRESS_URL}/api/appointments?scope=my&counselor_name=${encodeURIComponent(counselorName)}`)
      ]);
      setAtRiskStudents(triageRes.data || []);
      setAppointments(aptRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (aptId, newStatus) => {
    try {
      await axios.put(`${EXPRESS_URL}/api/appointments/${aptId}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesApt) return;
    try {
      await axios.put(`${EXPRESS_URL}/api/appointments/${editingNotesApt.id}`, { notes: clinicalNotesText });
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingNotesApt.id ? { ...a, notes: clinicalNotesText } : a))
      );
      setEditingNotesApt(null);
      alert('Clinical consultation notes saved successfully.');
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleOpenCaseFile = async (studentId) => {
    setLoadingCaseFile(true);
    try {
      const res = await axios.get(`${EXPRESS_URL}/api/counselor/student-casefile/${studentId}`);
      setSelectedStudentCaseFile(res.data);
    } catch (err) {
      console.error('Failed to load student case file:', err);
    } finally {
      setLoadingCaseFile(false);
    }
  };

  const handleSendOutreach = async (e) => {
    e.preventDefault();
    if (!outreachModalStudent) return;

    try {
      const res = await axios.post(`${EXPRESS_URL}/api/appointments`, {
        student_id: outreachModalStudent,
        student_name: outreachModalStudent,
        counselor_name: counselorName,
        date: outreachDate,
        time: outreachTime,
        topic: 'Urgent Counselor Supportive Outreach',
        institution: counselorCollege
      });

      if (res.data && res.data.appointment) {
        setAppointments((prev) => [res.data.appointment, ...prev]);
        alert(`Emergency outreach invitation dispatched to ${outreachModalStudent}.`);
        setOutreachModalStudent(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule outreach.');
    }
  };

  // Filtered Appointments list
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (apt.student_name && apt.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.student_id && apt.student_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.topic && apt.topic.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const highCrisisCount = atRiskStudents.filter(s => s.risk_flag || s.latest_severity > 0.75).length;

  return (
    <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* COUNSELOR HEADER BRANDING */}
      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                👩‍⚕️ Counselor Portal: {counselorName}
              </h2>
              <span className="badge badge-emerald">{counselorCollege}</span>
            </div>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              {counselorTitle} • License: <strong>{counselorLicense}</strong> • Location: <strong>{counselorRoom}</strong>
            </p>
          </div>

          <div style={{ background: '#0b0f19', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12.5px', color: '#10b981', fontWeight: '600' }}>
            🔒 Private Session Portal (Assigned Bookings Only)
          </div>
        </div>
      </div>

      {/* EMERGENCY CRISIS ESCALATION ALERT BANNER */}
      {highCrisisCount > 0 && (
        <div style={{ background: 'rgba(244, 63, 94, 0.18)', border: '1.5px solid #f43f5e', borderRadius: '14px', padding: '16px 20px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 0 30px rgba(244, 63, 94, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <ShieldAlert color="#f43f5e" size={28} style={{ animation: 'pulse 1.5s infinite' }} />
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#f43f5e', margin: 0 }}>
                🚨 HIGH CRISIS TRAJECTORY ALERT ({highCrisisCount} Registered Students Flagged)
              </h4>
              <p style={{ fontSize: '13px', color: '#fecdd3', margin: '2px 0 0 0' }}>
                BiLSTM Model 3 has detected escalating longitudinal distress scores among registered students. Intervention recommended.
              </p>
            </div>
          </div>
          <button className="btn-primary" style={{ background: '#f43f5e', border: 'none' }} onClick={() => document.getElementById('triage-queue')?.scrollIntoView({ behavior: 'smooth' })}>
            View Crisis Queue ➔
          </button>
        </div>
      )}

      {/* TOP OVERVIEW METRIC CHIPS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert color="#f43f5e" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>At-Risk Flagged Students</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f43f5e' }}>{atRiskStudents.length} Students</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar color="#6366f1" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>My Bookings ({counselorName})</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#6366f1' }}>{appointments.length} Bookings</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle color="#10b981" size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Completed Consultations</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
              {appointments.filter(a => a.status === 'Completed').length} Sessions
            </div>
          </div>
        </div>
      </div>

      {/* 1. AT-RISK REGISTERED STUDENTS TRIAGE QUEUE TABLE */}
      <div id="triage-queue" className="card">
        <div className="card-header">
          <div className="card-title">
            <AlertCircle color="#f43f5e" size={20} /> Registered Students Crisis Triage Queue
          </div>
          <span className="badge badge-rose">LIVE REGISTERED DATA ONLY</span>
        </div>

        {atRiskStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: '#94a3b8' }}>
            <CheckCircle color="#10b981" size={40} style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '16px', color: '#10b981', margin: 0 }}>0 At-Risk Registered Students Flagged</h4>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>All registered platform students are currently in stable emotional trajectories.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', fontSize: '12px', color: '#94a3b8' }}>
                  <th style={{ padding: '12px' }}>STUDENT NAME / ID</th>
                  <th style={{ padding: '12px' }}>INSTITUTION</th>
                  <th style={{ padding: '12px' }}>MODEL 3 TREND</th>
                  <th style={{ padding: '12px' }}>SEVERITY s_t</th>
                  <th style={{ padding: '12px' }}>TESTS SUBMITTED</th>
                  <th style={{ padding: '12px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: '700', color: '#ffffff' }}>
                      {s.student_name || s.student_id} <span style={{ fontSize: '11px', color: '#94a3b8' }}>({s.student_id})</span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#cbd5e1' }}>{s.institution}</td>
                    <td style={{ padding: '14px 12px' }}><span className="badge badge-rose">WORSENING</span></td>
                    <td style={{ padding: '14px 12px', color: '#f43f5e', fontWeight: '700' }}>{s.latest_severity}</td>
                    <td style={{ padding: '14px 12px', color: '#cbd5e1' }}>{s.sequence_length} Assessments</td>
                    <td style={{ padding: '14px 12px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenCaseFile(s.student_id)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <FileText size={14} /> View Case File
                      </button>
                      <button
                        onClick={() => setOutreachModalStudent(s.student_id)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px', background: '#f43f5e', border: 'none' }}
                      >
                        <Send size={14} /> Initiate Outreach
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. COUNSELOR ASSIGNED APPOINTMENTS TABLE */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="card-title">
            <Calendar color="#6366f1" size={20} /> My Confidential Appointments ({counselorName})
          </div>

          {/* Search & Filter controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search student or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  background: '#0b0f19',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', background: '#0b0f19', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {['All', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: statusFilter === st ? '#6366f1' : 'transparent',
                    color: statusFilter === st ? '#ffffff' : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

            <button className="btn-secondary" onClick={fetchDashboardData} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {filteredAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
              No confidential appointments scheduled for you matching the selected filters.
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id || apt._id}
                style={{
                  background: '#0b0f19',
                  padding: '18px 20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '16px', color: '#6366f1' }}>{apt.student_name || apt.student_id}</strong>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {apt.student_id}</span>
                    <span className="badge badge-indigo">{apt.institution || counselorCollege}</span>
                  </div>

                  <p style={{ fontSize: '13.5px', color: '#cbd5e1', margin: '4px 0' }}>
                    <strong>Topic:</strong> {apt.topic} | <strong>Assigned Counselor:</strong> {apt.counselor_name}
                  </p>

                  {apt.notes && (
                    <div style={{ background: 'rgba(99,102,241,0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px', color: '#a5b4fc', marginTop: '6px' }}>
                      📝 <strong>Clinical Note:</strong> "{apt.notes}"
                    </div>
                  )}

                  {apt.meeting_link && apt.status !== 'Cancelled' && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={14} color="#10b981" />
                      <a
                        href={apt.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '12.5px', color: '#10b981', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        Launch Jitsi Tele-Consultation Room
                      </a>
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>{apt.date} at {apt.time}</div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge ${apt.status === 'Completed' ? 'badge-emerald' : apt.status === 'Cancelled' ? 'badge-rose' : 'badge-emerald'}`}>
                      {apt.status}
                    </span>

                    <select
                      value={apt.status}
                      onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                      style={{ background: '#1e293b', color: '#ffffff', border: '1px solid #334155', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* View Student Profile Casefile Button */}
                    <button
                      onClick={() => handleOpenCaseFile(apt.student_id)}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      <FileText size={13} /> Case File
                    </button>

                    {/* Write Clinical Notes Button */}
                    <button
                      onClick={() => { setEditingNotesApt(apt); setClinicalNotesText(apt.notes || ''); }}
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      📝 Notes
                    </button>

                    {/* Print Summary Button */}
                    <button
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <html>
                            <head><title>Consultation Summary - ${apt.id}</title></head>
                            <body style="font-family: Arial, sans-serif; padding: 40px;">
                              <h2>MindSpace Campus Counseling Consultation Summary</h2>
                              <hr />
                              <p><strong>Appointment ID:</strong> ${apt.id}</p>
                              <p><strong>Student ID:</strong> ${apt.student_id}</p>
                              <p><strong>Student Name:</strong> ${apt.student_name}</p>
                              <p><strong>Counselor:</strong> ${apt.counselor_name}</p>
                              <p><strong>Date & Time:</strong> ${apt.date} at ${apt.time}</p>
                              <p><strong>Topic / Area of Concern:</strong> ${apt.topic}</p>
                              <p><strong>Status:</strong> ${apt.status}</p>
                              <p><strong>Clinical Consultation Notes:</strong> ${apt.notes || 'None recorded'}</p>
                              <br/><br/>
                              <p><em>Signed: Campus Mental Wellness Center (${counselorCollege})</em></p>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }}
                      style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid #6366f1', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      📄 Print
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL 1: STUDENT CLINICAL CASE FILE MODAL */}
      {selectedStudentCaseFile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: '1px solid #6366f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="#6366f1" size={24} /> Student Clinical Case File: {selectedStudentCaseFile.student_id}
              </h3>
              <button onClick={() => setSelectedStudentCaseFile(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Profile Summary */}
            <div style={{ background: '#0b0f19', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div><span style={{ fontSize: '12px', color: '#94a3b8' }}>Student Name:</span><div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{selectedStudentCaseFile.profile.name || 'Student'}</div></div>
              <div><span style={{ fontSize: '12px', color: '#94a3b8' }}>Age & Gender:</span><div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{selectedStudentCaseFile.profile.age || '20'} yrs ({selectedStudentCaseFile.profile.gender || 'Student'})</div></div>
              <div><span style={{ fontSize: '12px', color: '#94a3b8' }}>Institution:</span><div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{selectedStudentCaseFile.profile.institution || counselorCollege}</div></div>
            </div>

            {/* AI Triggers & Assessment Records */}
            <h4 style={{ fontSize: '15px', color: '#6366f1', marginBottom: '10px' }}>📊 Psychological Assessment & AI Triggers</h4>
            <div style={{ background: '#0b0f19', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>
                <strong>Top AI-Detected Triggers:</strong> {selectedStudentCaseFile.recent_triggers.join(', ') || 'Academic Stress, Exam Anxiety'}
              </p>
              
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700' }}>Past PHQ-9 / GAD-7 Assessment Scores:</div>
              {selectedStudentCaseFile.assessments.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>No formal assessment scores submitted yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedStudentCaseFile.assessments.map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
                      <span><strong>{a.type}</strong> ({new Date(a.date).toLocaleDateString()}): {a.score} / {a.max_score}</span>
                      <span style={{ color: '#f43f5e', fontWeight: '700' }}>{a.severity_tier}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={() => setSelectedStudentCaseFile(null)} style={{ width: '100%' }}>
              Close Clinical Case File
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: CLINICAL NOTES EDITOR */}
      {editingNotesApt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '28px', border: '1px solid #6366f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                📝 Add Confidential Clinical Notes
              </h3>
              <button onClick={() => setEditingNotesApt(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
              Appointment with <strong>{editingNotesApt.student_name}</strong> ({editingNotesApt.date} at {editingNotesApt.time})
            </p>

            <textarea
              rows={5}
              value={clinicalNotesText}
              onChange={(e) => setClinicalNotesText(e.target.value)}
              placeholder="Type confidential counselor observations, CBT action steps, or follow-up recommendations..."
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '12px',
                color: '#ffffff',
                fontSize: '14px',
                marginBottom: '18px'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setEditingNotesApt(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveNotes}>
                Save Clinical Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EMERGENCY OUTREACH MODAL */}
      {outreachModalStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '28px', border: '1px solid #f43f5e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f43f5e', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={20} /> Initiate Emergency Counselor Outreach
              </h3>
              <button onClick={() => setOutreachModalStudent(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Target Student: <strong>{outreachModalStudent}</strong> (Flagged for worsening emotional trajectory)
            </p>

            <form onSubmit={handleSendOutreach} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Outreach Date:</label>
                  <input
                    type="date"
                    value={outreachDate}
                    onChange={(e) => setOutreachDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Time Slot:</label>
                  <select
                    value={outreachTime}
                    onChange={(e) => setOutreachTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Counselor Invitation Note:</label>
                <textarea
                  rows={3}
                  value={outreachNote}
                  onChange={(e) => setOutreachNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0b0f19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setOutreachModalStudent(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: '#f43f5e', border: 'none' }}>
                  Dispatch Counselor Outreach ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
