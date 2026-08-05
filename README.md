# Homework Heroes 🦸

A colorful, kid-friendly web app that helps children practice **math** and
**spelling**. Built for two age bands — **5–7** and **8–10** — with big buttons,
sounds, read-aloud words, stars, and badges to keep it fun.

No accounts, no internet, no installs. Everything runs in the browser and all
progress is saved privately on your own device.

## How to play

1. Open **`index.html`** in any web browser (Chrome, Safari, Edge, Firefox).
   - On a computer: double-click the file.
   - On a phone/tablet: open the file, or host the folder (see below).
2. Tap **New Hero**, pick a name, an avatar, and an age.
3. Choose a game and start earning ⭐!

> 💡 **Tip:** Add it to your tablet's home screen for a one-tap app-like icon
> (Share → *Add to Home Screen*).

## The games

### 🔢 Math
- **Ages 5–7:** adding & taking away (numbers to 10), tap-the-answer style.
- **Ages 8–10:** adding, subtracting, times tables, and dividing (type the answer).
- Pick one operation or **Mix It Up**. Each round is 10 questions with a streak
  counter 🔥 and star rewards.

### 🔤 Spelling
- The app **says the word out loud**, and your child types it.
- Buttons to **hear it again**, hear it **in a sentence**, or get a **hint**
  (first letter + blanks).
- Two tries per word, then it gently shows the answer and moves on.

## For parents ⚙️

Tap the gear icon (top-right) to open the **Parent Area**, where you can:

- **Add this week's spelling words** from school. Type or paste the words
  (separated by commas or new lines) and save them as a named list your child
  can practice — this is the feature that turns real homework into a game.
- **Turn sound on/off.**
- **Switch, add, or delete** hero profiles (one per child).

## Trophies 🏆

Kids collect stars for every correct answer and unlock badges for milestones
(first star, 100 stars, math streaks, spelling champ, and more). The Trophy
room shows their stars, best streak, and badge collection.

## Sharing it on a phone or tablet

Because it's a plain website, you can also host it for free so the kids can open
it from a link anywhere:

- **GitHub Pages:** enable Pages on this repo (Settings → Pages → deploy from
  branch) and it'll be live at a shareable URL.
- **Any static host** (Netlify, Vercel, etc.): drag-and-drop the folder.

## What's inside

```
index.html      # the app shell
styles.css      # all the colorful styling
js/
  audio.js      # sound effects (generated live) + read-aloud voice
  storage.js    # profiles, stars, badges (saved in your browser)
  words.js      # built-in spelling lists by age
  math.js       # math question generator
  spelling.js   # spelling round helpers
  app.js        # screens & game logic
```

Everything is plain HTML/CSS/JavaScript — no build step, no dependencies.

## Privacy

All data (names, stars, custom word lists) stays in your browser's local
storage on your device. Nothing is uploaded or shared.
