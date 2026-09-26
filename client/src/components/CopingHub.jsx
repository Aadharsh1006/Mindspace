import React, { useState, useEffect } from 'react';
import { HeartPulse, Wind, Timer, Compass, CheckCircle2, Volume2, Sparkles, RefreshCw, Check } from 'lucide-react';

export default function CopingHub() {
  const [activeTool, setActiveTool] = useState('personalized_5');

  // Interactive 5-4-3-2-1 Grounding Step State
  const [groundStep, setGroundStep] = useState(0); // 0 to 4, 5 = completed
  const [groundInputs, setGroundInputs] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    affirmation: ''
  });

  const groundingStepsData = [
    {
      num: 5,
      key: 'see',
      title: '👁️ Name 5 Things You Can SEE Around You',
      desc: 'Look around your room. Notice colors, shapes, or objects near you.',
      placeholders: ['Item 1 (e.g. Lamp)', 'Item 2 (e.g. Window)', 'Item 3 (e.g. Desk)', 'Item 4 (e.g. Clock)', 'Item 5 (e.g. Book)']
    },
    {
      num: 4,
      key: 'touch',
      title: '🖐️ Name 4 Things You Can TOUCH & Feel Right Now',
      desc: 'Focus on your body. Feel your feet on the floor, sweater fabric, or cool air.',
      placeholders: ['Touch 1 (e.g. Feet on ground)', 'Touch 2 (e.g. Chair back)', 'Touch 3 (e.g. Smooth phone)', 'Touch 4 (e.g. Soft shirt)']
    },
    {
      num: 3,
      key: 'hear',
      title: '👂 Name 3 Things You Can HEAR In The Background',
      desc: 'Listen closely. Notice distant sounds, fan hums, or outdoor breeze.',
      placeholders: ['Sound 1 (e.g. Fan hum)', 'Sound 2 (e.g. Distant cars)', 'Sound 3 (e.g. Soft breathing)']
    },
    {
      num: 2,
      key: 'smell',
      title: '👃 Name 2 Things You Can SMELL',
      desc: 'Take a gentle breath through your nose. Notice coffee, soap, paper, or fresh air.',
      placeholders: ['Smell 1 (e.g. Fresh air)', 'Smell 2 (e.g. Coffee/Tea)']
    },
    {
      num: 1,
      key: 'affirmation',
      title: '💖 1 Positive Self-Comfort Affirmation',
      desc: 'Say a gentle, compassionate thought to yourself right now.',
      placeholders: ['e.g. "I am safe right now, and I can take this one step at a time."']
    }
  ];

  // Personalized 5 Comfort Activities Generator State
  const [userState, setUserState] = useState('');
  const [customFeeling, setCustomFeeling] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false]);

  const presetComfortPlans = {
    panic: {
      category: 'Sudden Panic & Anxiety',
      steps: [
        { title: '1. Splash Cold Water on Your Face', desc: 'Activates the mammalian dive reflex to immediately slow down your racing heart.' },
        { title: '2. 5-4-3-2-1 Sensory Grounding', desc: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, and 1 affirmation.' },
        { title: '3. 4-7-8 Deep Rhythmic Breathing', desc: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds to send safety signals to your brain.' },
        { title: '4. Physical Grounding Hug', desc: 'Wrap a heavy blanket around your shoulders or press your feet firmly flat on the floor.' },
        { title: '5. Gentle Self-Reassurance', desc: 'Say out loud: "This panic is uncomfortable, but it is not dangerous, and it will pass soon."' }
      ]
    },
    exam: {
      category: 'Exam & Academic Overwhelm',
      steps: [
        { title: '1. Brain Dump on Paper', desc: 'Write down every single lingering task or fear so it is out of your head and onto paper.' },
        { title: '2. Pick Just ONE Micro-Task', desc: 'Do not study the whole syllabus now. Pick just 1 small page or concept to review for 5 minutes.' },
        { title: '3. Unclench Jaw & Roll Shoulders', desc: 'Release the subconscious tension you carry while sitting at your desk.' },
        { title: '4. Hydrate with Cool Water', desc: 'Drink a full glass of water to refresh brain function and reduce fatigue.' },
        { title: '5. Set a 25-Min Focus Timer', desc: 'Start a Pomodoro session knowing you get a guaranteed relaxing break afterwards.' }
      ]
    },
    sadness: {
      category: 'Sadness, Loneliness or Low Mood',
      steps: [
        { title: '1. Place a Warm Hand Over Your Heart', desc: 'Feel the warmth of your palm. Offer yourself the same kindness you would give a friend.' },
        { title: '2. Shift Environment & Lighting', desc: 'Open a window for fresh air or turn on warm lighting to soften your room ambiance.' },
        { title: '3. Sip Warm Tea or Hot Chocolate', desc: 'Savor a warm beverage mindfully, focusing on the comforting sensation in your hands.' },
        { title: '4. Listen to 1 Comforting Track', desc: 'Play your favorite calm song or calming acoustic playlist.' },
        { title: '5. Reach Out to a Safe Presence', desc: 'Send a quick message to a trusted friend or talk with Dr. MindSpace in the Chat tab.' }
      ]
    },
    racing: {
      category: 'Racing Mind & Insomnia',
      steps: [
        { title: '1. Dim All Bright Screens', desc: 'Reduce blue light exposure so your pineal gland can release sleep-inducing melatonin.' },
        { title: '2. Progressive Muscle Relaxation', desc: 'Tense your feet for 5s, then release. Tense your legs for 5s, release. Work up to your neck.' },
        { title: '3. Long Slow Exhales', desc: 'Inhale for 4 seconds, exhale for 6 to 8 seconds to lower resting blood pressure.' },
        { title: '4. Externalize Lingering Thoughts', desc: 'Keep a notebook by your bed and write down any to-dos so your brain stops holding onto them.' },
        { title: '5. Mental Distraction Game', desc: 'Count backwards from 100 by 3s or visualize your favorite serene nature place in detail.' }
      ]
    },
    burnout: {
      category: 'Exhaustion & Mental Burnout',
      steps: [
        { title: '1. Grant Yourself Absolute Permission to Rest', desc: 'Remind yourself: "Rest is not earned; it is necessary for recovery."' },
        { title: '2. Lie Down Flat on Your Back', desc: 'Put your legs up against a wall or pillow to ease circulation and reduce fatigue.' },
        { title: '3. Close Eyes for 10 Quiet Minutes', desc: 'No phone, no study material—just rest your eyes and let your nervous system recharge.' },
        { title: '4. Soft Physical Stretch', desc: 'Reach your arms high overhead and take a deep, satisfying yawn.' },
        { title: '5. Gentle Nourishment', desc: 'Eat a small healthy snack (banana, nuts, warm soup) to replenish exhausted energy.' }
      ]
    }
  };

  const handleGeneratePlan = (selectedCategory) => {
    setUserState(selectedCategory);
    setCompletedSteps([false, false, false, false, false]);

    if (presetComfortPlans[selectedCategory]) {
      setGeneratedPlan(presetComfortPlans[selectedCategory]);
    } else if (customFeeling.trim()) {
      setGeneratedPlan({
        category: `Custom Comfort Plan for: "${customFeeling}"`,
        steps: [
          { title: '1. Acknowledge Your Feeling Without Judgment', desc: `It is completely valid to feel "${customFeeling}". Take a moment to let the emotion be present without harshness.` },
          { title: '2. Physical Release', desc: 'Drop your shoulders, unclench your teeth, and take 3 slow diaphragmatic breaths.' },
          { title: '3. Sensory Reset', desc: 'Hold a warm cup or splash cool water on your hands to anchor your nervous system.' },
          { title: '4. Break the Cycle', desc: 'Change your immediate physical environment—step outside or walk to another room for 2 minutes.' },
          { title: '5. Compassionate Next Step', desc: 'Ask yourself: "What is the gentlest, most comforting thing I can do for myself right now?"' }
        ]
      });
    }
  };

  const toggleStepCompleted = (idx) => {
    setCompletedSteps((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // 4-7-8 Breathing State
  const [breathePhase, setBreathePhase] = useState('Inhale'); // Inhale (4s), Hold (7s), Exhale (8s)
  const [breatheTimer, setBreatheTimer] = useState(4);
  const [breatheActive, setBreatheActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (breatheActive) {
      interval = setInterval(() => {
        setBreatheTimer((prev) => {
          if (prev > 1) return prev - 1;
          
          if (breathePhase === 'Inhale') {
            setBreathePhase('Hold');
            return 7;
          } else if (breathePhase === 'Hold') {
            setBreathePhase('Exhale');
            return 8;
          } else {
            setBreathePhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breatheActive, breathePhase]);

  // Pomodoro Timer State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (pomoActive && pomoSeconds > 0) {
      interval = setInterval(() => setPomoSeconds((s) => s - 1), 1000);
    } else if (pomoSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoSeconds]);

  const formatPomoTime = () => {
    const mins = Math.floor(pomoSeconds / 60);
    const secs = pomoSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentGStep = groundingStepsData[groundStep] || null;

  const handleInputChange = (key, idx, val) => {
    if (key === 'affirmation') {
      setGroundInputs((prev) => ({ ...prev, affirmation: val }));
    } else {
      setGroundInputs((prev) => {
        const arr = [...prev[key]];
        arr[idx] = val;
        return { ...prev, [key]: arr };
      });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 24px' }}>
      
      {/* Tool Navigation Bar */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTool('personalized_5')}
          className={activeTool === 'personalized_5' ? 'btn-primary' : 'btn-secondary'}
        >
          <Sparkles size={16} /> Personalized 5 Comfort Steps
        </button>
        <button
          onClick={() => setActiveTool('grounding_wizard')}
          className={activeTool === 'grounding_wizard' ? 'btn-primary' : 'btn-secondary'}
        >
          <Compass size={16} /> 5-4-3-2-1 Grounding Wizard
        </button>
        <button
          onClick={() => setActiveTool('breathing')}
          className={activeTool === 'breathing' ? 'btn-primary' : 'btn-secondary'}
        >
          <Wind size={16} /> 4-7-8 Breathing Tool
        </button>
        <button
          onClick={() => setActiveTool('pomodoro')}
          className={activeTool === 'pomodoro' ? 'btn-primary' : 'btn-secondary'}
        >
          <Timer size={16} /> Study Focus Timer
        </button>
        <button
          onClick={() => setActiveTool('ambient_audio')}
          className={activeTool === 'ambient_audio' ? 'btn-primary' : 'btn-secondary'}
        >
          <Volume2 size={16} /> Calming Ambient Audio
        </button>
      </div>

      {/* 1. PERSONALIZED 5 COMFORT STEPS GENERATOR */}
      {activeTool === 'personalized_5' && (
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color="#8b5cf6" size={24} /> Tailored Comfort Plan: How Are You Feeling?
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
            Select how you are feeling right now, or type your exact emotional state. We will generate 5 personalized comforting activities to help you feel safe and comfortable immediately.
          </p>

          {/* Quick Selection Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { id: 'panic', label: '😰 Intense Panic / Anxiety', desc: 'Heart racing, can\'t catch breath, feeling scared' },
              { id: 'exam', label: '📚 Exam & Academic Stress', desc: 'Overwhelmed with deadlines, syllabus & pressure' },
              { id: 'sadness', label: '😔 Feeling Sad & Demotivated', desc: 'Feeling down, lonely, or emotionally drained' },
              { id: 'racing', label: '🤯 Racing Mind & Insomnia', desc: 'Can\'t quiet your thoughts or fall asleep' },
              { id: 'burnout', label: '🥱 Exhausted & Burned Out', desc: 'Zero energy, mentally taxed and overburdened' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleGeneratePlan(option.id)}
                style={{
                  textAlign: 'left',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: userState === option.id ? 'rgba(99,102,241,0.18)' : '#0b0f19',
                  border: userState === option.id ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{option.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{option.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom Feeling Input */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
            <input
              type="text"
              value={customFeeling}
              onChange={(e) => setCustomFeeling(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGeneratePlan('custom'); }}
              placeholder="Or type how you feel (e.g., 'Overthinking about my future' or 'Had a fight')..."
              style={{
                flex: 1,
                background: '#0b0f19',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#ffffff',
                fontSize: '14px'
              }}
            />
            <button
              className="btn-primary"
              onClick={() => handleGeneratePlan('custom')}
              disabled={!customFeeling.trim()}
              style={{ opacity: customFeeling.trim() ? 1 : 0.6 }}
            >
              Generate My 5 Steps ✨
            </button>
          </div>

          {/* GENERATED 5 COMFORT ACTIVITIES */}
          {generatedPlan && (
            <div style={{ background: '#070a12', borderRadius: '16px', padding: '24px', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '6px', display: 'inline-block' }}>5 TAILORED ACTIVITIES GENERATED</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>{generatedPlan.category}</h3>
                </div>
                <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '700' }}>
                  {completedSteps.filter(Boolean).length} / 5 Completed
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {generatedPlan.steps.map((step, idx) => {
                  const isDone = completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStepCompleted(idx)}
                      style={{
                        background: isDone ? 'rgba(16, 185, 129, 0.1)' : '#0b0f19',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        border: isDone ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: isDone ? '#10b981' : 'rgba(255,255,255,0.1)',
                          border: isDone ? 'none' : '1.5px solid #6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0
                        }}
                      >
                        {isDone ? <Check size={16} color="white" /> : <span style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>{idx + 1}</span>}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: isDone ? '#10b981' : '#f8fafc', textDecoration: isDone ? 'line-through' : 'none', marginBottom: '4px' }}>
                          {step.title}
                        </h4>
                        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {completedSteps.every(Boolean) && (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16,185,129,0.15)', borderRadius: '12px', border: '1px solid #10b981' }}>
                  <CheckCircle2 color="#10b981" size={32} style={{ margin: '0 auto 8px' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#10b981', margin: 0 }}>
                    Wonderful Job! You Completed All 5 Comfort Steps 🎉
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px', margin: 0 }}>
                    Take a deep breath and give yourself credit for taking care of your well-being today.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. INTERACTIVE 5-4-3-2-1 GROUNDING COMFORT WIZARD */}
      {activeTool === 'grounding_wizard' && (
        <div className="card" style={{ padding: '32px' }}>
          {groundStep < 5 ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-emerald">STEP {groundStep + 1} OF 5</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sensory Grounding Protocol</span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1', marginBottom: '8px' }}>
                {currentGStep.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
                {currentGStep.desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {currentGStep.key === 'affirmation' ? (
                  <input
                    type="text"
                    value={groundInputs.affirmation}
                    onChange={(e) => handleInputChange('affirmation', 0, e.target.value)}
                    placeholder={currentGStep.placeholders[0]}
                    style={{ background: '#0b0f19', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#ffffff', fontSize: '14px' }}
                  />
                ) : (
                  currentGStep.placeholders.map((ph, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={groundInputs[currentGStep.key][idx]}
                      onChange={(e) => handleInputChange(currentGStep.key, idx, e.target.value)}
                      placeholder={ph}
                      style={{ background: '#0b0f19', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px', color: '#ffffff', fontSize: '13.5px' }}
                    />
                  ))
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setGroundStep((prev) => Math.max(0, prev - 1))}
                  disabled={groundStep === 0}
                  style={{ opacity: groundStep === 0 ? 0.5 : 1 }}
                >
                  Previous Step
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setGroundStep((prev) => prev + 1)}
                >
                  {groundStep === 4 ? 'Complete Grounding Exercise ✨' : 'Next Comfort Step ➔'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle2 color="#10b981" size={56} style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginBottom: '8px' }}>
                You Are Grounded, Safe & Present
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '540px', margin: '0 auto 24px' }}>
                Notice how your physical senses have anchored you back into this moment. The panic or racing thoughts do not hold power over you.
              </p>

              <div style={{ background: '#0b0f19', padding: '20px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto 24px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontSize: '14px', color: '#6366f1', marginBottom: '10px' }}>Your Comfort Summary:</h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Seeing:</strong> {groundInputs.see.filter(Boolean).join(', ') || '5 Objects'}</p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Feeling:</strong> {groundInputs.touch.filter(Boolean).join(', ') || 'Physical Sensations'}</p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Hearing:</strong> {groundInputs.hear.filter(Boolean).join(', ') || 'Ambient Sounds'}</p>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}><strong>Affirmation:</strong> "{groundInputs.affirmation || 'I am safe and calm.'}"</p>
              </div>

              <button
                className="btn-secondary"
                onClick={() => {
                  setGroundStep(0);
                  setGroundInputs({ see: ['', '', '', '', ''], touch: ['', '', '', ''], hear: ['', '', ''], smell: ['', ''], affirmation: '' });
                }}
              >
                <RefreshCw size={15} /> Repeat Comfort Grounding
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. LIVE 4-7-8 BREATHING TOOL */}
      {activeTool === 'breathing' && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
            4-7-8 Somatic Relaxation Breathing
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Follow the dynamic pulse ring. Inhale through your nose for 4s, hold for 7s, and exhale slowly for 8s to calm your parasympathetic nervous system.
          </p>

          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              margin: '0 auto 24px',
              background: breathePhase === 'Inhale' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : breathePhase === 'Hold' ? 'linear-gradient(135deg, #f59e0b, #8b5cf6)' : 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
              transform: breathePhase === 'Inhale' ? 'scale(1.15)' : breathePhase === 'Hold' ? 'scale(1.15)' : 'scale(0.95)',
              transition: 'transform 1s ease-in-out, background 0.5s ease'
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>{breathePhase}</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff' }}>{breatheTimer}s</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button className="btn-primary" onClick={() => setBreatheActive(!breatheActive)}>
              {breatheActive ? 'Pause Breathing Cycle' : 'Start Breathing Exercise'}
            </button>
            <button className="btn-secondary" onClick={() => { setBreatheActive(false); setBreathePhase('Inhale'); setBreatheTimer(4); }}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 4. POMODORO TIMER */}
      {activeTool === 'pomodoro' && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
            Academic Focus & Study Pacing (Pomodoro)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            Study in 25-minute focused bursts to reduce academic burnout and task aversion.
          </p>

          <div style={{ fontSize: '64px', fontWeight: '800', color: '#06b6d4', margin: '20px 0' }}>
            {formatPomoTime()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button className="btn-primary" onClick={() => setPomoActive(!pomoActive)}>
              {pomoActive ? 'Pause Timer' : 'Start 25-Min Study Session'}
            </button>
            <button className="btn-secondary" onClick={() => { setPomoActive(false); setPomoSeconds(25 * 60); }}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 5. CALMING AMBIENT AUDIO PLAYER */}
      {activeTool === 'ambient_audio' && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Volume2 size={24} /> Calming Ambient Soundscapes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '540px', margin: '0 auto 24px' }}>
            Listen to soothing frequency audio tailored to reduce cortisol, lower heart rate, and quiet racing thoughts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { id: 'rain', icon: '🌧️', title: 'Gentle Rain & Thunder', desc: 'Soft rainfall frequencies to quiet an overactive mind' },
              { id: 'ocean', icon: '🌊', title: 'Ocean Shore Waves', desc: 'Rhythmic tide sounds to synchronize deep breathing' },
              { id: 'forest', icon: '🌲', title: 'Forest Breeze', desc: 'Nature canopy sounds for grounding and stress relief' },
              { id: 'meditation', icon: '🧘', title: '432Hz Pink Noise', desc: 'Harmonic acoustic frequency for deep anxiety relief' }
            ].map((track) => (
              <div
                key={track.id}
                style={{
                  background: '#0b0f19',
                  padding: '20px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{track.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{track.title}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>{track.desc}</div>
                <button
                  className="btn-secondary"
                  onClick={() => alert(`Playing ${track.title} soundscape. Close your eyes and enjoy the calm!`)}
                  style={{ width: '100%', fontSize: '12.5px', padding: '8px' }}
                >
                  ▶ Play Soundscape
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
