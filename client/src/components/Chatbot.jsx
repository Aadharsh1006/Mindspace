import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Lightbulb, ShieldAlert } from 'lucide-react';
import { EXPRESS_URL } from '../config/api';

export default function Chatbot({ user, activeThreadId, onThreadUpdated }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${user?.name || 'there'}! I'm your AI Mental Wellness Assistant. How are you feeling today? You can share whatever is on your mind — whether it's academic pressure, relationships, sleep issues, or general stress.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const samplePrompts = [
    "I'm terrified I failed my midterm exam and can't sleep at all.",
    "My partner broke up with me last night, I feel so lonely and heartbroken.",
    "I have 3 assignments due tomorrow and I feel completely overwhelmed with panic.",
    "I applied to 20 internships and got rejected from every single one."
  ];

  const defaultWelcome = {
    sender: 'bot',
    text: `Hello ${user?.name || 'there'}! I'm your AI Mental Wellness Assistant. How are you feeling today? You can share whatever is on your mind — whether it's academic pressure, relationships, sleep issues, or general stress.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  useEffect(() => {
    const loadThreadMessages = async () => {
      if (!activeThreadId) {
        setMessages([defaultWelcome]);
        return;
      }
      try {
        const res = await axios.get(`${EXPRESS_URL}/api/chats/threads/${activeThreadId}`);
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([defaultWelcome]);
        }
      } catch (err) {
        setMessages([defaultWelcome]);
      }
    };

    loadThreadMessages();
  }, [activeThreadId, user?.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const studentId = user?.student_id || user?.id || 'STUDENT_GUEST';
      const targetThreadId = activeThreadId || ('THREAD_' + studentId + '_' + Date.now());

      const res = await axios.post(`${EXPRESS_URL}/api/chat`, {
        thread_id: targetThreadId,
        student_id: studentId,
        message: text
      });

      const data = res.data;
      const botMsg = {
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: {
          emotion: data.emotion,
          severity: data.severity,
          trigger: data.trigger,
          cbt: data.cbt_recommendation
        }
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.thread && onThreadUpdated) {
        onThreadUpdated(data.thread);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I hear you. Take a slow, gentle breath — I'm right here with you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      height: 'calc(100vh - 40px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0'
    }}>
      
      {/* Clean Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff' }}>Empathetic AI Dialogue Assistant</span>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          Session Active
        </span>
      </div>

      {/* Message Dialogue Canvas */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '14px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            
            {msg.sender === 'bot' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)' }}>
                <Bot size={18} color="#ffffff" />
              </div>
            )}

            <div style={{ maxWidth: '78%' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#1e293b',
                color: '#ffffff',
                fontSize: '14.5px',
                lineHeight: '1.6',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
              }}>
                <p>{msg.text}</p>
                
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', marginTop: '8px', textAlign: 'right' }}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Subtle Elegant Status Chips on Bot Message */}
              {msg.analysis && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    Emotion: {msg.analysis.emotion}
                  </span>
                  <span style={{ fontSize: '11px', background: msg.analysis.severity > 0.65 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)', color: msg.analysis.severity > 0.65 ? '#f43f5e' : '#10b981', padding: '3px 8px', borderRadius: '6px', border: `1px solid ${msg.analysis.severity > 0.65 ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.25)'}` }}>
                    Severity: {msg.analysis.severity}
                  </span>
                  <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                    Trigger: {msg.analysis.trigger}
                  </span>
                  {msg.analysis.distortion?.detected && (
                    <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                      🧠 Thought Pattern: {msg.analysis.distortion.name}
                    </span>
                  )}
                </div>
              )}

              {/* Integrated CBT Recommendation Card */}
              {msg.analysis?.cbt && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '10px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lightbulb size={14} /> CBT Intervention: {msg.analysis.cbt.title}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    <strong>Strategy:</strong> {msg.analysis.cbt.strategy}
                  </p>
                </div>
              )}

              {/* Interactive Soothing Follow-Up Action Chips */}
              {msg.sender === 'bot' && idx === messages.length - 1 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <button
                    onClick={() => handleSendMessage("Could you share another gentle perspective or soothing practice with me?")}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🌸 Show Another Calming Perspective
                  </button>

                  <button
                    onClick={() => handleSendMessage("Can we try a short 3-minute calming breathing exercise?")}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#6ee7b7',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🫁 Try Calming Breathing
                  </button>

                  <button
                    onClick={() => handleSendMessage("Help me reframe this thought step by step.")}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#67e8f9',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    📝 Reframe Thought
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="#ffffff" />
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', paddingLeft: '50px' }}>
            <Sparkles size={16} className="animate-spin" color="#6366f1" /> MindCare AI is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Sample Quick Chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {samplePrompts.map((p, i) => (
          <span
            key={i}
            onClick={() => handleSendMessage(p)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {p.slice(0, 36)}...
          </span>
        ))}
      </div>

      {/* Clean Input Bar */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Message MindCare AI..."
          style={{ flex: 1, padding: '14px 18px', fontSize: '14.5px' }}
        />
        <button className="btn-primary" onClick={() => handleSendMessage()} style={{ padding: '0 24px' }}>
          <Send size={18} />
        </button>
      </div>

    </div>
  );
}
