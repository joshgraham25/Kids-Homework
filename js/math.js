/*
 * math.js — generates math questions tuned to an age band and operation.
 * Returns questions as { text, answer, choices } where choices are used for
 * the younger tap-to-answer mode.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Difficulty ranges per age band.
  const RANGES = {
    young: { add: [1, 10], sub: [1, 10], mul: null, div: null },
    middle: { add: [10, 99], sub: [10, 99], mul: [2, 12], div: [2, 12] },
  };

  // Which operations are offered for each age band.
  const OPS = {
    young: [
      { id: "add", label: "Adding", emoji: "➕" },
      { id: "sub", label: "Taking Away", emoji: "➖" },
      { id: "mix", label: "Mix It Up", emoji: "🎲" },
    ],
    middle: [
      { id: "add", label: "Adding", emoji: "➕" },
      { id: "sub", label: "Subtracting", emoji: "➖" },
      { id: "mul", label: "Times Tables", emoji: "✖️" },
      { id: "div", label: "Dividing", emoji: "➗" },
      { id: "mix", label: "Mix It Up", emoji: "🎲" },
    ],
  };

  function makeOne(op, ageBand) {
    const r = RANGES[ageBand] || RANGES.young;
    let a, b, answer, text;

    if (op === "add") {
      a = rnd(r.add[0], r.add[1]);
      b = rnd(r.add[0], r.add[1]);
      answer = a + b;
      text = `${a} + ${b}`;
    } else if (op === "sub") {
      a = rnd(r.sub[0], r.sub[1]);
      b = rnd(r.sub[0], r.sub[1]);
      if (b > a) [a, b] = [b, a]; // keep answers non-negative for kids
      answer = a - b;
      text = `${a} − ${b}`;
    } else if (op === "mul" && r.mul) {
      a = rnd(r.mul[0], r.mul[1]);
      b = rnd(r.mul[0], r.mul[1]);
      answer = a * b;
      text = `${a} × ${b}`;
    } else if (op === "div" && r.div) {
      // Build from a product so division is always whole.
      b = rnd(r.div[0], r.div[1]);
      answer = rnd(r.div[0], r.div[1]);
      a = b * answer;
      text = `${a} ÷ ${b}`;
    } else {
      // Fallback / unsupported op for this band -> addition.
      return makeOne("add", ageBand);
    }

    return { text: text + " = ?", answer };
  }

  // Build a set of multiple-choice options around the correct answer.
  function makeChoices(answer) {
    const choices = new Set([answer]);
    let guard = 0;
    while (choices.size < 4 && guard < 50) {
      guard++;
      const spread = Math.max(2, Math.round(Math.abs(answer) * 0.3));
      let cand = answer + rnd(-spread - 2, spread + 2);
      if (cand < 0) cand = Math.abs(cand);
      if (cand !== answer) choices.add(cand);
    }
    // Shuffle.
    const arr = Array.from(choices);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  HW.math = {
    operations(ageBand) {
      return (OPS[ageBand] || OPS.young).slice();
    },
    // Generate a question. For "mix", pick a random supported op.
    generate(op, ageBand) {
      let realOp = op;
      if (op === "mix") {
        const pool = (OPS[ageBand] || OPS.young)
          .map((o) => o.id)
          .filter((id) => id !== "mix");
        realOp = pool[rnd(0, pool.length - 1)];
      }
      const q = makeOne(realOp, ageBand);
      q.choices = makeChoices(q.answer);
      q.op = realOp;
      return q;
    },
  };
})();
