/*
 * audio.js — sound effects + read-aloud voice.
 * Sounds are generated with the Web Audio API so the app needs no audio files
 * and works completely offline. Speech uses the browser's built-in voices;
 * we pick the most natural-sounding one available and let a parent choose.
 */
(function () {
  const HW = (window.HW = window.HW || {});
  const SKEY = "homeworkHeroes.audio.v1";

  let ctx = null;
  let muted = false;
  let voices = [];
  let chosenVoiceURI = null; // parent's explicit pick, if any

  // ---- persisted settings (mute + chosen voice) ----
  (function loadSettings() {
    try {
      const raw = localStorage.getItem(SKEY);
      if (raw) {
        const s = JSON.parse(raw);
        muted = !!s.muted;
        chosenVoiceURI = s.voiceURI || null;
      }
    } catch (e) {
      /* ignore */
    }
  })();
  function saveSettings() {
    try {
      localStorage.setItem(SKEY, JSON.stringify({ muted, voiceURI: chosenVoiceURI }));
    } catch (e) {
      /* ignore */
    }
  }

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

  // ---- voice handling ----
  // Names that signal a higher-quality / more natural voice across platforms.
  const QUALITY_HINTS = [
    "natural", "neural", "premium", "enhanced", "eloquence",
    "siri", "google", "microsoft", "aria", "jenny", "guy",
    "samantha", "alex", "ava", "allison", "evan", "zoe", "nathan",
  ];

  function scoreVoice(v) {
    let score = 0;
    const name = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    if (lang.startsWith("en")) score += 40;
    if (lang === "en-us" || lang === "en_us") score += 10;
    QUALITY_HINTS.forEach((h) => {
      if (name.includes(h)) score += 8;
    });
    // Apple marks its best voices as not "default" but higher quality; a
    // localService voice tends to be more reliable/offline on mobile.
    if (v.localService) score += 3;
    return score;
  }

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    // Voices often populate asynchronously (especially in Chrome).
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function bestVoice() {
    if (!voices.length) loadVoices();
    if (chosenVoiceURI) {
      const picked = voices.find((v) => v.voiceURI === chosenVoiceURI);
      if (picked) return picked;
    }
    if (!voices.length) return null;
    return voices
      .slice()
      .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  }

  const audio = {
    setMuted(m) {
      muted = !!m;
      if (muted && "speechSynthesis" in window) window.speechSynthesis.cancel();
      saveSettings();
    },
    isMuted() {
      return muted;
    },
    correct() {
      tone(523.25, 0.12, "triangle", 0, 0.25);
      tone(659.25, 0.12, "triangle", 0.1, 0.25);
      tone(783.99, 0.2, "triangle", 0.2, 0.25);
    },
    wrong() {
      tone(311.13, 0.18, "sine", 0, 0.18);
      tone(261.63, 0.24, "sine", 0.14, 0.18);
    },
    tap() {
      tone(880, 0.05, "square", 0, 0.08);
    },
    fanfare() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => tone(n, 0.25, "triangle", i * 0.12, 0.28));
      tone(1318.51, 0.5, "triangle", notes.length * 0.12, 0.25);
    },
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
        u.rate = opts.rate != null ? opts.rate : 0.85; // clear & unhurried for kids
        u.pitch = opts.pitch != null ? opts.pitch : 1.0;
        const v = bestVoice();
        if (v) {
          u.voice = v;
          u.lang = v.lang;
        } else {
          u.lang = opts.lang || "en-US";
        }
        window.speechSynthesis.speak(u);
      } catch (e) {
        /* speech is a nice-to-have; ignore failures */
      }
    },
    canSpeak() {
      return "speechSynthesis" in window;
    },

    // ---- voice picker support (used by the Parent Area) ----
    // English voices, best first, for a dropdown.
    listVoices() {
      if (!voices.length) loadVoices();
      return voices
        .filter((v) => (v.lang || "").toLowerCase().startsWith("en"))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a));
    },
    currentVoiceURI() {
      const v = bestVoice();
      return v ? v.voiceURI : null;
    },
    setVoice(uri) {
      chosenVoiceURI = uri || null;
      saveSettings();
    },
  };

  HW.audio = audio;
})();
