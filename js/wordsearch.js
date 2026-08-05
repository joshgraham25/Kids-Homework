/*
 * wordsearch.js — builds a word-search puzzle from a set of words.
 * Returns { size, grid (size x size uppercase letters), placed: [{word, cells}] }
 * where cells is the ordered list of {r,c} the word occupies. Difficulty (grid
 * size, directions, word count) is tuned by grade.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  const DIRS = {
    E: [0, 1], S: [1, 0], SE: [1, 1], NE: [-1, 1],
    W: [0, -1], N: [-1, 0], SW: [1, -1], NW: [-1, -1],
  };

  // Allowed directions and puzzle shape per grade.
  function settings(grade) {
    switch (grade) {
      case "K":
      case "1":
        return { base: 8, count: 5, dirs: ["E", "S"] };
      case "2":
        return { base: 9, count: 6, dirs: ["E", "S", "SE"] };
      case "3":
        return { base: 10, count: 6, dirs: ["E", "S", "SE"] };
      case "4":
        return { base: 11, count: 7, dirs: ["E", "S", "SE", "NE"] };
      case "5":
        return { base: 12, count: 7, dirs: ["E", "S", "SE", "NE", "W", "N", "NW", "SW"] };
      default:
        return { base: 9, count: 6, dirs: ["E", "S", "SE"] };
    }
  }

  function rnd(n) {
    return Math.floor(Math.random() * n);
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function tryPlace(grid, size, word, dirs) {
    for (let attempt = 0; attempt < 120; attempt++) {
      const dir = DIRS[dirs[rnd(dirs.length)]];
      const [dr, dc] = dir;
      const len = word.length;
      // pick a start so the whole word stays in bounds
      const rMin = dr < 0 ? (len - 1) * -dr : 0;
      const rMax = dr > 0 ? size - 1 - (len - 1) * dr : size - 1;
      const cMin = dc < 0 ? (len - 1) * -dc : 0;
      const cMax = dc > 0 ? size - 1 - (len - 1) * dc : size - 1;
      if (rMax < rMin || cMax < cMin) continue;
      const r0 = rMin + rnd(rMax - rMin + 1);
      const c0 = cMin + rnd(cMax - cMin + 1);
      // check fit (empty cells or matching letters where words cross)
      let ok = true;
      const cells = [];
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        const existing = grid[r][c];
        if (existing && existing !== word[i]) {
          ok = false;
          break;
        }
        cells.push({ r, c });
      }
      if (!ok) continue;
      for (let i = 0; i < len; i++) grid[cells[i].r][cells[i].c] = word[i];
      return cells;
    }
    return null;
  }

  HW.wordsearch = {
    build(rawWords, grade) {
      const cfg = settings(grade);
      // normalize, keep only letters, dedupe, sensible length
      const cleaned = [];
      const seen = {};
      rawWords
        .map((w) => String(w).toLowerCase().replace(/[^a-z]/g, ""))
        .filter((w) => w.length >= 3 && w.length <= 12)
        .forEach((w) => {
          if (!seen[w]) {
            seen[w] = 1;
            cleaned.push(w);
          }
        });
      const chosen = shuffle(cleaned).slice(0, cfg.count);
      const longest = chosen.reduce((m, w) => Math.max(m, w.length), 0);
      const size = Math.min(14, Math.max(cfg.base, longest));

      const grid = [];
      for (let r = 0; r < size; r++) grid.push(new Array(size).fill(""));

      const placed = [];
      // place longest first for a better fit
      shuffle(chosen)
        .sort((a, b) => b.length - a.length)
        .forEach((w) => {
          const cells = tryPlace(grid, size, w, cfg.dirs);
          if (cells) placed.push({ word: w, cells: cells });
        });

      // fill blanks with random letters
      const az = "abcdefghijklmnopqrstuvwxyz";
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!grid[r][c]) grid[r][c] = az[rnd(26)];
        }
      }

      return { size: size, grid: grid, placed: placed };
    },
  };
})();
