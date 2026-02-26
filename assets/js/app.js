(function () {
  const KEYS = {
    users: "ds_users_v1",
    current: "ds_current_user_v1",
    feedback: "ds_feedback_v1",
    bugs: "ds_bugs_v1"
  };

  const LANGS = ["sanskrit", "english", "hindi"];

  const ACHIEVEMENTS = [
    { id: "a1", name: "First Light", desc: "Complete your first spiritual goal.", check: (u) => completions(u) >= 1 },
    { id: "a2", name: "Two-Day Dharma", desc: "2-day streak.", check: (u) => streak(u) >= 2 },
    { id: "a3", name: "Tri-Shuddhi", desc: "3-day streak.", check: (u) => streak(u) >= 3 },
    { id: "a4", name: "Week Warrior", desc: "7-day streak.", check: (u) => streak(u) >= 7 },
    { id: "a5", name: "Tenfold Focus", desc: "10-day streak.", check: (u) => streak(u) >= 10 },
    { id: "a6", name: "Half-Month Harmony", desc: "15-day streak.", check: (u) => streak(u) >= 15 },
    { id: "a7", name: "Month of Mind", desc: "30-day streak.", check: (u) => streak(u) >= 30 },
    { id: "a8", name: "Forty Flame", desc: "40-day streak.", check: (u) => streak(u) >= 40 },
    { id: "a9", name: "Fifty Resolve", desc: "50-day streak.", check: (u) => streak(u) >= 50 },
    { id: "a10", name: "Century Sankalp", desc: "100-day streak.", check: (u) => streak(u) >= 100 },
    { id: "a11", name: "Three Completions", desc: "Complete 3 goals.", check: (u) => completions(u) >= 3 },
    { id: "a12", name: "Five Completions", desc: "Complete 5 goals.", check: (u) => completions(u) >= 5 },
    { id: "a13", name: "Ten Completions", desc: "Complete 10 goals.", check: (u) => completions(u) >= 10 },
    { id: "a14", name: "Twenty Completions", desc: "Complete 20 goals.", check: (u) => completions(u) >= 20 },
    { id: "a15", name: "Fifty Completions", desc: "Complete 50 goals.", check: (u) => completions(u) >= 50 },
    { id: "a16", name: "Language Explorer", desc: "Use 2 language views.", check: (u) => (u.stats.languagesUsed || []).length >= 2 },
    { id: "a17", name: "Trilingual Seeker", desc: "Use all 3 language views.", check: (u) => (u.stats.languagesUsed || []).length >= 3 },
    { id: "a18", name: "Voice Listener", desc: "Play shlok audio once.", check: (u) => flag(u, "shlokAudio") },
    { id: "a19", name: "Sound Bath", desc: "Play spiritual soundscape.", check: (u) => flag(u, "ambientPlay") },
    { id: "a20", name: "Mission Touch", desc: "Visit mission section.", check: (u) => flag(u, "missionView") },
    { id: "a21", name: "Author Trail", desc: "Visit author page.", check: (u) => flag(u, "authorView") },
    { id: "a22", name: "Timeline Witness", desc: "Open timeline animation.", check: (u) => flag(u, "timelineView") },
    { id: "a23", name: "Feedback Voice", desc: "Submit feedback.", check: (u) => flag(u, "feedbackSubmit") },
    { id: "a24", name: "Bug Reporter", desc: "Report a bug.", check: (u) => flag(u, "bugSubmit") },
    { id: "a25", name: "Social Connector", desc: "Click a social link.", check: (u) => flag(u, "socialClick") },
    { id: "a26", name: "Account Builder", desc: "Register account.", check: (u) => flag(u, "registered") },
    { id: "a27", name: "Steady Return", desc: "Open daily page 5 times.", check: (u) => (u.stats.dailyVisits || 0) >= 5 },
    { id: "a28", name: "Dedicated Return", desc: "Open daily page 15 times.", check: (u) => (u.stats.dailyVisits || 0) >= 15 },
    { id: "a29", name: "Inner Journal", desc: "Add 5 goal notes.", check: (u) => (u.stats.notes || 0) >= 5 },
    { id: "a30", name: "Calm Reader", desc: "Increase font size once.", check: (u) => flag(u, "fontResize") },
    { id: "a31", name: "Morning Discipline", desc: "Complete on 3 different days.", check: (u) => completionDays(u) >= 3 },
    { id: "a32", name: "Dharma Builder", desc: "Complete on 10 different days.", check: (u) => completionDays(u) >= 10 },
    { id: "a33", name: "Reflection Keeper", desc: "Write 10 notes.", check: (u) => (u.stats.notes || 0) >= 10 },
    { id: "a34", name: "Consistency Gem", desc: "No skip for 7 completed entries.", check: (u) => bestCompletionRun(u) >= 7 },
    { id: "a35", name: "Higher Aim", desc: "Use translate button 10 times.", check: (u) => (u.stats.translateClicks || 0) >= 10 },
    { id: "a36", name: "Sacred Voice", desc: "Play shlok audio 10 times.", check: (u) => (u.stats.shlokAudioCount || 0) >= 10 },
    { id: "a37", name: "Compassion Cycle", desc: "Complete 25 spiritual goals.", check: (u) => completions(u) >= 25 },
    { id: "a38", name: "Mission Ally", desc: "Open contact page.", check: (u) => flag(u, "contactView") },
    { id: "a39", name: "Resolved Mind", desc: "Mark yesterday task complete 3 times.", check: (u) => (u.stats.yesterdayComplete || 0) >= 3 },
    { id: "a40", name: "Gita Guardian", desc: "Unlock 20 achievements.", check: (u) => unlockedCount(u) >= 20 }
  ];

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function minusDays(iso, days) {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  function readJSON(k, fallback) {
    try {
      return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  }

  function users() {
    return readJSON(KEYS.users, []);
  }

  function saveUsers(list) {
    writeJSON(KEYS.users, list);
  }

  function currentUserId() {
    return localStorage.getItem(KEYS.current) || "";
  }

  function setCurrentUserId(id) {
    localStorage.setItem(KEYS.current, id);
  }

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return Math.abs(h >>> 0);
  }

  function generateUsername() {
    const p1 = ["gita", "dharma", "krishna", "arjuna", "satya", "yoga", "atma", "karma"];
    const p2 = ["seeker", "jyoti", "sadhak", "marg", "nitya", "shanti", "vega", "pran"];
    return `${p1[Math.floor(Math.random() * p1.length)]}_${p2[Math.floor(Math.random() * p2.length)]}_${Math.floor(100 + Math.random() * 900)}`;
  }

  function ensureShape(u) {
    u.progress = u.progress || {};
    u.stats = u.stats || { flags: {}, languagesUsed: [], dailyVisits: 0, notes: 0, translateClicks: 0, shlokAudioCount: 0, yesterdayComplete: 0 };
    u.achievements = u.achievements || [];
    return u;
  }

  function getCurrentUser() {
    const id = currentUserId();
    if (!id) return null;
    const list = users();
    const u = list.find((x) => x.id === id);
    return u ? ensureShape(u) : null;
  }

  function saveCurrentUser(user) {
    const list = users();
    const idx = list.findIndex((x) => x.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
      saveUsers(list);
    }
  }

  function flag(user, name) {
    return !!(user.stats && user.stats.flags && user.stats.flags[name]);
  }

  function markFlag(user, name) {
    user.stats.flags[name] = true;
    updateAchievements(user);
  }

  function trackLanguage(user, lang) {
    if (!user.stats.languagesUsed.includes(lang)) {
      user.stats.languagesUsed.push(lang);
    }
    updateAchievements(user);
  }

  function completions(user) {
    return Object.values(user.progress).filter((p) => p.completed === true).length;
  }

  function completionDays(user) {
    return completions(user);
  }

  function streak(user) {
    const dates = Object.keys(user.progress).sort().reverse();
    if (!dates.length) return 0;
    let s = 0;
    let cursor = todayISO();
    const todayEntry = user.progress[cursor];
    if (!todayEntry || todayEntry.completed !== true) {
      cursor = minusDays(cursor, 1);
    }
    while (true) {
      const e = user.progress[cursor];
      if (e && e.completed === true) {
        s += 1;
        cursor = minusDays(cursor, 1);
      } else {
        break;
      }
    }
    return s;
  }

  function bestCompletionRun(user) {
    const dates = Object.keys(user.progress).sort();
    if (!dates.length) return 0;
    let best = 0;
    let curr = 0;
    let prev = null;
    dates.forEach((d) => {
      const e = user.progress[d];
      if (e && e.completed === true) {
        if (prev && minusDays(d, 1) === prev) curr += 1;
        else curr = 1;
        if (curr > best) best = curr;
        prev = d;
      } else {
        curr = 0;
        prev = null;
      }
    });
    return best;
  }

  function unlockedCount(user) {
    return (user.achievements || []).length;
  }

  function updateAchievements(user) {
    const unlocked = new Set(user.achievements || []);
    ACHIEVEMENTS.forEach((a) => {
      if (a.check(user)) unlocked.add(a.id);
    });
    user.achievements = Array.from(unlocked);
  }

  function getDailyVerse(user, date) {
    const idx = hash(`${user.username}|${date}`) % window.SHLOKAS.length;
    return window.SHLOKAS[idx];
  }

  function ensureDailyEntry(user) {
    const date = todayISO();
    user.progress[date] = user.progress[date] || {};
    const e = user.progress[date];
    if (!e.verseId) {
      const verse = getDailyVerse(user, date);
      e.verseId = verse.id;
      e.completed = null;
      e.goalNote = "";
      e.lang = user.preferredLanguage || "english";
    }
    return user.progress[date];
  }

  function findVerseById(id) {
    return window.SHLOKAS.find((v) => v.id === id) || window.SHLOKAS[0];
  }

  function guardAuth() {
    const onProtected = ["daily-shlok.html", "account.html", "author.html", "contact.html", "bugs.html", "chapters.html"];
    const page = location.pathname.split("/").pop();
    const user = getCurrentUser();
    if (onProtected.includes(page) && !user) {
      location.href = "DailyShloka.html";
      return null;
    }
    return user;
  }

  function bindAuthPage() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const randomBtn = document.getElementById("randomUsername");

    if (randomBtn) {
      randomBtn.addEventListener("click", () => {
        document.getElementById("regUsername").value = generateUsername();
      });
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const email = document.getElementById("regEmail").value.trim().toLowerCase();
        let username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value;
        const preferredLanguage = document.getElementById("regLanguage").value;

        if (!username) username = generateUsername();

        const list = users();
        if (list.some((u) => u.email === email)) {
          alert("Email already registered.");
          return;
        }

        const u = ensureShape({
          id: `u_${Date.now()}`,
          email,
          username,
          password,
          preferredLanguage,
          createdAt: todayISO()
        });
        u.stats.flags.registered = true;
        updateAchievements(u);

        list.push(u);
        saveUsers(list);
        setCurrentUserId(u.id);
        location.href = "account.html";
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const email = document.getElementById("logEmail").value.trim().toLowerCase();
        const password = document.getElementById("logPassword").value;
        const u = users().find((x) => x.email === email && x.password === password);
        if (!u) {
          alert("Invalid credentials.");
          return;
        }
        setCurrentUserId(u.id);
        location.href = "account.html";
      });
    }

    const mission = document.getElementById("missionSection");
    if (mission) {
      mission.addEventListener("mouseenter", () => {
        const u = getCurrentUser();
        if (!u) return;
        markFlag(u, "missionView");
        saveCurrentUser(u);
      });
    }
  }

  function bindCommon(user) {
    const logoutBtn = document.querySelector("[data-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(KEYS.current);
        location.href = "DailyShloka.html";
      });
    }

    const userEl = document.querySelector("[data-username]");
    if (userEl && user) userEl.textContent = user.username;
  }

  function bindAccountPage(user) {
    const email = document.getElementById("accEmail");
    const username = document.getElementById("accUsername");
    const lang = document.getElementById("accLanguage");
    const save = document.getElementById("saveAccount");
    const streakEl = document.getElementById("accStreak");
    const completedEl = document.getElementById("accCompleted");

    if (!email) return;
    email.value = user.email;
    username.value = user.username;
    lang.value = user.preferredLanguage;
    streakEl.textContent = String(streak(user));
    completedEl.textContent = String(completions(user));

    save.addEventListener("click", () => {
      user.username = username.value.trim() || user.username;
      user.preferredLanguage = lang.value;
      saveCurrentUser(user);
      alert("Account saved.");
    });

    renderAchievements(user, document.getElementById("achievementsGrid"));
  }

  function renderAchievements(user, container) {
    if (!container) return;
    updateAchievements(user);
    container.innerHTML = "";
    const unlocked = new Set(user.achievements);
    ACHIEVEMENTS.forEach((a) => {
      const card = document.createElement("div");
      card.className = `badge ${unlocked.has(a.id) ? "unlocked" : "locked"}`;
      card.innerHTML = `<h4>${a.name}</h4><p>${a.desc}</p>`;
      container.appendChild(card);
    });
    saveCurrentUser(user);
  }

  function bindDailyPage(user) {
    const verseEl = document.getElementById("verseText");
    const refEl = document.getElementById("verseRef");
    const meaningEl = document.getElementById("verseMeaning");
    const goalEl = document.getElementById("verseGoal");
    const streakEl = document.getElementById("dailyStreak");
    const translateBtn = document.getElementById("translateBtn");
    const langEl = document.getElementById("activeLang");
    const incFont = document.getElementById("incFont");
    const decFont = document.getElementById("decFont");
    const playVoice = document.getElementById("playVoice");
    const noteInput = document.getElementById("goalNote");
    const saveNote = document.getElementById("saveNote");
    const ambientOn = document.getElementById("ambientOn");
    const ambientOff = document.getElementById("ambientOff");

    user.stats.dailyVisits += 1;
    ensureDailyEntry(user);
    const today = todayISO();
    const entry = user.progress[today];
    let currentLang = entry.lang || user.preferredLanguage || "english";
    const verse = findVerseById(entry.verseId);

    function paintVerse() {
      verseEl.textContent = verse[currentLang] || verse.english;
      refEl.textContent = `Bhagavad Gita ${verse.id}`;
      meaningEl.textContent = verse.meaning;
      goalEl.textContent = verse.goal;
      langEl.textContent = currentLang.toUpperCase();
      trackLanguage(user, currentLang);
      saveCurrentUser(user);
    }

    function askYesterdayCompletion() {
      const y = minusDays(today, 1);
      const yEntry = user.progress[y];
      const prompt = document.getElementById("yesterdayPrompt");
      if (!prompt) return;
      if (!yEntry || yEntry.completed !== null) {
        prompt.style.display = "none";
        return;
      }
      prompt.style.display = "block";
      document.getElementById("markDone").onclick = () => {
        yEntry.completed = true;
        user.stats.yesterdayComplete += 1;
        updateAchievements(user);
        saveCurrentUser(user);
        prompt.style.display = "none";
        streakEl.textContent = String(streak(user));
        renderAchievements(user, document.getElementById("dailyAchievements"));
      };
      document.getElementById("markSkip").onclick = () => {
        yEntry.completed = false;
        saveCurrentUser(user);
        prompt.style.display = "none";
        streakEl.textContent = String(streak(user));
      };
    }

    translateBtn.addEventListener("click", () => {
      const idx = LANGS.indexOf(currentLang);
      currentLang = LANGS[(idx + 1) % LANGS.length];
      entry.lang = currentLang;
      user.stats.translateClicks += 1;
      paintVerse();
    });

    let fontSize = 1.3;
    incFont.addEventListener("click", () => {
      fontSize += 0.1;
      verseEl.style.fontSize = `${fontSize}rem`;
      markFlag(user, "fontResize");
      saveCurrentUser(user);
    });

    decFont.addEventListener("click", () => {
      fontSize = Math.max(1, fontSize - 0.1);
      verseEl.style.fontSize = `${fontSize}rem`;
    });

    playVoice.addEventListener("click", () => {
      if (!window.speechSynthesis) {
        alert("Speech synthesis unavailable in this browser.");
        return;
      }
      const utt = new SpeechSynthesisUtterance(verse[currentLang] || verse.english);
      if (currentLang === "hindi" || currentLang === "sanskrit") utt.lang = "hi-IN";
      else utt.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
      user.stats.shlokAudioCount += 1;
      markFlag(user, "shlokAudio");
      saveCurrentUser(user);
      renderAchievements(user, document.getElementById("dailyAchievements"));
    });

    noteInput.value = entry.goalNote || "";
    saveNote.addEventListener("click", () => {
      entry.goalNote = noteInput.value.trim();
      user.stats.notes += 1;
      saveCurrentUser(user);
      renderAchievements(user, document.getElementById("dailyAchievements"));
      alert("Goal note saved.");
    });

    let audioCtx;
    let oscillators = [];

    ambientOn.addEventListener("click", async () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (oscillators.length) return;
      const freqs = [136.1, 204.15, 272.2];
      freqs.forEach((f) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.value = 0.02;
        o.connect(g).connect(audioCtx.destination);
        o.start();
        oscillators.push({ o, g });
      });
      markFlag(user, "ambientPlay");
      saveCurrentUser(user);
      renderAchievements(user, document.getElementById("dailyAchievements"));
    });

    ambientOff.addEventListener("click", () => {
      oscillators.forEach((x) => x.o.stop());
      oscillators = [];
    });

    paintVerse();
    askYesterdayCompletion();
    streakEl.textContent = String(streak(user));
    renderAchievements(user, document.getElementById("dailyAchievements"));
    saveCurrentUser(user);
  }

  function bindAuthorPage(user) {
    markFlag(user, "authorView");
    const timeline = document.getElementById("timeline");
    if (!timeline) return;
    markFlag(user, "timelineView");
    saveCurrentUser(user);
    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
    years.forEach((y, i) => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.style.animationDelay = `${i * 120}ms`;
      item.innerHTML = `<span>${y}</span><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae neque non risus finibus ullamcorper.</p>`;
      timeline.appendChild(item);
    });
  }

  function bindContactPage(user) {
    markFlag(user, "contactView");
    saveCurrentUser(user);
    document.querySelectorAll("[data-social]").forEach((a) => {
      a.addEventListener("click", () => {
        markFlag(user, "socialClick");
        saveCurrentUser(user);
      });
    });

    const form = document.getElementById("feedbackForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = document.getElementById("feedbackMsg").value.trim();
        if (!msg) return;
        const rows = readJSON(KEYS.feedback, []);
        rows.push({ user: user.username, msg, date: todayISO() });
        writeJSON(KEYS.feedback, rows);
        markFlag(user, "feedbackSubmit");
        saveCurrentUser(user);
        alert("Feedback saved.");
        form.reset();
      });
    }
  }

  function bindBugPage(user) {
    const form = document.getElementById("bugForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const desc = document.getElementById("bugDesc").value.trim();
      const f = document.getElementById("bugFile").files[0];
      const rows = readJSON(KEYS.bugs, []);
      rows.push({ user: user.username, desc, fileName: f ? f.name : "", date: todayISO() });
      writeJSON(KEYS.bugs, rows);
      markFlag(user, "bugSubmit");
      saveCurrentUser(user);
      alert("Bug report saved locally.");
      form.reset();
    });
  }

  function bindChaptersPage(user) {
    const chapterSelect = document.getElementById("chapterSelect");
    const verseSelect = document.getElementById("verseSelect");
    const refEl = document.getElementById("chapterRef");
    const verseEl = document.getElementById("chapterVerse");
    const meaningEl = document.getElementById("chapterMeaning");
    const goalEl = document.getElementById("chapterGoal");
    const translateBtn = document.getElementById("chapterTranslate");
    const listenBtn = document.getElementById("chapterListen");
    const langEl = document.getElementById("chapterLang");
    const prevBtn = document.getElementById("chapterPrev");
    const nextBtn = document.getElementById("chapterNext");

    if (!chapterSelect || !verseSelect) return;

    const full = (window.SHLOKAS_FULL || []).slice();
    if (!full.length) {
      verseEl.textContent = "Full dataset missing.";
      return;
    }

    let currentLang = user.preferredLanguage || "english";

    for (let c = 1; c <= 18; c += 1) {
      const o = document.createElement("option");
      o.value = String(c);
      o.textContent = `Chapter ${c}`;
      chapterSelect.appendChild(o);
    }

    function fillVerseOptions(chapter, selectedVerse) {
      verseSelect.innerHTML = "";
      const max = window.VERSE_COUNTS[chapter];
      for (let v = 1; v <= max; v += 1) {
        const o = document.createElement("option");
        o.value = String(v);
        o.textContent = `Verse ${v}`;
        if (v === selectedVerse) o.selected = true;
        verseSelect.appendChild(o);
      }
    }

    function findCurrent() {
      const c = Number(chapterSelect.value);
      const v = Number(verseSelect.value);
      return full.find((x) => x.chapter === c && x.verse === v) || full[0];
    }

    function paint() {
      const item = findCurrent();
      refEl.textContent = `Bhagavad Gita ${item.id}`;
      verseEl.textContent = item[currentLang] || item.english || "[OCR pending]";
      meaningEl.textContent = item.meaning || "Meaning pending.";
      goalEl.textContent = item.goal || "Goal pending.";
      langEl.textContent = currentLang.toUpperCase();
      trackLanguage(user, currentLang);
      saveCurrentUser(user);
    }

    function step(dir) {
      let c = Number(chapterSelect.value);
      let v = Number(verseSelect.value);
      v += dir;
      if (v < 1) {
        if (c > 1) {
          c -= 1;
          v = window.VERSE_COUNTS[c];
        } else {
          v = 1;
        }
      }
      if (v > window.VERSE_COUNTS[c]) {
        if (c < 18) {
          c += 1;
          v = 1;
        } else {
          v = window.VERSE_COUNTS[c];
        }
      }
      chapterSelect.value = String(c);
      fillVerseOptions(c, v);
      paint();
    }

    chapterSelect.value = "1";
    fillVerseOptions(1, 1);
    paint();

    chapterSelect.addEventListener("change", () => {
      fillVerseOptions(Number(chapterSelect.value), 1);
      paint();
    });
    verseSelect.addEventListener("change", paint);

    translateBtn.addEventListener("click", () => {
      const idx = LANGS.indexOf(currentLang);
      currentLang = LANGS[(idx + 1) % LANGS.length];
      user.stats.translateClicks += 1;
      paint();
    });

    listenBtn.addEventListener("click", () => {
      if (!window.speechSynthesis) return;
      const item = findCurrent();
      const utt = new SpeechSynthesisUtterance(item[currentLang] || item.english || "");
      utt.lang = (currentLang === "hindi" || currentLang === "sanskrit") ? "hi-IN" : "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
      user.stats.shlokAudioCount += 1;
      markFlag(user, "shlokAudio");
      saveCurrentUser(user);
    });

    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));
  }

  function bindChapterStats() {
    const el = document.getElementById("gitaStats");
    if (!el || !window.VERSE_COUNTS) return;
    const total = Object.values(window.VERSE_COUNTS).reduce((a, b) => a + b, 0);
    el.textContent = `18 Chapters | ${total} Total Verses`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindChapterStats();
    const page = location.pathname.split("/").pop();
    if (page === "DailyShloka.html" || page === "") bindAuthPage();

    const user = guardAuth();
    bindCommon(user);
    if (!user) return;

    if (page === "account.html") bindAccountPage(user);
    if (page === "daily-shlok.html") bindDailyPage(user);
    if (page === "author.html") bindAuthorPage(user);
    if (page === "contact.html") bindContactPage(user);
    if (page === "bugs.html") bindBugPage(user);
    if (page === "chapters.html") bindChaptersPage(user);
  });
})();
