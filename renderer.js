(() => {
  const TOTAL_SECONDS = 300; // 5:00, same as original app

  let seconds = TOTAL_SECONDS;
  let timerRunning = false;
  let intervalId = null;

  let redScoreTotal = 0;
  let blueScoreTotal = 0;

  const body = document.getElementById('body');
  const timeLabel = document.getElementById('timeLabel');
  const startStopBtn = document.getElementById('startStop');
  const resetButton = document.getElementById('resetButton');
  const redScoreEl = document.getElementById('redScore');
  const blueScoreEl = document.getElementById('blueScore');
  const pointButtons = document.querySelectorAll('.point-btn');

  function setPointButtonsEnabled(enabled) {
    pointButtons.forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function formatTime(totalSecs) {
    const clamped = Math.max(totalSecs, 0);
    const m = Math.floor(clamped / 60).toString().padStart(2, '0');
    const s = Math.floor(clamped % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function setPhase(phaseClass) {
    body.classList.remove('phase-green', 'phase-blue', 'phase-orange', 'phase-red');
    if (phaseClass) body.classList.add(phaseClass);
  }

  // Short audible alert using the Web Audio API so the app doesn't depend
  // on a Windows-only sound file (the original used c:\Windows\Media\chimes.wav).
  function playTimeUpSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      [880, 660, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.001, now + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.25 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.24);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.25);
      });
    } catch (err) {
      console.error('Could not play alert sound:', err);
    }
  }

  function updateTimeDisplay() {
    timeLabel.textContent = formatTime(seconds);
  }

  function tick() {
    seconds -= 1;
    updateTimeDisplay();

    if (seconds < TOTAL_SECONDS / 2) {
      setPhase('phase-green');
    }
    if (seconds < 30) {
      setPhase('phase-blue');
    }
    if (seconds < 10) {
      setPhase('phase-orange');
    }
    if (seconds < 0) {
      stopTimer();
      setPhase('phase-red');
      playTimeUpSound();
    }
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    intervalId = setInterval(tick, 1000);
    setPointButtonsEnabled(true);
  }

  function stopTimer() {
    timerRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    setPointButtonsEnabled(false);
  }

  function toggleTimer() {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function resetAll() {
    stopTimer();
    seconds = TOTAL_SECONDS;
    updateTimeDisplay();
    setPhase(null);

    redScoreTotal = 0;
    blueScoreTotal = 0;
    redScoreEl.textContent = redScoreTotal;
    blueScoreEl.textContent = blueScoreTotal;
  }

  function addPoints(side, points) {
    if (side === 'red') {
      redScoreTotal += points;
      redScoreEl.textContent = redScoreTotal;
    } else {
      blueScoreTotal += points;
      blueScoreEl.textContent = blueScoreTotal;
    }
  }

  // Wire up events
  startStopBtn.addEventListener('click', toggleTimer);
  resetButton.addEventListener('click', resetAll);

  document.getElementById('redNegative').addEventListener('click', () => addPoints('red', -1));
  document.getElementById('blueNegative').addEventListener('click', () => addPoints('blue', -1));

  document.querySelectorAll('.point-btn').forEach((btn) => {
    const side = btn.dataset.side;
    const points = parseInt(btn.dataset.points, 10);
    btn.addEventListener('click', () => addPoints(side, points));
  });

  // Initial render
  updateTimeDisplay();
  setPointButtonsEnabled(false);
})();
