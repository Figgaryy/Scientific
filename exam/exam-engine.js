/* ============================================================
   CSS322 Mock Exam Engine
   Features: 2-hour timer, per-question numeric grading with tolerance,
             submit → auto-grade + reveal solutions, reset
   ============================================================ */
(function () {
  let timerInterval = null;
  let elapsedSeconds = 0;
  let examDurationSeconds = 2 * 60 * 60; // 2 hours
  let examStarted = false;
  let examSubmitted = false;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  function updateTimerDisplay() {
    const el = document.getElementById('exam-timer');
    if (!el) return;
    const remaining = examDurationSeconds - elapsedSeconds;
    el.textContent = formatTime(remaining);
    if (remaining <= 300) el.classList.add('urgent'); // last 5 min
    if (remaining <= 0) {
      clearInterval(timerInterval);
      submitExam(true); // auto-submit
    }
  }

  function startExam() {
    if (examStarted) return;
    examStarted = true;
    elapsedSeconds = 0;
    const btn = document.getElementById('exam-start');
    if (btn) btn.style.display = 'none';
    const container = document.querySelector('.exam-problems');
    if (container) container.classList.add('active');
    const submitBtn = document.getElementById('exam-submit');
    if (submitBtn) submitBtn.style.display = 'inline-block';
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function checkAnswer(questionEl) {
    const type = questionEl.dataset.type || 'num';
    const correctVal = questionEl.dataset.answer;
    const tol = parseFloat(questionEl.dataset.tol || '0.01');

    if (type === 'num') {
      const input = questionEl.querySelector('.exam-input');
      if (!input) return false;
      const userAns = parseFloat(input.value);
      const target = parseFloat(correctVal);
      if (isNaN(userAns)) {
        input.classList.add('empty');
        return false;
      }
      const ok = Math.abs(userAns - target) <= tol;
      input.classList.add(ok ? 'correct' : 'wrong');
      return ok;
    } else if (type === 'mc') {
      const chosen = questionEl.querySelector('input[type=radio]:checked');
      questionEl.querySelectorAll('label').forEach(l => l.classList.remove('correct','wrong'));
      const correctInput = questionEl.querySelector(`input[value="${correctVal}"]`);
      if (correctInput) correctInput.parentElement.classList.add('correct');
      if (chosen && chosen.value === correctVal) return true;
      if (chosen) chosen.parentElement.classList.add('wrong');
      return false;
    } else if (type === 'text') {
      const input = questionEl.querySelector('.exam-input');
      if (!input) return false;
      const userAns = (input.value || '').trim().toLowerCase();
      const target = (correctVal || '').trim().toLowerCase();
      const ok = userAns === target;
      input.classList.add(ok ? 'correct' : 'wrong');
      return ok;
    }
    return false;
  }

  function submitExam(autoSubmit) {
    if (examSubmitted) return;
    examSubmitted = true;
    clearInterval(timerInterval);

    let correct = 0;
    const questions = document.querySelectorAll('.exam-question');
    questions.forEach(q => {
      // Support multi-part questions with data-answer on sub-parts
      const parts = q.querySelectorAll('[data-answer]');
      if (parts.length && !q.dataset.answer) {
        // multi-part: check each part
        let partCorrect = 0;
        parts.forEach(p => { if (checkAnswer(p)) partCorrect++; });
        if (partCorrect === parts.length) correct++;
      } else {
        if (checkAnswer(q)) correct++;
      }
      // Reveal solution
      const sol = q.querySelector('.exam-solution');
      if (sol) sol.classList.add('reveal');
    });

    // Show score
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : pct >= 40 ? '💪' : '📚';
    const scoreBox = document.getElementById('exam-result');
    if (scoreBox) {
      scoreBox.classList.add('show');
      const grade = pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'D';
      scoreBox.innerHTML = `
        ${emoji} <b>คะแนน: ${correct}/${total} (${pct}%)</b> — เกรดประมาณ: ${grade}
        <br><small>${autoSubmit ? '⏰ หมดเวลา — ส่งอัตโนมัติ' : 'ใช้เวลา ' + formatTime(elapsedSeconds)}</small>
      `;
    }
    const submitBtn = document.getElementById('exam-submit');
    if (submitBtn) submitBtn.style.display = 'none';

    // Store score
    try {
      const p = JSON.parse(localStorage.getItem('css322_progress_v1')) || { visited:{}, scores:{} };
      const meta = document.querySelector('meta[name="page-id"]');
      const id = meta ? meta.content : 'mock';
      p.scores[id] = { score: correct, total, ts: Date.now(), pct };
      p.visited[id] = Date.now();
      localStorage.setItem('css322_progress_v1', JSON.stringify(p));
    } catch(e) {}

    // Re-render MathJax
    if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
    // Scroll to result
    scoreBox?.scrollIntoView({behavior:'smooth', block:'center'});
  }

  function resetExam() {
    if (!confirm('เริ่มใหม่ทั้งหมด? ข้อมูลปัจจุบันจะหาย')) return;
    location.reload();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('exam-start');
    if (startBtn) startBtn.addEventListener('click', startExam);
    const submitBtn = document.getElementById('exam-submit');
    if (submitBtn) submitBtn.addEventListener('click', () => submitExam(false));
    const resetBtn = document.getElementById('exam-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetExam);
  });
})();
