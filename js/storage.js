/*
 * storage.js — player profiles, progress, stars, badges, and custom spelling
 * lists. Everything is saved in the browser's localStorage, so nothing leaves
 * the device and no account or internet is needed.
 */
(function () {
  const HW = (window.HW = window.HW || {});
  const KEY = "homeworkHeroes.v1";

  const AVATARS = ["🦸", "🦹", "🐱", "🐶", "🦊", "🐼", "🦄", "🐸", "🐙", "🦖", "🌟", "🚀"];

  function blankState() {
    return { players: [], currentId: null };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blankState();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.players)) return blankState();
      return data;
    } catch (e) {
      return blankState();
    }
  }

  let state = load();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage may be full or disabled; the app still works for the session */
    }
  }

  function uid() {
    return "p_" + Math.random().toString(36).slice(2, 9);
  }

  const store = {
    AVATARS,

    getPlayers() {
      return state.players.slice();
    },

    getCurrent() {
      return state.players.find((p) => p.id === state.currentId) || null;
    },

    setCurrent(id) {
      state.currentId = id;
      persist();
    },

    addPlayer(name, avatar, ageBand) {
      const player = {
        id: uid(),
        name: (name || "Hero").trim().slice(0, 16) || "Hero",
        avatar: avatar || AVATARS[0],
        ageBand: ageBand || "young", // "young" (5-7) or "middle" (8-10)
        stars: 0,
        badges: [],
        streakBest: 0,
        // per-subject stats: { attempted, correct }
        stats: { math: { attempted: 0, correct: 0 }, spelling: { attempted: 0, correct: 0 } },
        customWords: [], // parent-added spelling lists: { name, words: [] }
        createdAt: Date.now(),
      };
      state.players.push(player);
      state.currentId = player.id;
      persist();
      return player;
    },

    updatePlayer(id, patch) {
      const p = state.players.find((x) => x.id === id);
      if (!p) return null;
      Object.assign(p, patch);
      persist();
      return p;
    },

    deletePlayer(id) {
      state.players = state.players.filter((p) => p.id !== id);
      if (state.currentId === id) state.currentId = null;
      persist();
    },

    // Record the result of one question and award stars. Returns any newly
    // earned badges so the UI can celebrate them.
    recordAnswer(subject, correct) {
      const p = this.getCurrent();
      if (!p) return { newBadges: [] };
      const s = p.stats[subject] || (p.stats[subject] = { attempted: 0, correct: 0 });
      s.attempted += 1;
      if (correct) {
        s.correct += 1;
        p.stars += 1;
      }
      const newBadges = checkBadges(p);
      persist();
      return { newBadges };
    },

    setStreakBest(streak) {
      const p = this.getCurrent();
      if (!p) return;
      if (streak > p.streakBest) p.streakBest = streak;
      persist();
    },

    // ---- Custom spelling lists (a parent feature) ----
    addCustomList(name, words) {
      const p = this.getCurrent();
      if (!p) return null;
      const list = {
        id: "wl_" + Math.random().toString(36).slice(2, 8),
        name: (name || "My Words").trim().slice(0, 30) || "My Words",
        words: words
          .map((w) => String(w).trim().toLowerCase())
          .filter((w) => w.length > 0 && /^[a-z'-]+$/.test(w)),
      };
      if (!list.words.length) return null;
      p.customWords.push(list);
      persist();
      return list;
    },

    deleteCustomList(listId) {
      const p = this.getCurrent();
      if (!p) return;
      p.customWords = p.customWords.filter((l) => l.id !== listId);
      persist();
    },
  };

  // Badge definitions: each has a test against the current player.
  const BADGES = [
    { id: "first_star", emoji: "⭐", name: "First Star", test: (p) => p.stars >= 1 },
    { id: "ten_stars", emoji: "🌟", name: "Rising Star", test: (p) => p.stars >= 10 },
    { id: "fifty_stars", emoji: "💫", name: "Star Collector", test: (p) => p.stars >= 50 },
    { id: "hundred_stars", emoji: "🏆", name: "Superstar", test: (p) => p.stars >= 100 },
    { id: "math_25", emoji: "🔢", name: "Number Ninja", test: (p) => p.stats.math.correct >= 25 },
    { id: "math_100", emoji: "🧮", name: "Math Master", test: (p) => p.stats.math.correct >= 100 },
    { id: "spell_25", emoji: "🔤", name: "Word Wizard", test: (p) => p.stats.spelling.correct >= 25 },
    { id: "spell_100", emoji: "📚", name: "Spelling Champ", test: (p) => p.stats.spelling.correct >= 100 },
    { id: "streak_5", emoji: "🔥", name: "On Fire", test: (p) => p.streakBest >= 5 },
    { id: "streak_10", emoji: "⚡", name: "Unstoppable", test: (p) => p.streakBest >= 10 },
  ];

  function checkBadges(p) {
    const earned = [];
    BADGES.forEach((b) => {
      if (!p.badges.includes(b.id) && b.test(p)) {
        p.badges.push(b.id);
        earned.push(b);
      }
    });
    return earned;
  }

  store.BADGES = BADGES;
  store.getBadge = (id) => BADGES.find((b) => b.id === id);

  HW.store = store;
})();
