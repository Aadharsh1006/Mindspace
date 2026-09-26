import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, CheckCircle2, Award, ShieldAlert, History, TrendingUp, RefreshCw } from 'lucide-react';
import { EXPRESS_URL, PYTHON_AI_URL } from '../config/api';

export default function Assessment({ user }) {
  const studentId = user?.student_id || user?.id || 'STUDENT_GUEST';

  const [activeType, setActiveType] = useState('PHQ-9');
  const [questionsData, setQuestionsData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);
  const [trajectoryResult, setTrajectoryResult] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchHistory();
  }, [studentId]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${EXPRESS_URL}/api/assessments/questions`);
      setQuestionsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${EXPRESS_URL}/api/assessments?student_id=${studentId}`);
      setAssessmentHistory(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assessment history:', err);
    }
  };

  const handleOptionSelect = (qIdx, val) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: val }));
  };

  const handleSubmit = async () => {
    const questions = activeType === 'PHQ-9' ? questionsData.phq9 : questionsData.gad7;
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

    try {
      const res = await axios.post(`${EXPRESS_URL}/api/assessments`, {
        student_id: studentId,
        type: activeType,
        score: totalScore,
        answers
      });
      setSubmittedResult(res.data.record);
      fetchHistory();

      // Trigger Longitudinal Trajectory Model Prediction
      const normScore = totalScore / (activeType === 'PHQ-9' ? 27.0 : 21.0);
      const mockSessions = [
        { emotion_probs: [0.1, 0.1, 0.5, 0.1, 0.1, 0.1], severity_score: 0.4, trigger_vector: [0,1,0,0,0,0,0], days_delta: 7 },
        { emotion_probs: [0.1, 0.1, 0.6, 0.1, 0.1, 0.0], severity_score: normScore, trigger_vector: [0,1,0,0,0,0,0], days_delta: 7 }
      ];

      try {
        const trajRes = await axios.post(`${PYTHON_AI_URL}/api/predict_trajectory`, { sessions: mockSessions });
        setTrajectoryResult(trajRes.data);
      } catch (trajErr) {
        console.warn('Trajectory prediction warning:', trajErr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!questionsData) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading assessment questions...</div>;
  }

  const currentQuestions = activeType === 'PHQ-9' ? questionsData.phq9 : questionsData.gad7;

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 24px' }}>
      
      {/* Quiz Selector Toggle & History Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => { setActiveType('PHQ-9'); setAnswers({}); setSubmittedResult(null); setViewHistory(false); }}
            className={!viewHistory && activeType === 'PHQ-9' ? 'btn-primary' : 'btn-secondary'}
          >
            PHQ-9 Depression Scale (9 Items)
          </button>
          <button
            onClick={() => { setActiveType('GAD-7'); setAnswers({}); setSubmittedResult(null); setViewHistory(false); }}
            className={!viewHistory && activeType === 'GAD-7' ? 'btn-primary' : 'btn-secondary'}
          >
            GAD-7 Anxiety Scale (7 Items)
          </button>
        </div>

        <button
          onClick={() => setViewHistory(!viewHistory)}
          className={viewHistory ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <History size={16} /> {viewHistory ? 'Take Assessment' : `My Score History (${assessmentHistory.length})`}
        </button>
      </div>

      {viewHistory ? (
        /* ASSESSMENT HISTORY VIEW */
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="#6366f1" size={20} /> Assessment Score History & Progress Logs
            </h3>
            <button className="btn-secondary" onClick={fetchHistory} style={{ padding: '6px 12px', fontSize: '12px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {assessmentHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <ClipboardList size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '15px' }}>No recorded assessments yet. Take your first PHQ-9 or GAD-7 assessment above!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assessmentHistory.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  style={{
                    background: '#0b0f19',
                    padding: '18px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span className={`badge ${rec.type === 'PHQ-9' ? 'badge-indigo' : 'badge-emerald'}`}>
                        {rec.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {new Date(rec.date).toLocaleDateString()} at {new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>
                      Score: {rec.score} / {rec.max_score}
                    </div>
                  </div>

                  <span className="badge badge-rose" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {rec.severity_tier}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : submittedResult ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <CheckCircle2 color="#10b981" size={54} style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            {activeType} Assessment Completed
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
            Your calculated score has been recorded in your private wellness history.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '480px', margin: '0 auto 24px' }}>
            <div style={{ background: '#0b0f19', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Score</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#6366f1' }}>
                {submittedResult.score} / {submittedResult.max_score}
              </div>
            </div>
            <div style={{ background: '#0b0f19', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Severity Tier</span>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#f43f5e', marginTop: '6px' }}>
                {submittedResult.severity_tier}
              </div>
            </div>
          </div>

          {trajectoryResult && (
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '12px', padding: '16px', maxWidth: '480px', margin: '0 auto 24px', textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', marginBottom: '4px' }}>
                🧠 BiLSTM AI Longitudinal Risk Assessment
              </div>
              <div style={{ fontSize: '13px', color: '#e2e8f0' }}>
                Predicted Trend: <strong>{trajectoryResult.predicted_trend}</strong> ({(trajectoryResult.trend_confidence * 100).toFixed(1)}% confidence)
              </div>
              <div style={{ fontSize: '12px', color: trajectoryResult.escalation_required ? '#f43f5e' : '#10b981', marginTop: '4px', fontWeight: '600' }}>
                Action: {trajectoryResult.action_recommended}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => { setSubmittedResult(null); setTrajectoryResult(null); }}>
              Retake Assessment
            </button>
            <button className="btn-primary" onClick={() => setViewHistory(true)}>
              View Score History
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ClipboardList color="#6366f1" size={20} /> {activeType} Mental Health Assessment
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Over the last 2 weeks, how often have you been bothered by:</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {currentQuestions.map((qText, qIdx) => (
              <div key={qIdx} style={{ background: '#0b0f19', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '14.5px', fontWeight: '600', marginBottom: '12px' }}>
                  {qIdx + 1}. {qText}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {questionsData.scoring_options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(qIdx, opt.value)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: `1px solid ${answers[qIdx] === opt.value ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                        background: answers[qIdx] === opt.value ? 'rgba(99,102,241,0.2)' : 'transparent',
                        color: answers[qIdx] === opt.value ? '#ffffff' : '#94a3b8',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {opt.label} ({opt.value})
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn-primary" onClick={handleSubmit}>
              Submit Assessment & Calculate Score
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
