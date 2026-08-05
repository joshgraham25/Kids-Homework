/*
 * words.js — built-in spelling & vocabulary word lists, grouped by age band.
 * Each word can optionally carry a short kid-friendly sentence and a hint,
 * used by the spelling game's "use it in a sentence" and vocab modes.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  // Young (5-7): short, common, phonetic words.
  const YOUNG = [
    { word: "cat", sentence: "The cat sat on the mat." },
    { word: "dog", sentence: "My dog likes to run." },
    { word: "sun", sentence: "The sun is very bright." },
    { word: "hat", sentence: "She wore a red hat." },
    { word: "run", sentence: "We run in the park." },
    { word: "big", sentence: "The elephant is big." },
    { word: "red", sentence: "I have a red ball." },
    { word: "box", sentence: "The toy is in the box." },
    { word: "fish", sentence: "A fish swims in water." },
    { word: "book", sentence: "I read a fun book." },
    { word: "tree", sentence: "A bird sits in the tree." },
    { word: "milk", sentence: "I drink milk at lunch." },
    { word: "jump", sentence: "The frog can jump high." },
    { word: "star", sentence: "One star is in the sky." },
    { word: "cake", sentence: "We ate birthday cake." },
    { word: "duck", sentence: "The duck went quack." },
    { word: "hand", sentence: "Raise your hand to answer." },
    { word: "frog", sentence: "The green frog hops." },
    { word: "ball", sentence: "Kick the ball to me." },
    { word: "bird", sentence: "The bird can fly." },
    { word: "moon", sentence: "The moon shines at night." },
    { word: "rain", sentence: "The rain makes puddles." },
    { word: "shoe", sentence: "Put on your left shoe." },
    { word: "play", sentence: "Let us play a game." },
  ];

  // Middle (8-10): longer words, common spelling-list patterns, tricky sounds.
  const MIDDLE = [
    { word: "because", sentence: "I smiled because it was fun." },
    { word: "friend", sentence: "My best friend is kind." },
    { word: "school", sentence: "We learn a lot at school." },
    { word: "family", sentence: "My family ate dinner together." },
    { word: "animal", sentence: "A tiger is a wild animal." },
    { word: "special", sentence: "Today is a special day." },
    { word: "weather", sentence: "The weather is sunny today." },
    { word: "beautiful", sentence: "The sunset is beautiful." },
    { word: "important", sentence: "Sleep is important for you." },
    { word: "different", sentence: "We chose different colors." },
    { word: "favorite", sentence: "Pizza is my favorite food." },
    { word: "birthday", sentence: "Her birthday is in May." },
    { word: "morning", sentence: "I brush my teeth every morning." },
    { word: "surprise", sentence: "The party was a surprise." },
    { word: "question", sentence: "I asked a good question." },
    { word: "remember", sentence: "Please remember your bag." },
    { word: "together", sentence: "We worked together as a team." },
    { word: "wonderful", sentence: "It was a wonderful trip." },
    { word: "chocolate", sentence: "I love chocolate cake." },
    { word: "dinosaur", sentence: "The dinosaur was huge." },
    { word: "adventure", sentence: "We went on an adventure." },
    { word: "sentence", sentence: "Write a full sentence." },
    { word: "measure", sentence: "Use a ruler to measure it." },
    { word: "science", sentence: "We did a science experiment." },
    { word: "picture", sentence: "I drew a picture of my dog." },
    { word: "thought", sentence: "I thought about the answer." },
    { word: "brought", sentence: "She brought her lunch." },
    { word: "enough", sentence: "We have enough snacks." },
  ];

  const LISTS = { young: YOUNG, middle: MIDDLE };

  HW.words = {
    // Return the built-in list for an age band.
    builtin(ageBand) {
      return (LISTS[ageBand] || LISTS.young).slice();
    },
    // Return the two built-in list labels the picker shows.
    builtinLabel(ageBand) {
      return ageBand === "middle" ? "Grade 3–5 Words" : "Grade K–2 Words";
    },
  };
})();
