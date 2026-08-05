/*
 * math.js — generates math questions tuned to a grade level and operation.
 * Returns questions as { text, answer, choices } where choices are used for
 * the younger grades' tap-to-answer mode.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Operand ranges per grade. Ranges are chosen so sums/answers land in the
  // range that grade typically practices (e.g. "within 20" for 1st grade).
  const RANGES = {
    K: { add: [0, 5], sub: [0, 10], mul: null, div: null },
    "1": { add: [1, 10], sub: [1, 20], mul: null, div: null },
    "2": { add: [10, 50], sub: [10, 99], mul: null, div: null },
    "3": { add: [10, 50], sub: [10, 99], mul: [2, 10], div: [2, 10] },
    "4": { add: [50, 500], sub: [100, 999], mul: [2, 12], div: [2, 12] },
    "5": { add: [100, 500], sub: [100, 999], mul: [3, 12], div: [3, 12] },
  };

  // Which operations each grade practices.
  const ADD = { id: "add", label: "Adding", emoji: "➕" };
  const SUB = { id: "sub", label: "Subtracting", emoji: "➖" };
  const SUB_YOUNG = { id: "sub", label: "Taking Away", emoji: "➖" };
  const MUL = { id: "mul", label: "Times Tables", emoji: "✖️" };
  const DIV = { id: "div", label: "Dividing", emoji: "➗" };
  const MIX = { id: "mix", label: "Mix It Up", emoji: "🎲" };

  const OPS = {
    K: [ADD, SUB_YOUNG, MIX],
    "1": [ADD, SUB_YOUNG, MIX],
    "2": [ADD, SUB, MIX],
    "3": [ADD, SUB, MUL, DIV, MIX],
    "4": [ADD, SUB, MUL, DIV, MIX],
    "5": [ADD, SUB, MUL, DIV, MIX],
  };

  // Grades that type answers vs. tap a multiple choice. The youngest tap.
  const TYPED = { K: false, "1": false, "2": true, "3": true, "4": true, "5": true };

  function makeOne(op, grade) {
    const r = RANGES[grade] || RANGES.K;
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
      // Fallback / unsupported op for this grade -> addition.
      return makeOne("add", grade);
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
    const arr = Array.from(choices);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  HW.math = {
    operations(grade) {
      return (OPS[grade] || OPS.K).slice();
    },
    // True if this grade types its answers; false = tap a multiple choice.
    typedInput(grade) {
      return !!TYPED[grade];
    },
    // Generate a question. For "mix", pick a random supported op.
    generate(op, grade) {
      let realOp = op;
      if (op === "mix") {
        const pool = (OPS[grade] || OPS.K)
          .map((o) => o.id)
          .filter((id) => id !== "mix");
        realOp = pool[rnd(0, pool.length - 1)];
      }
      const q = makeOne(realOp, grade);
      q.choices = makeChoices(q.answer);
      q.op = realOp;
      return q;
    },
  };
})();
