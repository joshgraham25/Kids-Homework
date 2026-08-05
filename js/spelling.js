/*
 * spelling.js — helpers for the spelling game: choosing a word source,
 * shuffling into a round, and building gentle hints.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  HW.spelling = {
    // List every word source available to the current player: the built-in
    // list for their age band plus any custom lists a parent added.
    sources(player) {
      const list = [];
      list.push({
        id: "builtin",
        name: HW.words.builtinLabel(player.grade),
        words: HW.words.builtin(player.grade),
      });
      (player.customWords || []).forEach((cl) => {
        list.push({
          id: cl.id,
          name: cl.name,
          custom: true,
          words: cl.words.map((w) => ({ word: w })),
        });
      });
      return list;
    },

    // Prepare a round of up to `count` words from a source.
    buildRound(source, count) {
      const words = shuffle(source.words).slice(0, count || 10);
      return words;
    },

    // A hint that shows the first letter and blanks for the rest: "c _ _".
    hint(word) {
      const w = word.toLowerCase();
      return w
        .split("")
        .map((ch, i) => (i === 0 ? ch.toUpperCase() : ch === " " ? " " : "_"))
        .join(" ");
    },
  };
})();
