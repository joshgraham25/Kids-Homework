/*
 * words.js — built-in spelling & vocabulary word lists, grouped by grade level
 * (Kindergarten through 5th grade). Younger grades carry a short kid-friendly
 * sentence used by the spelling game's "in a sentence" helper.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  // Kindergarten: simple CVC words + earliest sight words.
  const K = [
    { word: "cat", sentence: "The cat sat on the mat." },
    { word: "dog", sentence: "My dog likes to run." },
    { word: "sun", sentence: "The sun is very bright." },
    { word: "hat", sentence: "She wore a red hat." },
    { word: "run", sentence: "We run in the park." },
    { word: "big", sentence: "The elephant is big." },
    { word: "red", sentence: "I have a red ball." },
    { word: "box", sentence: "The toy is in the box." },
    { word: "top", sentence: "The book is on top." },
    { word: "bed", sentence: "I sleep in my bed." },
    { word: "cup", sentence: "Here is a cup of milk." },
    { word: "pig", sentence: "The pig is pink." },
    { word: "hen", sentence: "The hen laid an egg." },
    { word: "bug", sentence: "A little bug crawled by." },
    { word: "ten", sentence: "I can count to ten." },
    { word: "sit", sentence: "Please sit down." },
    { word: "map", sentence: "We used a map." },
    { word: "net", sentence: "The fish is in the net." },
    { word: "yes", sentence: "Yes, I can help." },
    { word: "mom", sentence: "My mom is nice." },
  ];

  // 1st grade: blends, digraphs, and common sight words.
  const G1 = [
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
    { word: "tree", sentence: "A bird sits in the tree." },
    { word: "milk", sentence: "I drink milk at lunch." },
    { word: "that", sentence: "That is my book." },
    { word: "with", sentence: "Come with me." },
    { word: "they", sentence: "They are my friends." },
    { word: "said", sentence: "She said hello." },
    { word: "have", sentence: "I have two pets." },
    { word: "like", sentence: "I like to read." },
    { word: "went", sentence: "We went to school." },
    { word: "this", sentence: "This is fun." },
    { word: "when", sentence: "When can we go?" },
    { word: "from", sentence: "A letter came from Grandma." },
  ];

  // 2nd grade: two-syllable words, tricky sight words, homophones.
  const G2 = [
    { word: "because", sentence: "I smiled because it was fun." },
    { word: "friend", sentence: "My best friend is kind." },
    { word: "school", sentence: "We learn a lot at school." },
    { word: "family", sentence: "My family ate dinner together." },
    { word: "animal", sentence: "A tiger is a wild animal." },
    { word: "happy", sentence: "I feel happy today." },
    { word: "water", sentence: "Please drink some water." },
    { word: "funny", sentence: "That joke was funny." },
    { word: "again", sentence: "Let's play again." },
    { word: "every", sentence: "I brush every morning." },
    { word: "under", sentence: "The cat is under the bed." },
    { word: "about", sentence: "Tell me about your day." },
    { word: "could", sentence: "Could you help me?" },
    { word: "would", sentence: "I would like an apple." },
    { word: "their", sentence: "The kids lost their ball." },
    { word: "there", sentence: "Put it over there." },
    { word: "where", sentence: "Where are my shoes?" },
    { word: "first", sentence: "You go first." },
    { word: "thing", sentence: "What is that thing?" },
    { word: "night", sentence: "The stars come out at night." },
    { word: "right", sentence: "You got the right answer." },
    { word: "light", sentence: "Turn on the light." },
    { word: "little", sentence: "The puppy is little." },
    { word: "people", sentence: "Many people came." },
  ];

  // 3rd grade.
  const G3 = [
    { word: "special", sentence: "Today is a special day." },
    { word: "weather", sentence: "The weather is sunny." },
    { word: "question", sentence: "I asked a good question." },
    { word: "remember", sentence: "Please remember your bag." },
    { word: "together", sentence: "We worked together." },
    { word: "favorite", sentence: "Pizza is my favorite food." },
    { word: "birthday", sentence: "Her birthday is in May." },
    { word: "morning", sentence: "I wake up early in the morning." },
    { word: "surprise", sentence: "The party was a surprise." },
    { word: "different", sentence: "We chose different colors." },
    { word: "important", sentence: "Sleep is important." },
    { word: "beautiful", sentence: "The sunset is beautiful." },
    { word: "chocolate", sentence: "I love chocolate cake." },
    { word: "dinosaur", sentence: "The dinosaur was huge." },
    { word: "sentence", sentence: "Write a full sentence." },
    { word: "science", sentence: "We did a science experiment." },
    { word: "picture", sentence: "I drew a picture." },
    { word: "thought", sentence: "I thought about the answer." },
    { word: "brought", sentence: "She brought her lunch." },
    { word: "enough", sentence: "We have enough snacks." },
    { word: "another", sentence: "May I have another?" },
    { word: "between", sentence: "Sit between us." },
    { word: "someone", sentence: "Someone is at the door." },
    { word: "believe", sentence: "I believe you can do it." },
  ];

  // 4th grade (words without sentences still work with Hear-it and Hint).
  const G4 = [
    { word: "adventure" }, { word: "calendar" }, { word: "describe" },
    { word: "dangerous" }, { word: "delicious" }, { word: "exercise" },
    { word: "furniture" }, { word: "opposite" }, { word: "probably" },
    { word: "restaurant" }, { word: "sandwich" }, { word: "treasure" },
    { word: "vacation" }, { word: "vegetable" }, { word: "wonderful" },
    { word: "mountain" }, { word: "neighbor" }, { word: "ordinary" },
    { word: "personal" }, { word: "straight" }, { word: "familiar" },
    { word: "thousand" }, { word: "material" }, { word: "surface" },
  ];

  // 5th grade.
  const G5 = [
    { word: "achievement" }, { word: "beginning" }, { word: "business" },
    { word: "cemetery" }, { word: "conscience" }, { word: "definitely" },
    { word: "embarrass" }, { word: "environment" }, { word: "existence" },
    { word: "government" }, { word: "immediately" }, { word: "independent" },
    { word: "necessary" }, { word: "occasion" }, { word: "possession" },
    { word: "privilege" }, { word: "recommend" }, { word: "separate" },
    { word: "tomorrow" }, { word: "vacuum" }, { word: "knowledge" },
    { word: "guarantee" }, { word: "rhythm" }, { word: "committee" },
  ];

  const LISTS = { K: K, "1": G1, "2": G2, "3": G3, "4": G4, "5": G5 };

  HW.words = {
    // Return the built-in list for a grade.
    builtin(grade) {
      return (LISTS[grade] || LISTS.K).slice();
    },
    // Label shown on the word-source picker.
    builtinLabel(grade) {
      const label = HW.store ? HW.store.gradeLabel(grade) : "Grade " + grade;
      return label + " Words";
    },
  };
})();
