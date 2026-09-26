// Dashboard JavaScript Engine
let trajectoryChart = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStudentProfiles();
  setupEventListeners();
});

function setupEventListeners() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeSingleSession);
  }

  const studentSelect = document.getElementById('studentSelect');
  if (studentSelect) {
    studentSelect.addEventListener('change', (e) => {
      loadStudentDetail(e.target.value);
    });
  }
}

function setSamplePrompt(text) {
  const input = document.getElementById('sessionText');
  if (input) {
    input.value = text;
    analyzeSingleSession();
  }
}

async function analyzeSingleSession() {
  const textInput = document.getElementById('sessionText');
  const text = textInput ? textInput.value.strip ? textInput.value.strip() : textInput.value.trim() : '';
  if (!text) return;

  const resultContainer = document.getElementById('liveSessionResults');
  resultContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">Processing Model 1 & 2 Inference...</div>`;

  try {
    const response = await fetch('/api/predict_session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();

    if (data.error) {
      resultContainer.innerHTML = `<div style="color:var(--accent-rose);">${data.error}</div>`;
      return;
    }

    renderLiveResults(data);
  } catch (err) {
    console.error(err);
    resultContainer.innerHTML = `<div style="color:var(--accent-rose);">Inference error occurred.</div>`;
  }
}

function renderLiveResults(data) {
  const container = document.getElementById('liveSessionResults');
  
  let sevBadgeClass = 'badge-improving';
  if (data.severity_score > 0.65) sevBadgeClass = 'badge-worsening';
  else if (data.severity_score > 0.35) sevBadgeClass = 'badge-stable';

  container.innerHTML = `
    <div class="metric-row">
      <div class="metric-box">
        <div class="metric-label">Predicted Emotion (Model 1)</div>
        <div class="metric-value" style="color: var(--accent-indigo);">${data.predicted_emotion}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Severity Score $s_t$</div>
        <div class="metric-value">
          <span class="badge ${sevBadgeClass}">${data.severity_score}</span>
        </div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Predicted Trigger (Model 2)</div>
        <div class="metric-value" style="color: var(--accent-cyan);">${data.predicted_trigger}</div>
      </div>
    </div>
    
    <div class="cbt-card">
      <div class="cbt-title">🎯 Model 2 CBT Intervention: ${data.cbt_recommendation.title}</div>
      <div style="font-size: 13.5px; color: var(--text-main); margin-bottom: 6px;"><strong>Clinical Strategy:</strong> ${data.cbt_recommendation.strategy}</div>
      <div style="font-size: 13px; color: var(--text-muted);"><strong>Recommended Exercise:</strong> ${data.cbt_recommendation.exercise}</div>
    </div>
  `;
}

async function loadStudentProfiles() {
  try {
    const res = await fetch('/api/students');
    const students = await res.json();
    
    const select = document.getElementById('studentSelect');
    const triageBody = document.getElementById('triageTableBody');
    
    if (select) select.innerHTML = '';
    if (triageBody) triageBody.innerHTML = '';
    
    let atRiskCount = 0;
    
    students.forEach((s) => {
      // Add to select
      if (select) {
        const opt = document.createElement('option');
        opt.value = s.student_id;
        opt.textContent = `${s.student_id} (${s.trend_name} - ${s.sequence_length} Sessions)`;
        select.appendChild(opt);
      }
      
      // Add at-risk students to counselor triage queue
      if (s.risk_flag === 1 || s.trend_name === 'Worsening') {
        atRiskCount++;
        if (triageBody) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${s.student_id}</strong></td>
            <td><span class="badge badge-worsening">WORSENING</span></td>
            <td><span style="font-weight:700; color:var(--accent-rose);">${s.latest_severity}</span></td>
            <td>${s.sequence_length} Sessions</td>
            <td><span class="badge badge-worsening">CRISIS ALERT</span></td>
            <td><button class="btn-primary" style="padding:6px 12px; font-size:12px;" onclick="loadStudentDetail('${s.student_id}')">Review Case</button></td>
          `;
          triageBody.appendChild(tr);
        }
      }
    });
    
    const atRiskBadge = document.getElementById('atRiskCount');
    if (atRiskBadge) atRiskBadge.textContent = `${atRiskCount} Flagged Students`;
    
    // Load first student detail
    if (students.length > 0) {
      loadStudentDetail(students[0].student_id);
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadStudentDetail(studentId) {
  try {
    const res = await fetch(`/api/student/${studentId}`);
    const student = await res.json();
    
    // Update Dropdown Selection if triggered externally
    const select = document.getElementById('studentSelect');
    if (select) select.value = studentId;
    
    renderTrajectoryChart(student);
    evaluateTrajectoryPrediction(student.sessions);
  } catch (err) {
    console.error(err);
  }
}

function renderTrajectoryChart(student) {
  const ctx = document.getElementById('trajectoryChart');
  if (!ctx) return;

  const labels = student.sessions.map((s) => `Session ${s.session_idx}`);
  const severities = student.sessions.map((s) => s.severity_score);

  if (trajectoryChart) {
    trajectoryChart.destroy();
  }

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(244, 63, 94, 0.4)');
  gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

  trajectoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `Severity Score Trajectory (${student.student_id})`,
          data: severities,
          borderColor: '#f43f5e',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Clinical Warning Threshold (0.65)',
          data: new Array(severities.length).fill(0.65),
          borderColor: '#f59e0b',
          borderDash: [6, 6],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          min: 0.0,
          max: 1.0,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

async function evaluateTrajectoryPrediction(sessions) {
  const container = document.getElementById('trajectoryPredictionResult');
  if (!container) return;

  try {
    const res = await fetch('/api/predict_trajectory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessions })
    });
    const data = await res.json();

    let trendClass = 'badge-improving';
    if (data.predicted_trend === 'Worsening') trendClass = 'badge-worsening';
    else if (data.predicted_trend === 'Stable') trendClass = 'badge-stable';

    container.innerHTML = `
      <div class="metric-row">
        <div class="metric-box">
          <div class="metric-label">Model 3 Trend Prediction</div>
          <div class="metric-value"><span class="badge ${trendClass}">${data.predicted_trend}</span></div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Trend Confidence</div>
          <div class="metric-value" style="color: var(--accent-emerald);">${(data.trend_confidence * 100).toFixed(1)}%</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Risk Flag Status</div>
          <div class="metric-value" style="color:${data.escalation_required ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
            ${data.escalation_required ? '⚠️ HIGH RISK' : '✅ NORMAL'}
          </div>
        </div>
      </div>
      <div style="margin-top:14px; padding:12px; background:rgba(15, 23, 42, 0.6); border-radius:8px; border:1px solid var(--border-color); font-size:13px;">
        <strong>Decision Layer Action:</strong> ${data.action_recommended}
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}
