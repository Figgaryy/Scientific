/* ============================================================
   CSS322 Scientific Computing — Shared JS
   Features: theme toggle, progress (localStorage), accordion,
             solution toggle, quiz engine, active nav
   ============================================================ */

(function () {
  const STORAGE_KEY = 'css322_progress_v1';
  const THEME_KEY = 'css322_theme';

  // ---------- Theme ----------
  function initTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) document.documentElement.setAttribute('data-theme', saved);
    } catch (e) {}
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        btn.textContent = next === 'dark' ? '☀️ โหมดสว่าง' : '🌙 โหมดมืด';
      });
      // Set initial label
      const cur = document.documentElement.getAttribute('data-theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      btn.textContent = cur === 'dark' ? '☀️ โหมดสว่าง' : '🌙 โหมดมืด';
    });
  }

  // ---------- Progress ----------
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { visited: {}, scores: {} };
    } catch (e) { return { visited: {}, scores: {} }; }
  }
  function setProgress(p) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  function markVisited(pageId) {
    if (!pageId) return;
    const p = getProgress();
    p.visited[pageId] = Date.now();
    setProgress(p);
  }
  function saveScore(quizId, score, total) {
    const p = getProgress();
    p.scores[quizId] = { score, total, ts: Date.now() };
    setProgress(p);
  }

  // ---------- Sidebar nav highlight & status ----------
  function updateNavStatus() {
    const p = getProgress();
    document.querySelectorAll('.nav a[data-page]').forEach(a => {
      const id = a.dataset.page;
      const status = a.querySelector('.status');
      if (p.visited[id]) {
        a.classList.add('done');
        if (status) status.textContent = '✓';
      }
      // Active
      const path = window.location.pathname.split('/').pop();
      const href = a.getAttribute('href').split('/').pop();
      if (path === href || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ---------- Progress display ----------
  function updateProgressBox() {
    const box = document.querySelector('.progress-fill');
    if (!box) return;
    const p = getProgress();
    const totalPages = 9; // 5 chapters + 4 homework
    const done = Object.keys(p.visited).length;
    const pct = Math.min(100, Math.round((done / totalPages) * 100));
    box.style.width = pct + '%';
    const txt = document.querySelector('.progress-text');
    if (txt) txt.textContent = `${done}/${totalPages} หน้า (${pct}%)`;
  }

  // ---------- Chapter cards (landing) ----------
  function updateChapterCards() {
    const p = getProgress();
    document.querySelectorAll('.chapter-card[data-page]').forEach(card => {
      const id = card.dataset.page;
      const fill = card.querySelector('.card-progress-fill');
      if (!fill) return;
      if (p.visited[id]) {
        const score = p.scores[id];
        if (score) {
          const pct = Math.round((score.score / score.total) * 100);
          fill.style.width = pct + '%';
          const badge = card.querySelector('.card-badge');
          if (badge) badge.textContent = `📊 ${score.score}/${score.total} คะแนน`;
        } else {
          fill.style.width = '50%';
          const badge = card.querySelector('.card-badge');
          if (badge) badge.textContent = '👁️ อ่านแล้ว';
        }
      }
    });
  }

  // ---------- Accordion (Worked Examples) ----------
  function initAccordion() {
    document.querySelectorAll('.example-header').forEach(h => {
      h.addEventListener('click', () => {
        h.parentElement.classList.toggle('open');
      });
    });
  }

  // ---------- Solution toggle ----------
  function initSolutionToggle() {
    document.querySelectorAll('.solution-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sol = btn.closest('.solution');
        sol.classList.toggle('show');
        btn.textContent = sol.classList.contains('show') ? '🙈 ซ่อนเฉลย' : '💡 ดูเฉลย';
      });
    });
  }

  // ---------- Quiz Engine ----------
  function initQuiz() {
    document.querySelectorAll('.quiz-container').forEach(quiz => {
      const quizId = quiz.dataset.quiz || 'unnamed';
      const submitBtn = quiz.querySelector('.quiz-submit');
      const resetBtn = quiz.querySelector('.quiz-reset');
      const scoreBox = quiz.querySelector('.quiz-score');

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          let correct = 0;
          const questions = quiz.querySelectorAll('.quiz-question');
          questions.forEach(q => {
            const correctVal = q.dataset.answer;
            const type = q.dataset.type || 'mc';
            let userAns = null;
            let isCorrect = false;

            if (type === 'mc') {
              const chosen = q.querySelector('input[type=radio]:checked');
              // Clear labels
              q.querySelectorAll('label').forEach(l => l.classList.remove('correct', 'wrong'));
              if (chosen) {
                userAns = chosen.value;
                if (userAns === correctVal) {
                  isCorrect = true;
                  chosen.parentElement.classList.add('correct');
                } else {
                  chosen.parentElement.classList.add('wrong');
                  // Highlight correct
                  const correctInput = q.querySelector(`input[value="${correctVal}"]`);
                  if (correctInput) correctInput.parentElement.classList.add('correct');
                }
              } else {
                // No answer selected — highlight correct
                const correctInput = q.querySelector(`input[value="${correctVal}"]`);
                if (correctInput) correctInput.parentElement.classList.add('correct');
              }
            } else if (type === 'num') {
              const input = q.querySelector('.q-input');
              if (input) {
                userAns = parseFloat(input.value);
                const target = parseFloat(correctVal);
                const tol = parseFloat(q.dataset.tol || '0.01');
                if (!isNaN(userAns) && Math.abs(userAns - target) <= tol) {
                  isCorrect = true;
                  input.style.borderColor = 'var(--success)';
                  input.style.background = '#d4edda';
                } else {
                  input.style.borderColor = 'var(--danger)';
                  input.style.background = '#f8d7da';
                }
              }
            } else if (type === 'text') {
              const input = q.querySelector('.q-input');
              if (input) {
                userAns = (input.value || '').trim().toLowerCase();
                const target = (correctVal || '').trim().toLowerCase();
                if (userAns === target) {
                  isCorrect = true;
                  input.style.borderColor = 'var(--success)';
                  input.style.background = '#d4edda';
                } else {
                  input.style.borderColor = 'var(--danger)';
                  input.style.background = '#f8d7da';
                }
              }
            }

            const explain = q.querySelector('.q-explain');
            if (explain) explain.classList.add('show');
            if (isCorrect) correct++;
          });

          const total = questions.length;
          if (scoreBox) {
            scoreBox.classList.add('show');
            const pct = Math.round((correct / total) * 100);
            let emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
            scoreBox.innerHTML = `${emoji} คะแนน: <b>${correct}/${total}</b> (${pct}%)`;
          }
          saveScore(quizId, correct, total);
          if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          quiz.querySelectorAll('input[type=radio]').forEach(i => i.checked = false);
          quiz.querySelectorAll('.q-input').forEach(i => {
            i.value = '';
            i.style.borderColor = '';
            i.style.background = '';
          });
          quiz.querySelectorAll('label').forEach(l => l.classList.remove('correct', 'wrong'));
          quiz.querySelectorAll('.q-explain').forEach(e => e.classList.remove('show'));
          if (scoreBox) scoreBox.classList.remove('show');
        });
      }
    });
  }

  // ---------- MathJax loader ----------
  function loadMathJax() {
    if (window.MathJax) return;
    window.MathJax = {
      tex: {
        inlineMath: [['\\(', '\\)'], ['$', '$']],
        displayMath: [['\\[', '\\]'], ['$$', '$$']],
        processEscapes: true
      },
      svg: { fontCache: 'global' }
    };
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAccordion();
    initSolutionToggle();
    initQuiz();
    updateNavStatus();
    updateProgressBox();
    updateChapterCards();

    // Mark page as visited
    const pageMeta = document.querySelector('meta[name="page-id"]');
    if (pageMeta) markVisited(pageMeta.content);

    loadMathJax();
  });
})();
