import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, UserCheck, Clock, CheckCircle, AlertCircle, Building, Video, XCircle, RefreshCw } from 'lucide-react';
import { EXPRESS_URL } from '../config/api';

export default function Booking({ user }) {
  const studentCollege = user?.institution || 'University Campus';
  const studentName = user?.name || 'Student';
  const studentId = user?.student_id || user?.id || 'STUDENT_GUEST';

  // Counselors state
  const [collegeCounselors, setCollegeCounselors] = useState([]);
  const [generalCounselors, setGeneralCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  
  // Booking form state
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [topic, setTopic] = useState('Academic Stress & Exam Anxiety');

  // Booked slots tracking
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Student's existing bookings
  const [myAppointments, setMyAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('new_booking'); // 'new_booking' | 'my_bookings'

  const availableTimeSlots = [
    '09:00 AM', '09:30 AM', '10:30 AM', '11:30 AM',
    '02:00 PM', '03:00 PM', '03:30 PM', '04:30 PM'
  ];

  // Fetch Counselors matching college
  useEffect(() => {
    fetchCounselors();
    fetchMyAppointments();
  }, [studentCollege]);

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(`${EXPRESS_URL}/api/counselors?institution=${encodeURIComponent(studentCollege)}`);
      setCollegeCounselors(res.data.college_counselors || []);
      setGeneralCounselors(res.data.general_counselors || []);
      if (res.data.college_counselors?.length > 0) {
        setSelectedCounselor(res.data.college_counselors[0]);
      } else if (res.data.general_counselors?.length > 0) {
        setSelectedCounselor(res.data.general_counselors[0]);
      }
    } catch (err) {
      console.error('Failed to load counselors:', err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await axios.get(`${EXPRESS_URL}/api/appointments?student_id=${studentId}`);
      setMyAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch my appointments:', err);
    }
  };

  // Fetch booked slots whenever counselor or date changes
  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedCounselor, selectedDate]);

  const fetchBookedSlots = async () => {
    if (!selectedCounselor) return;
    setLoadingSlots(true);
    setBookingError(null);
    try {
      const res = await axios.get(
        `${EXPRESS_URL}/api/appointments/booked-slots?counselor_name=${encodeURIComponent(selectedCounselor.name)}&date=${selectedDate}`
      );
      setBookedSlots(res.data.booked_slots || []);
      
      // Auto-adjust selectedTime if current selected is booked
      if (res.data.booked_slots.includes(selectedTime)) {
        const firstFree = availableTimeSlots.find(t => !res.data.booked_slots.includes(t));
        if (firstFree) setSelectedTime(firstFree);
      }
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedCounselor) {
      setBookingError('Please select a counselor.');
      return;
    }

    if (bookedSlots.includes(selectedTime)) {
      setBookingError(`Slot ${selectedTime} is already booked for ${selectedCounselor.name}. Please select an available slot.`);
      return;
    }

    try {
      const res = await axios.post(`${EXPRESS_URL}/api/appointments`, {
        student_id: studentId,
        student_name: studentName,
        counselor_name: selectedCounselor.name,
        date: selectedDate,
        time: selectedTime,
        topic,
        institution: studentCollege
      });

      if (res.data.success) {
        setBookingSuccess(res.data.appointment);
        fetchMyAppointments();
        fetchBookedSlots();
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to book appointment. Please try again.';
      setBookingError(errMsg);
    }
  };

  const handleCancelAppointment = async (aptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? This slot will be freed for other students.')) return;
    try {
      await axios.delete(`${EXPRESS_URL}/api/appointments/${aptId}`);
      fetchMyAppointments();
      fetchBookedSlots();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 24px' }}>
      
      {/* Top Header & College Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={24} /> Campus Counselor Appointment Hub
          </h2>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Confidential psychological & mental wellness consultation for university students.
          </p>
        </div>

        <div style={{ background: '#0b0f19', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={16} color="#6366f1" />
          <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>College:</span>
          <span className="badge badge-emerald">{studentCollege}</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('new_booking')}
          className={activeTab === 'new_booking' ? 'btn-primary' : 'btn-secondary'}
        >
          Book New Consultation
        </button>
        <button
          onClick={() => setActiveTab('my_bookings')}
          className={activeTab === 'my_bookings' ? 'btn-primary' : 'btn-secondary'}
        >
          My Booked Appointments ({myAppointments.filter(a => a.status !== 'Cancelled').length})
        </button>
      </div>

      {/* TAB 1: NEW BOOKING */}
      {activeTab === 'new_booking' && (
        <>
          {bookingSuccess ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle color="#10b981" size={56} style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                Appointment Confirmed Successfully!
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                Your confidential session has been locked and reserved in your college's wellness calendar.
              </p>

              <div style={{ background: '#0b0f19', padding: '20px', borderRadius: '14px', textAlign: 'left', maxWidth: '520px', margin: '0 auto 24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ marginBottom: '6px', color: '#f8fafc' }}><strong>Counselor:</strong> {bookingSuccess.counselor_name}</p>
                <p style={{ marginBottom: '6px', color: '#f8fafc' }}><strong>College:</strong> {bookingSuccess.institution}</p>
                <p style={{ marginBottom: '6px', color: '#f8fafc' }}><strong>Date & Time:</strong> {bookingSuccess.date} at {bookingSuccess.time}</p>
                <p style={{ marginBottom: '6px', color: '#f8fafc' }}><strong>Topic:</strong> {bookingSuccess.topic}</p>
                {bookingSuccess.meeting_link && (
                  <p style={{ marginTop: '10px' }}>
                    <strong>Video Meeting Link:</strong>{' '}
                    <a href={bookingSuccess.meeting_link} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'underline' }}>
                      {bookingSuccess.meeting_link}
                    </a>
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => setBookingSuccess(null)}>
                  Book Another Appointment
                </button>
                <button className="btn-secondary" onClick={() => setActiveTab('my_bookings')}>
                  View My Appointments
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '32px' }}>
              
              {/* Error Banner */}
              {bookingError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <AlertCircle size={20} flexShrink={0} />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. SELECT COUNSELOR (Grouped by College vs General) */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '10px' }}>
                    1. Select Available Counselor:
                  </label>

                  {/* College Counselors Section */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginBottom: '8px' }}>
                      🎓 {studentCollege} COLLEGE COUNSELORS (Dedicated Campus Faculty)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                      {collegeCounselors.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCounselor(c)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: selectedCounselor?.name === c.name ? 'rgba(99,102,241,0.18)' : '#0b0f19',
                            border: selectedCounselor?.name === c.name ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#ffffff' }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: '#6366f1', marginTop: '2px' }}>{c.title}</div>
                          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>📍 {c.room} • {c.specialization}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Counselors Section */}
                  <div>
                    <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700', marginBottom: '8px' }}>
                      🌐 GENERAL CAMPUS & VIRTUAL COUNSELORS (Available All Institutions)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                      {generalCounselors.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCounselor(c)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: selectedCounselor?.name === c.name ? 'rgba(99,102,241,0.18)' : '#0b0f19',
                            border: selectedCounselor?.name === c.name ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#ffffff' }}>{c.name}</div>
                          <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '2px' }}>{c.title}</div>
                          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>💻 {c.room} • {c.specialization}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. SELECT DATE & CHECK SLOT AVAILABILITY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                      2. Select Consultation Date:
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#0b0f19',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        color: '#ffffff',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* TIME SLOTS GRID */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                        3. Choose Available Time Slot:
                      </label>
                      {loadingSlots && <span style={{ fontSize: '12px', color: '#6366f1' }}>Checking slot availability...</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {availableTimeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedTime === slot;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              textAlign: 'center',
                              background: isBooked ? 'rgba(239, 68, 68, 0.1)' : isSelected ? '#6366f1' : '#0b0f19',
                              color: isBooked ? '#ef4444' : isSelected ? '#ffffff' : '#cbd5e1',
                              border: isBooked ? '1px dashed #ef4444' : isSelected ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              opacity: isBooked ? 0.6 : 1,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {slot}
                            <div style={{ fontSize: '10px', marginTop: '2px', fontWeight: '400' }}>
                              {isBooked ? '🔴 Booked' : '🟢 Free'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. SELECT TOPIC */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                    4. Area of Concern / Consultation Topic:
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0b0f19',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Academic Stress & Exam Anxiety">Academic Stress & Exam Anxiety</option>
                    <option value="Depression, Low Energy & Sadness">Depression, Low Energy & Sadness</option>
                    <option value="Sleep Disturbances & Insomnia">Sleep Disturbances & Insomnia</option>
                    <option value="Relationship or Family Difficulties">Relationship or Family Difficulties</option>
                    <option value="Career & Future Uncertainty">Career & Future Uncertainty</option>
                    <option value="General Stress & Overwhelm">General Stress & Overwhelm</option>
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '15px', marginTop: '8px' }}
                  disabled={!selectedCounselor || bookedSlots.includes(selectedTime)}
                >
                  Confirm Confidential Booking ➔
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* TAB 2: MY BOOKED APPOINTMENTS */}
      {activeTab === 'my_bookings' && (
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              My Registered Appointments
            </h3>
            <button className="btn-secondary" onClick={fetchMyAppointments} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {myAppointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <Calendar size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px' }}>You have no scheduled counseling appointments yet.</p>
              <button className="btn-primary" onClick={() => setActiveTab('new_booking')} style={{ marginTop: '12px' }}>
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myAppointments.map((apt) => (
                <div
                  key={apt.id || apt._id}
                  style={{
                    background: '#0b0f19',
                    padding: '20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span className={`badge ${apt.status === 'Confirmed' ? 'badge-emerald' : apt.status === 'Cancelled' ? 'badge-amber' : 'badge-indigo'}`}>
                        {apt.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {apt.id}</span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      {apt.counselor_name}
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '2px 0' }}>
                      <strong>Date & Time:</strong> {apt.date} at {apt.time}
                    </p>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '2px 0' }}>
                      <strong>Topic:</strong> {apt.topic}
                    </p>

                    {apt.meeting_link && apt.status !== 'Cancelled' && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={15} color="#6366f1" />
                        <a
                          href={apt.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600', textDecoration: 'underline' }}
                        >
                          Join Online Tele-Consultation Room
                        </a>
                      </div>
                    )}
                  </div>

                  {apt.status !== 'Cancelled' && (
                    <button
                      className="btn-secondary"
                      onClick={() => handleCancelAppointment(apt.id)}
                      style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '8px 14px', fontSize: '13px' }}
                    >
                      <XCircle size={15} /> Cancel Appointment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
