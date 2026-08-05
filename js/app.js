/*
 * app.js — the main application: screen router + UI for both games.
 * Uses only the browser (no framework, no build step) so the app runs by
 * simply opening index.html.
 */
(function () {
  const HW = window.HW;
  const { store, audio, math, spelling } = HW;
  const app = document.getElementById("app");
  const ROUND_LEN = 10;

  // ---------- tiny helpers ----------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function render(node) {
    app.innerHTML = "";
    app.appendChild(node);
    window.scrollTo(0, 0);
  }
  function on(root, selector, event, handler) {
    root.querySelectorAll(selector).forEach((n) => n.addEventListener(event, handler));
  }

  // Confetti-style celebration overlay.
  const celebrateEl = document.getElementById("celebrate");
  function celebrate(emojis) {
    const pieces = emojis || ["⭐", "🎉", "✨", "🌟", "💫"];
    celebrateEl.innerHTML = "";
    for (let i = 0; i < 24; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = pieces[i % pieces.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDelay = Math.random() * 0.3 + "s";
      s.style.fontSize = 18 + Math.random() * 26 + "px";
      celebrateEl.appendChild(s);
    }
    celebrateEl.classList.remove("hidden");
    setTimeout(() => celebrateEl.classList.add("hidden"), 1400);
  }

  function toast(msg, emoji) {
    const t = el(`<div class="toast">${emoji ? emoji + " " : ""}${esc(msg)}</div>`);
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 300);
    }, 2200);
  }

  function badgeBurst(badges) {
    badges.forEach((b, i) => setTimeout(() => {
      toast(`New badge: ${b.name}`, b.emoji);
      audio.star();
    }, i * 700));
  }

  // ---------- header ----------
  function header(title, opts) {
    opts = opts || {};
    const p = store.getCurrent();
    const stars = p ? p.stars : 0;
    return `
      <header class="topbar">
        ${opts.back ? `<button class="icon-btn" data-nav="${opts.back}" aria-label="Back">◀</button>` : `<span class="icon-btn ghost"></span>`}
        <h1 class="topbar-title">${esc(title)}</h1>
        <div class="topbar-right">
          ${p ? `<span class="star-count" title="Total stars">⭐ ${stars}</span>` : ""}
          <button class="icon-btn" data-nav="parent" aria-label="Parent area">⚙️</button>
        </div>
      </header>`;
  }

  // =========================================================
  // SCREEN: Profiles (pick or create a player)
  // =========================================================
  function screenProfiles() {
    const players = store.getPlayers();
    const cards = players
      .map(
        (p) => `
        <button class="profile-card" data-select="${p.id}">
          <span class="avatar">${p.avatar}</span>
          <span class="profile-name">${esc(p.name)}</span>
          <span class="profile-stars">⭐ ${p.stars}</span>
        </button>`
      )
      .join("");

    const node = el(`
      <div class="screen">
        <div class="hero-title">
          <div class="hero-emoji">🦸</div>
          <h1>Homework Heroes</h1>
          <p class="subtitle">Math & Spelling adventures</p>
        </div>
        <h2 class="section-title">${players.length ? "Who's playing?" : "Let's make your hero!"}</h2>
        <div class="profile-grid">
          ${cards}
          <button class="profile-card add" data-action="new">
            <span class="avatar">➕</span>
            <span class="profile-name">New Hero</span>
          </button>
        </div>
      </div>
    `);

    on(node, "[data-select]", "click", (e) => {
      audio.tap();
      store.setCurrent(e.currentTarget.getAttribute("data-select"));
      go("home");
    });
    on(node, "[data-action=new]", "click", () => {
      audio.tap();
      go("create");
    });
    render(node);
  }

  // =========================================================
  // SCREEN: Create player
  // =========================================================
  function screenCreate() {
    let avatar = store.AVATARS[0];
    let grade = store.GRADES[0].id;

    const avatars = store.AVATARS.map(
      (a, i) => `<button class="avatar-pick ${i === 0 ? "sel" : ""}" data-avatar="${a}">${a}</button>`
    ).join("");
    const grades = store.GRADES.map(
      (g, i) => `<button class="grade-btn ${i === 0 ? "sel" : ""}" data-grade="${g.id}"><span class="grade-short">${g.short}</span><span class="grade-label">${esc(g.label)}</span></button>`
    ).join("");

    const node = el(`
      <div class="screen">
        ${header("New Hero", { back: "profiles" })}
        <div class="card">
          <label class="field-label">What's your name?</label>
          <input id="name" class="text-input" maxlength="16" placeholder="Type your name" autocomplete="off" />

          <label class="field-label">Pick your hero</label>
          <div class="avatar-grid">${avatars}</div>

          <label class="field-label">What grade are you in?</label>
          <div class="grade-grid">${grades}</div>

          <button class="big-btn go" data-action="save">Start! 🚀</button>
        </div>
      </div>
    `);

    on(node, "[data-avatar]", "click", (e) => {
      audio.tap();
      avatar = e.currentTarget.getAttribute("data-avatar");
      node.querySelectorAll(".avatar-pick").forEach((b) => b.classList.remove("sel"));
      e.currentTarget.classList.add("sel");
    });
    on(node, "[data-grade]", "click", (e) => {
      audio.tap();
      grade = e.currentTarget.getAttribute("data-grade");
      node.querySelectorAll(".grade-btn").forEach((b) => b.classList.remove("sel"));
      e.currentTarget.classList.add("sel");
    });
    on(node, "[data-action=save]", "click", () => {
      const name = node.querySelector("#name").value.trim();
      if (!name) {
        toast("Please type a name", "✏️");
        node.querySelector("#name").focus();
        return;
      }
      store.addPlayer(name, avatar, grade);
      audio.fanfare();
      celebrate();
      go("home");
    });
    on(node, "[data-nav]", "click", (e) => go(e.currentTarget.getAttribute("data-nav")));
    render(node);
    setTimeout(() => node.querySelector("#name").focus(), 100);
  }

  // =========================================================
  // SCREEN: Home hub (choose a subject)
  // =========================================================
  function screenHome() {
    const p = store.getCurrent();
    if (!p) return go("profiles");

    const node = el(`
      <div class="screen">
        ${header("Hi, " + p.name + "!")}
        <div class="welcome">
          <span class="welcome-avatar">${p.avatar}</span>
          <div>
            <div class="welcome-line">You have <b>⭐ ${p.stars}</b> stars</div>
            <div class="welcome-sub">${p.badges.length} badge${p.badges.length === 1 ? "" : "s"} earned</div>
          </div>
        </div>

        <h2 class="section-title">Pick a game</h2>
        <div class="subject-grid">
          <button class="subject-card math" data-nav="math-setup">
            <span class="subject-emoji">🔢</span>
            <span class="subject-name">Math</span>
            <span class="subject-desc">Numbers & sums</span>
          </button>
          <button class="subject-card spell" data-nav="spell-setup">
            <span class="subject-emoji">🔤</span>
            <span class="subject-name">Spelling</span>
            <span class="subject-desc">Hear & type words</span>
          </button>
          <button class="subject-card trophy" data-nav="badges">
            <span class="subject-emoji">🏆</span>
            <span class="subject-name">My Trophies</span>
            <span class="subject-desc">Badges & stars</span>
          </button>
          <button class="subject-card switch" data-nav="profiles">
            <span class="subject-emoji">🔄</span>
            <span class="subject-name">Switch Hero</span>
            <span class="subject-desc">Another player</span>
          </button>
        </div>
      </div>
    `);
    wireNav(node);
    render(node);
  }

  // =========================================================
  // SCREEN: Math setup (pick operation)
  // =========================================================
  function screenMathSetup() {
    const p = store.getCurrent();
    if (!p) return go("profiles");
    const ops = math.operations(p.grade);
    const buttons = ops
      .map(
        (o) => `<button class="op-btn" data-op="${o.id}"><span class="op-sym">${o.emoji}</span><span>${esc(o.label)}</span></button>`
      )
      .join("");

    const node = el(`
      <div class="screen">
        ${header("Math", { back: "home" })}
        <h2 class="section-title">What do you want to practice?</h2>
        <div class="op-grid">${buttons}</div>
      </div>
    `);
    on(node, "[data-op]", "click", (e) => {
      audio.tap();
      startMath(e.currentTarget.getAttribute("data-op"));
    });
    wireNav(node);
    render(node);
  }

  // =========================================================
  // Math gameplay
  // =========================================================
  let game = null;

  function startMath(op) {
    const p = store.getCurrent();
    game = {
      subject: "math",
      op,
      grade: p.grade,
      index: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      starsEarned: 0,
      newBadges: [],
      typed: math.typedInput(p.grade), // upper grades type; earliest grades tap
    };
    nextMath();
  }

  function nextMath() {
    if (game.index >= ROUND_LEN) return finishRound();
    const q = math.generate(game.op, game.grade);
    game.current = q;

    const progress = `${game.index + 1} / ${ROUND_LEN}`;
    let answerArea;
    if (game.typed) {
      answerArea = `
        <div class="answer-typed">
          <input id="ans" class="answer-input" inputmode="numeric" autocomplete="off" placeholder="?" />
          <button class="big-btn go" data-action="check">Check ✓</button>
        </div>`;
    } else {
      answerArea = `<div class="choice-grid">${q.choices
        .map((c) => `<button class="choice-btn" data-choice="${c}">${c}</button>`)
        .join("")}</div>`;
    }

    const node = el(`
      <div class="screen play">
        ${header("Math", { back: "home" })}
        ${progressBar(game.index)}
        <div class="play-meta">
          <span class="pill">Question ${progress}</span>
          <span class="pill streak">🔥 ${game.streak}</span>
        </div>
        <div class="question-card">
          <div class="question-text">${esc(q.text)}</div>
        </div>
        ${answerArea}
        <div id="feedback" class="feedback"></div>
      </div>
    `);

    if (game.typed) {
      on(node, "[data-action=check]", "click", () => checkMathTyped(node));
      const inp = node.querySelector("#ans");
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkMathTyped(node);
      });
      setTimeout(() => inp.focus(), 80);
    } else {
      on(node, "[data-choice]", "click", (e) => {
        const val = parseInt(e.currentTarget.getAttribute("data-choice"), 10);
        checkMathChoice(node, val, e.currentTarget);
      });
    }
    wireNav(node);
    render(node);
  }

  function checkMathTyped(node) {
    const inp = node.querySelector("#ans");
    const raw = inp.value.trim();
    if (raw === "") {
      inp.focus();
      return;
    }
    const val = parseInt(raw, 10);
    handleMathResult(node, val === game.current.answer, null);
  }

  function checkMathChoice(node, val, btn) {
    const correct = val === game.current.answer;
    node.querySelectorAll(".choice-btn").forEach((b) => (b.disabled = true));
    if (correct) {
      btn.classList.add("right");
    } else {
      btn.classList.add("wrong");
      // highlight the correct choice
      node.querySelectorAll(".choice-btn").forEach((b) => {
        if (parseInt(b.getAttribute("data-choice"), 10) === game.current.answer) b.classList.add("right");
      });
    }
    handleMathResult(node, correct, btn);
  }

  function handleMathResult(node, correct, btn) {
    const fb = node.querySelector("#feedback");
    const rec = store.recordAnswer("math", correct);
    if (rec.newBadges.length) game.newBadges.push(...rec.newBadges);

    if (correct) {
      game.correct++;
      game.streak++;
      game.starsEarned++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      audio.correct();
      fb.innerHTML = `<span class="fb-good">${pickPraise()} +⭐</span>`;
      if (game.streak > 0 && game.streak % 5 === 0) celebrate();
    } else {
      game.streak = 0;
      audio.wrong();
      fb.innerHTML = `<span class="fb-bad">Almost! The answer is <b>${game.current.answer}</b></span>`;
    }
    store.setStreakBest(game.bestStreak);

    // disable typed input controls
    const checkBtn = node.querySelector("[data-action=check]");
    if (checkBtn) checkBtn.disabled = true;
    const inp = node.querySelector("#ans");
    if (inp) inp.disabled = true;

    game.index++;
    const delay = correct ? 900 : 1600;
    setTimeout(() => {
      if (game.index >= ROUND_LEN) finishRound();
      else nextMath();
    }, delay);
  }

  // =========================================================
  // SCREEN: Spelling setup (pick a word list)
  // =========================================================
  function screenSpellSetup() {
    const p = store.getCurrent();
    if (!p) return go("profiles");

    if (!audio.canSpeak()) {
      // Read-aloud is core to spelling; warn but still allow (hint-based).
    }

    const sources = spelling.sources(p);
    const cards = sources
      .map(
        (s) => `
        <button class="list-card" data-source="${s.id}">
          <span class="list-emoji">${s.custom ? "📝" : "📖"}</span>
          <span class="list-name">${esc(s.name)}</span>
          <span class="list-count">${s.words.length} words</span>
        </button>`
      )
      .join("");

    const node = el(`
      <div class="screen">
        ${header("Spelling", { back: "home" })}
        ${!audio.canSpeak() ? `<div class="notice">🔇 This browser can't read words aloud — you'll see a hint instead.</div>` : ""}
        <h2 class="section-title">Choose your words</h2>
        <div class="list-grid">
          ${cards}
        </div>
        <button class="ghost-btn" data-nav="parent">➕ Add this week's spelling words</button>
      </div>
    `);
    on(node, "[data-source]", "click", (e) => {
      audio.tap();
      startSpelling(e.currentTarget.getAttribute("data-source"));
    });
    wireNav(node);
    render(node);
  }

  function startSpelling(sourceId) {
    const p = store.getCurrent();
    const sources = spelling.sources(p);
    const source = sources.find((s) => s.id === sourceId) || sources[0];
    const words = spelling.buildRound(source, ROUND_LEN);
    game = {
      subject: "spelling",
      words,
      index: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      starsEarned: 0,
      newBadges: [],
      attemptsThisWord: 0,
    };
    nextSpelling();
  }

  function nextSpelling() {
    if (game.index >= game.words.length) return finishRound();
    const item = game.words[game.index];
    game.current = item;
    game.attemptsThisWord = 0;

    const progress = `${game.index + 1} / ${game.words.length}`;
    const hasSentence = !!item.sentence;
    const player = store.getCurrent();
    const useTiles = (player.spellInput || "keyboard") === "tiles";

    // Answer area: either a text box or a set of letter tiles.
    let answerArea;
    if (useTiles) {
      const answer = item.word.toLowerCase();
      const letters = answer.split("");
      // Always mix in extra "distractor" letters that are NOT part of the word,
      // so the tray is a random set the child has to choose from — not just the
      // exact letters rearranged. Older kids get a few more.
      const extraCount = player.grade === "K" || player.grade === "1" ? 3 : 5;
      const used = new Set(letters);
      const pool = shuffleInPlace(
        "abcdefghijklmnopqrstuvwxyz".split("").filter((c) => !used.has(c))
      );
      pool.slice(0, extraCount).forEach((c) => letters.push(c));
      shuffleInPlace(letters);
      const slotsHtml = answer
        .split("")
        .map(() => `<span class="tile-slot"></span>`)
        .join("");
      const tilesHtml = letters
        .map((L, i) => `<button type="button" class="tile" data-letter="${esc(L)}" data-tid="${i}">${esc(L)}</button>`)
        .join("");
      answerArea = `
        <div class="tiles-area">
          <div class="tile-slots">${slotsHtml}</div>
          <div class="tile-tray">${tilesHtml}</div>
          <div class="tiles-controls">
            <button class="tool-btn" data-action="cleartiles">↺ Clear</button>
            <button class="big-btn go" data-action="check" disabled>Check ✓</button>
          </div>
        </div>`;
    } else {
      answerArea = `
        <div class="answer-typed">
          <input id="spell" class="answer-input wide" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="type the word" />
          <button class="big-btn go" data-action="check">Check ✓</button>
        </div>`;
    }

    const node = el(`
      <div class="screen play">
        ${header("Spelling", { back: "home" })}
        ${progressBar(game.index, game.words.length)}
        <div class="play-meta">
          <span class="pill">Word ${progress}</span>
          <span class="pill streak">🔥 ${game.streak}</span>
        </div>

        <div class="listen-card">
          <button class="listen-btn" data-action="say" aria-label="Hear the word">🔊<span>Hear it</span></button>
          <div class="listen-tools">
            ${hasSentence ? `<button class="tool-btn" data-action="sentence">🔊 In a sentence</button>` : ""}
            <button class="tool-btn" data-action="hint">💡 Hint</button>
          </div>
          <div id="hintline" class="hintline"></div>
        </div>

        ${answerArea}
        <div id="feedback" class="feedback"></div>
      </div>
    `);

    const sayIt = () => audio.say(item.word);
    on(node, "[data-action=say]", "click", sayIt);
    // "In a sentence" is audio-only on purpose: the kid hears the word used in
    // context but never sees it spelled out. Only the Hint reveals letters.
    on(node, "[data-action=sentence]", "click", () => {
      audio.say(item.sentence, { rate: 0.9 });
    });
    on(node, "[data-action=hint]", "click", () => {
      node.querySelector("#hintline").textContent = spelling.hint(item.word);
    });

    if (useTiles) {
      wireTiles(node);
      on(node, '.tiles-controls [data-action="check"]', "click", () => checkSpellingTiles(node));
      on(node, "[data-action=cleartiles]", "click", () => {
        audio.tap();
        returnAllTiles(node);
      });
    } else {
      on(node, "[data-action=check]", "click", () => checkSpelling(node));
      const inp = node.querySelector("#spell");
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkSpelling(node);
      });
    }

    wireNav(node);
    render(node);
    // Auto-speak the word so kids hear it right away.
    setTimeout(() => {
      const inp = node.querySelector("#spell");
      if (inp) inp.focus();
      sayIt();
    }, 250);
  }

  // Shared scoring for a spelling attempt, used by both keyboard and tile
  // input. `opts.lock()` disables the input controls after a final result;
  // `opts.retry()` resets them so the child can try again.
  function handleSpellingGuess(node, guess, opts) {
    const answer = game.current.word.toLowerCase();
    const fb = node.querySelector("#feedback");

    if (guess === answer) {
      const rec = store.recordAnswer("spelling", true);
      if (rec.newBadges.length) game.newBadges.push(...rec.newBadges);
      game.correct++;
      game.streak++;
      game.starsEarned++;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      store.setStreakBest(game.bestStreak);
      audio.correct();
      fb.innerHTML = `<span class="fb-good">${pickPraise()} You spelled <b>${esc(answer)}</b>! +⭐</span>`;
      opts.lock();
      if (game.streak > 0 && game.streak % 5 === 0) celebrate();
      game.index++;
      setTimeout(() => (game.index >= game.words.length ? finishRound() : nextSpelling()), 1000);
    } else {
      game.attemptsThisWord++;
      if (game.attemptsThisWord >= 2) {
        // After two tries, count it, show the answer, and move on gently.
        const rec = store.recordAnswer("spelling", false);
        if (rec.newBadges.length) game.newBadges.push(...rec.newBadges);
        game.streak = 0;
        store.setStreakBest(game.bestStreak);
        audio.wrong();
        fb.innerHTML = `<span class="fb-bad">The word was <b>${esc(answer)}</b>. You'll get it next time!</span>`;
        opts.lock();
        game.index++;
        setTimeout(() => (game.index >= game.words.length ? finishRound() : nextSpelling()), 1800);
      } else {
        audio.wrong();
        fb.innerHTML = `<span class="fb-try">Not quite — try once more! 🎧</span>`;
        node.querySelector("#hintline").textContent = spelling.hint(answer);
        opts.retry();
        audio.say(game.current.word);
      }
    }
  }

  // Keyboard input.
  function checkSpelling(node) {
    const inp = node.querySelector("#spell");
    const guess = inp.value.trim().toLowerCase();
    if (guess === "") {
      inp.focus();
      return;
    }
    handleSpellingGuess(node, guess, {
      lock: () => {
        inp.disabled = true;
        node.querySelector("[data-action=check]").disabled = true;
      },
      retry: () => inp.select(),
    });
  }

  // Letter-tile input: read the letters placed in the slots, in order.
  function checkSpellingTiles(node) {
    const slots = Array.from(node.querySelectorAll(".tile-slot"));
    if (slots.some((s) => !s.querySelector(".tile"))) return; // not full yet
    const guess = slots.map((s) => s.querySelector(".tile").dataset.letter).join("");
    handleSpellingGuess(node, guess, {
      lock: () => {
        node.querySelectorAll(".tile, .tiles-controls button").forEach((b) => {
          b.disabled = true;
          b.classList.add("locked");
        });
      },
      retry: () => returnAllTiles(node),
    });
  }

  // Move every placed tile back to the tray.
  function returnAllTiles(node) {
    const tray = node.querySelector(".tile-tray");
    node.querySelectorAll(".tile-slot .tile").forEach((t) => tray.appendChild(t));
    const check = node.querySelector('.tiles-controls [data-action="check"]');
    if (check) check.disabled = true;
  }

  // Wire the letter tiles. Supports BOTH dragging a tile onto a slot and simply
  // tapping it (tap = place in next empty slot / send back to tray). Uses
  // Pointer Events so it behaves the same with a finger, stylus, or mouse.
  function wireTiles(node) {
    const area = node.querySelector(".tiles-area");
    const tray = node.querySelector(".tile-tray");
    const check = node.querySelector('.tiles-controls [data-action="check"]');
    const slots = () => Array.from(node.querySelectorAll(".tile-slot"));
    const DRAG_THRESHOLD = 6; // px of movement before it counts as a drag

    function refresh() {
      check.disabled = !slots().every((s) => s.querySelector(".tile"));
    }
    function nextEmptySlot() {
      return slots().find((s) => !s.querySelector(".tile"));
    }
    function placeInSlot(tile, slot) {
      const occupant = slot.querySelector(".tile");
      if (occupant && occupant !== tile) tray.appendChild(occupant); // swap out
      slot.appendChild(tile);
    }

    let active = null;

    function clearDragStyle(t) {
      t.classList.remove("dragging");
      t.style.position = t.style.left = t.style.top = "";
      t.style.width = t.style.height = t.style.zIndex = t.style.pointerEvents = "";
    }
    function beginDrag() {
      active.dragging = true;
      const t = active.tile;
      t.classList.add("dragging");
      t.style.position = "fixed";
      t.style.width = active.w + "px";
      t.style.height = active.h + "px";
      t.style.zIndex = "1000";
      t.style.pointerEvents = "none"; // so elementFromPoint sees the slot below
      moveTo(active.lastX, active.lastY);
    }
    function moveTo(x, y) {
      active.tile.style.left = x - active.offsetX + "px";
      active.tile.style.top = y - active.offsetY + "px";
    }

    function onDown(e) {
      const tile = e.target.closest(".tile");
      if (!tile || tile.classList.contains("locked") || !area.contains(tile)) return;
      e.preventDefault();
      const rect = tile.getBoundingClientRect();
      active = {
        tile,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        w: rect.width,
        h: rect.height,
        dragging: false,
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
    }
    function onMove(e) {
      if (!active) return;
      active.lastX = e.clientX;
      active.lastY = e.clientY;
      if (!active.dragging) {
        if (Math.hypot(e.clientX - active.startX, e.clientY - active.startY) > DRAG_THRESHOLD) beginDrag();
        else return;
      }
      e.preventDefault();
      moveTo(e.clientX, e.clientY);
    }
    function stop() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    }
    function onUp(e) {
      stop();
      if (!active) return;
      const t = active.tile;
      if (active.dragging) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        clearDragStyle(t);
        const slot = target && target.closest ? target.closest(".tile-slot") : null;
        if (slot && area.contains(slot)) placeInSlot(t, slot);
        else tray.appendChild(t); // dropped on the tray or anywhere else
      } else {
        // Treated as a tap.
        if (t.parentElement.classList.contains("tile-slot")) tray.appendChild(t);
        else {
          const empty = nextEmptySlot();
          if (empty) empty.appendChild(t);
        }
      }
      audio.tap();
      active = null;
      refresh();
    }
    function onCancel() {
      stop();
      if (!active) return;
      clearDragStyle(active.tile);
      tray.appendChild(active.tile);
      active = null;
      refresh();
    }

    area.addEventListener("pointerdown", onDown);
    refresh();
  }

  // =========================================================
  // SCREEN: Round results
  // =========================================================
  function finishRound() {
    const total = game.subject === "spelling" ? game.words.length : ROUND_LEN;
    const score = game.correct;
    const pct = Math.round((score / total) * 100);
    let medal = "🌱", msg = "Good try! Keep practicing!";
    if (pct >= 100) { medal = "🏆"; msg = "PERFECT! You're amazing!"; }
    else if (pct >= 80) { medal = "🥇"; msg = "Fantastic work!"; }
    else if (pct >= 60) { medal = "🥈"; msg = "Great job!"; }
    else if (pct >= 40) { medal = "🥉"; msg = "Nice effort!"; }

    audio.fanfare();
    celebrate(["⭐", "🎉", medal, "✨"]);

    const node = el(`
      <div class="screen">
        ${header("All done!", { back: "home" })}
        <div class="results-card">
          <div class="results-medal">${medal}</div>
          <div class="results-msg">${msg}</div>
          <div class="results-score">${score} / ${total} correct</div>
          <div class="results-stars">You earned ⭐ ${game.starsEarned} stars</div>
          <div class="results-streak">Best streak this round: 🔥 ${game.bestStreak}</div>
          <div class="results-actions">
            <button class="big-btn go" data-action="again">Play again 🔁</button>
            <button class="big-btn alt" data-nav="home">Home 🏠</button>
          </div>
        </div>
      </div>
    `);

    const subject = game.subject;
    const op = game.op;
    on(node, "[data-action=again]", "click", () => {
      audio.tap();
      if (subject === "math") startMath(op);
      else go("spell-setup");
    });
    wireNav(node);
    render(node);

    if (game.newBadges.length) badgeBurst(game.newBadges);
  }

  // =========================================================
  // SCREEN: Trophy room (badges + stats)
  // =========================================================
  function screenBadges() {
    const p = store.getCurrent();
    if (!p) return go("profiles");
    const badges = store.BADGES.map((b) => {
      const earned = p.badges.includes(b.id);
      return `<div class="badge ${earned ? "earned" : "locked"}" title="${esc(b.name)}">
          <span class="badge-emoji">${earned ? b.emoji : "🔒"}</span>
          <span class="badge-name">${esc(b.name)}</span>
        </div>`;
    }).join("");

    const node = el(`
      <div class="screen">
        ${header("My Trophies", { back: "home" })}
        <div class="stats-row">
          <div class="stat"><div class="stat-num">⭐ ${p.stars}</div><div class="stat-label">Stars</div></div>
          <div class="stat"><div class="stat-num">🔥 ${p.streakBest}</div><div class="stat-label">Best streak</div></div>
          <div class="stat"><div class="stat-num">${p.badges.length}/${store.BADGES.length}</div><div class="stat-label">Badges</div></div>
        </div>
        <div class="stats-row">
          <div class="stat small"><div class="stat-num">🔢 ${p.stats.math.correct}</div><div class="stat-label">Math correct</div></div>
          <div class="stat small"><div class="stat-num">🔤 ${p.stats.spelling.correct}</div><div class="stat-label">Words spelled</div></div>
        </div>
        <h2 class="section-title">Badge collection</h2>
        <div class="badge-grid">${badges}</div>
      </div>
    `);
    wireNav(node);
    render(node);
  }

  // =========================================================
  // SCREEN: Parent area
  // =========================================================
  function screenParent() {
    const p = store.getCurrent();
    const lists = (p && p.customWords) || [];
    const listHtml = lists.length
      ? lists
          .map(
            (l) => `<div class="wl-row">
              <span class="wl-name">📝 ${esc(l.name)} <small>(${l.words.length})</small></span>
              <button class="mini-btn danger" data-del="${l.id}">Delete</button>
            </div>`
          )
          .join("")
      : `<p class="muted">No custom lists yet. Add your child's weekly spelling words below.</p>`;

    const node = el(`
      <div class="screen">
        ${header("Parent Area", { back: "home" })}

        <div class="card">
          <h2 class="section-title flush">🔊 Sound</h2>
          <label class="switch-row">
            <span>Sound effects & read-aloud</span>
            <button id="mute" class="toggle ${audio.isMuted() ? "" : "on"}">${audio.isMuted() ? "OFF" : "ON"}</button>
          </label>
          ${audio.canSpeak() ? `
          <label class="field-label">Reading voice</label>
          <div class="voice-row">
            <select id="voice" class="select-input"></select>
            <button class="mini-btn" data-action="testvoice">▶ Test</button>
          </div>
          <p class="muted small">Tip: phones can download extra "premium/enhanced" voices in their system settings — those sound the most natural.</p>
          ` : `<p class="muted small">This browser can't read words aloud.</p>`}
        </div>

        ${p ? `
        <div class="card">
          <h2 class="section-title flush">🎓 ${esc(p.name)}'s grade level</h2>
          <p class="muted small">Sets how hard the math and spelling are. Move it up as they grow.</p>
          <div class="grade-grid">
            ${store.GRADES.map((g) => `<button class="grade-btn ${p.grade === g.id ? "sel" : ""}" data-setgrade="${g.id}"><span class="grade-short">${g.short}</span><span class="grade-label">${esc(g.label)}</span></button>`).join("")}
          </div>
        </div>` : ""}

        ${p ? `
        <div class="card">
          <h2 class="section-title flush">✏️ How ${esc(p.name)} answers spelling</h2>
          <div class="age-pick">
            <button class="age-btn ${(p.spellInput || "keyboard") === "keyboard" ? "sel" : ""}" data-input="keyboard">⌨️ Keyboard</button>
            <button class="age-btn ${(p.spellInput || "keyboard") === "tiles" ? "sel" : ""}" data-input="tiles">🔤 Letter tiles</button>
          </div>
          <p class="muted small">Letter tiles let younger kids build the word by tapping letters into place — no keyboard needed.</p>
        </div>` : ""}

        ${p ? `
        <div class="card">
          <h2 class="section-title flush">📝 Custom spelling words</h2>
          <p class="muted small">Add the words from ${esc(p.name)}'s spelling homework. Type or paste words separated by commas or new lines.</p>
          <input id="wlname" class="text-input" placeholder="List name (e.g. Week 5)" maxlength="30" />
          <textarea id="wlwords" class="text-area" placeholder="apple, orange, banana&#10;grape&#10;cherry"></textarea>
          <button class="big-btn go" data-action="addlist">Save word list ✓</button>
          <div class="wl-list">${listHtml}</div>
        </div>` : `<p class="muted">Pick a hero first to add custom words.</p>`}

        <div class="card">
          <h2 class="section-title flush">👥 Heroes</h2>
          <button class="ghost-btn" data-nav="profiles">Switch or add a hero</button>
          ${p ? `<button class="ghost-btn danger" data-action="delplayer">Delete "${esc(p.name)}" and their progress</button>` : ""}
        </div>

        <p class="muted small center">All progress is saved on this device only. Nothing is sent anywhere.</p>
      </div>
    `);

    on(node, "[data-setgrade]", "click", (e) => {
      audio.tap();
      const g = e.currentTarget.getAttribute("data-setgrade");
      store.updatePlayer(p.id, { grade: g });
      node.querySelectorAll("[data-setgrade]").forEach((b) => b.classList.remove("sel"));
      e.currentTarget.classList.add("sel");
      toast(`${p.name} is now in ${store.gradeLabel(g)}`, "🎓");
    });

    on(node, "[data-input]", "click", (e) => {
      audio.tap();
      const mode = e.currentTarget.getAttribute("data-input");
      store.updatePlayer(p.id, { spellInput: mode });
      node.querySelectorAll("[data-input]").forEach((b) => b.classList.remove("sel"));
      e.currentTarget.classList.add("sel");
    });

    on(node, "#mute", "click", (e) => {
      const nowMuted = !audio.isMuted();
      audio.setMuted(nowMuted);
      e.currentTarget.classList.toggle("on", !nowMuted);
      e.currentTarget.textContent = nowMuted ? "OFF" : "ON";
      if (!nowMuted) audio.tap();
    });

    // Populate the reading-voice dropdown. Voices can load a moment late on
    // some browsers, so fill now and again shortly after.
    const voiceSel = node.querySelector("#voice");
    if (voiceSel) {
      const fillVoices = () => {
        const list = audio.listVoices();
        if (!list.length) {
          voiceSel.innerHTML = `<option value="">Default voice</option>`;
          return;
        }
        const current = audio.currentVoiceURI();
        voiceSel.innerHTML = list
          .map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === current ? "selected" : ""}>${esc(v.name)}</option>`)
          .join("");
      };
      fillVoices();
      setTimeout(fillVoices, 400);
      voiceSel.addEventListener("change", () => {
        audio.setVoice(voiceSel.value);
        audio.say("Hi! Let's spell some words.");
      });
      on(node, "[data-action=testvoice]", "click", () => audio.say("Hi! Let's spell some words."));
    }

    on(node, "[data-action=addlist]", "click", () => {
      const name = node.querySelector("#wlname").value.trim();
      const raw = node.querySelector("#wlwords").value;
      const words = raw.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
      if (!words.length) {
        toast("Type some words first", "✏️");
        return;
      }
      const created = store.addCustomList(name || "My Words", words);
      if (!created) {
        toast("Use only letters (a–z) in words", "⚠️");
        return;
      }
      audio.star();
      toast(`Saved "${created.name}" with ${created.words.length} words`, "✅");
      screenParent();
    });

    on(node, "[data-del]", "click", (e) => {
      store.deleteCustomList(e.currentTarget.getAttribute("data-del"));
      audio.tap();
      screenParent();
    });

    on(node, "[data-action=delplayer]", "click", () => {
      if (confirm(`Delete ${p.name} and all their stars and badges? This cannot be undone.`)) {
        store.deletePlayer(p.id);
        go("profiles");
      }
    });

    wireNav(node);
    render(node);
  }

  // ---------- shared UI bits ----------
  function progressBar(index, total) {
    const t = total || ROUND_LEN;
    const pct = Math.round((index / t) * 100);
    return `<div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>`;
  }

  const PRAISE = ["Great!", "Nice!", "Awesome!", "You got it!", "Woohoo!", "Brilliant!", "Yes!", "Superb!", "Way to go!"];
  function pickPraise() {
    return PRAISE[Math.floor(Math.random() * PRAISE.length)];
  }

  function shuffleInPlace(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function wireNav(node) {
    on(node, "[data-nav]", "click", (e) => {
      audio.tap();
      go(e.currentTarget.getAttribute("data-nav"));
    });
  }

  // ---------- router ----------
  const ROUTES = {
    profiles: screenProfiles,
    create: screenCreate,
    home: screenHome,
    "math-setup": screenMathSetup,
    "spell-setup": screenSpellSetup,
    badges: screenBadges,
    parent: screenParent,
  };

  function go(route) {
    const fn = ROUTES[route];
    if (fn) fn();
    else screenProfiles();
  }

  // ---------- boot ----------
  function boot() {
    const p = store.getCurrent();
    if (p) go("home");
    else go("profiles");
  }
  boot();
})();
