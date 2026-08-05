/*
 * audio.js — sound effects + read-aloud voice.
 * Sounds are generated with the Web Audio API so the app needs no audio files
 * and works completely offline. Speech uses the browser's built-in voice.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    // Browsers suspend audio until a user gesture; resume on demand.
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Play a short tone. type: sine/square/triangle/sawtooth
  function tone(freq, duration, type, when, gain) {
    const ac = getCtx();
    if (!ac || muted) return;
    const t0 = ac.currentTime + (when || 0);
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.2, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  const audio = {
    setMuted(m) {
      muted = !!m;
    },
    isMuted() {
      return muted;
    },
    // Cheerful rising arpeggio for a correct answer.
    correct() {
      tone(523.25, 0.12, "triangle", 0, 0.25); // C5
      tone(659.25, 0.12, "triangle", 0.1, 0.25); // E5
      tone(783.99, 0.2, "triangle", 0.2, 0.25); // G5
    },
    // Gentle low "try again" — never harsh, so mistakes don't feel like failure.
    wrong() {
      tone(311.13, 0.18, "sine", 0, 0.18); // Eb4
      tone(261.63, 0.24, "sine", 0.14, 0.18); // C4
    },
    // Soft click for button taps.
    tap() {
      tone(880, 0.05, "square", 0, 0.08);
    },
    // Big fanfare for finishing a round / earning a badge.
    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => tone(n, 0.25, "triangle", i * 0.12, 0.28));
      tone(1318.51, 0.5, "triangle", notes.length * 0.12, 0.25);
    },
    // Star sparkle sound.
    star() {
      tone(1046.5, 0.08, "triangle", 0, 0.2);
      tone(1567.98, 0.12, "triangle", 0.06, 0.2);
    },
    // Read text aloud (used by the spelling game).
    say(text, opts) {
      opts = opts || {};
      if (muted) return;
      if (!("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = opts.rate != null ? opts.rate : 0.9; // a touch slower for kids
        u.pitch = opts.pitch != null ? opts.pitch : 1.05;
        u.lang = opts.lang || "en-US";
        window.speechSynthesis.speak(u);
      } catch (e) {
        /* speech is a nice-to-have; ignore failures */
      }
    },
    // Is read-aloud even available in this browser?
    canSpeak() {
      return "speechSynthesis" in window;
    },
  };

  HW.audio = audio;
})();
