/*
 * facts.js — a "Fact of the Day" themed by the day of the week
 * (Monday = math, Tuesday = words, ...). All facts are bundled so this works
 * offline. The fact shown rotates each day but stays the same all day.
 */
(function () {
  const HW = (window.HW = window.HW || {});

  const THEMES = {
    1: {
      id: "math",
      label: "Monday Math Fact",
      emoji: "🔢",
      facts: [
        "A “googol” is the number 1 followed by 100 zeros.",
        "If you add up every number from 1 to 100, you get 5,050.",
        "Zero is an even number.",
        "Any number times 9 has digits that add up to 9. Try 9 × 4 = 36, and 3 + 6 = 9!",
        "A shape with a million sides is called a “megagon.”",
        "The plus (+) and minus (−) signs were first used in books about 500 years ago.",
        "Odd numbers always end in 1, 3, 5, 7, or 9.",
        "“Four” is the only number spelled with the same many letters as its value.",
        "A “dozen” means 12, and a “baker’s dozen” means 13.",
        "Multiplying a number by 10 just adds a zero to the end.",
      ],
    },
    2: {
      id: "word",
      label: "Tuesday Word Fact",
      emoji: "🔤",
      facts: [
        "The most common letter in English is “E.”",
        "Words that read the same backward, like “level” and “racecar,” are called palindromes.",
        "The dot over the letters “i” and “j” has a name — it’s called a “tittle.”",
        "“The quick brown fox jumps over the lazy dog” uses every letter of the alphabet!",
        "“Bookkeeper” has three sets of double letters in a row: oo, kk, ee.",
        "The word “alphabet” comes from the first two Greek letters: alpha and beta.",
        "The shortest complete sentence in English is “I am.”",
        "“Rhythm” is a long word with no a, e, i, o, or u in it.",
        "A tiny three-line poem is called a “haiku.”",
        "A word that sounds like the noise it means, like “buzz” or “pop,” is onomatopoeia.",
      ],
    },
    3: {
      id: "science",
      label: "Wednesday Science Fact",
      emoji: "🔬",
      facts: [
        "Honey never spoils — jars found in ancient tombs are still good to eat!",
        "Lightning is hotter than the surface of the Sun.",
        "Water can be a solid (ice), a liquid (water), and a gas (steam).",
        "Sound cannot travel through empty space, so space is totally silent.",
        "Bananas are a tiny bit radioactive — but completely safe to eat.",
        "The human nose can remember about 50,000 different smells.",
        "Your body has enough water in it to fill about ten big soda bottles.",
        "Hot water can sometimes freeze faster than cold water.",
        "A bolt of lightning is only about as wide as your thumb.",
        "Bubbles are always round, no matter what shape you blow them from.",
      ],
    },
    4: {
      id: "animal",
      label: "Thursday Animal Fact",
      emoji: "🐾",
      facts: [
        "An octopus has three hearts and blue blood.",
        "A group of flamingos is called a “flamboyance.”",
        "Sea otters hold hands while they sleep so they don’t float apart.",
        "A snail can sleep for up to three years.",
        "Elephants are the only animals that can’t jump.",
        "Butterflies taste with their feet.",
        "A hummingbird’s heart can beat more than 1,000 times a minute.",
        "Cows have best friends and feel happier when they’re together.",
        "Cats can make over 100 different sounds; dogs make about ten.",
        "A shrimp’s heart is in its head.",
      ],
    },
    5: {
      id: "space",
      label: "Friday Space Fact",
      emoji: "🚀",
      facts: [
        "The Sun is so big that about one million Earths could fit inside it.",
        "One day on Venus is longer than one whole year on Venus.",
        "Footprints on the Moon can last millions of years because there’s no wind.",
        "There are more stars in the sky than grains of sand on all of Earth’s beaches.",
        "A year on Mercury is only 88 days long.",
        "The Moon drifts about an inch and a half farther from Earth every year.",
        "Jupiter is the biggest planet — more than 1,300 Earths could fit inside it.",
        "Space is silent because there’s no air to carry sound.",
        "Saturn is so light it would float in water, if you had a big enough tub.",
        "Astronauts can grow a little bit taller in space!",
      ],
    },
    6: {
      id: "history",
      label: "Saturday History Fact",
      emoji: "🏛️",
      facts: [
        "The Great Wall of China took over 2,000 years to build.",
        "Ancient Egyptians made toothpaste over 5,000 years ago.",
        "The first Olympic Games were held almost 3,000 years ago in Greece.",
        "Long ago, carrots were purple instead of orange.",
        "The oldest piece of chewing gum ever found is over 9,000 years old.",
        "Vikings used the stars to sail across the seas.",
        "The pyramids of Egypt were built more than 4,500 years ago.",
        "The very first postage stamp was called the “Penny Black.”",
        "Ketchup was once sold as a medicine in the 1830s.",
        "People once used sundials to tell time using the Sun’s shadow.",
      ],
    },
    0: {
      id: "nature",
      label: "Sunday Nature Fact",
      emoji: "🌿",
      facts: [
        "Your heart beats about 100,000 times every single day.",
        "Trees can “talk” to each other through their roots underground.",
        "One big tree can make enough oxygen for two people for a whole day.",
        "Bamboo can grow almost as tall as you in a single day.",
        "You have around 10,000 taste buds on your tongue.",
        "Bees can recognize human faces.",
        "You blink about 15,000 times a day.",
        "The tallest trees on Earth are taller than a 30-floor building.",
        "A sneeze can zoom out of your nose faster than a car on the highway.",
        "Rainbows are actually full circles — the ground just hides the bottom half.",
      ],
    },
  };

  // Whole days since 1970; changes once per day, so the fact is stable all day.
  function dayNumber() {
    const now = new Date();
    // Use local midnight so the fact turns over at the start of the kid's day.
    const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.floor(local.getTime() / 86400000);
  }

  HW.facts = {
    today() {
      const theme = THEMES[new Date().getDay()] || THEMES[1];
      const len = theme.facts.length;
      const index = ((dayNumber() % len) + len) % len;
      return {
        id: theme.id,
        label: theme.label,
        emoji: theme.emoji,
        facts: theme.facts.slice(),
        index: index,
      };
    },
  };
})();
