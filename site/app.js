// Сайт изучения татарского языка: курс, словарь, сказки, пословицы, мифы, викторина.
// Данные — site/data.json (собирает scripts/build_site.py), озвучка — audio/site/<sha1>.mp3
"use strict";
const $ = (s) => document.querySelector(s);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
let lang = LANG;                               // из games/common.js
let alpha = store.get("alpha", ["cyr", "lat", "both"].includes(Q.get("a")) ? Q.get("a") : "cyr");
let D = null;

// ---------- тексты интерфейса
const S = {
  home: { ru: "Главная", en: "Home", tr: "Ana sayfa", fi: "Etusivu" },
  course: { ru: "Курс", en: "Course", tr: "Kurs", fi: "Kurssi" },
  dict: { ru: "Словарь", en: "Dictionary", tr: "Sözlük", fi: "Sanakirja" },
  stories: { ru: "Сказки", en: "Tales", tr: "Masallar", fi: "Sadut" },
  proverbs: { ru: "Пословицы", en: "Proverbs", tr: "Atasözleri", fi: "Sananlaskut" },
  myths: { ru: "Мифы", en: "Myths", tr: "Mitler", fi: "Myytit" },
  quiz: { ru: "Викторина", en: "Quiz", tr: "Bilgi yarışması", fi: "Tietovisa" },
  games: { ru: "Игры", en: "Games", tr: "Oyunlar", fi: "Pelit" },
  lead: { ru: "Учите татарский язык бесплатно: уроки по шагам, словарь с озвучкой, сказки, пословицы и игры.",
    en: "Learn Tatar for free: step-by-step lessons, a dictionary with audio, fairy tales, proverbs and games.",
    tr: "Tatarcayı ücretsiz öğrenin: adım adım dersler, sesli sözlük, masallar, atasözleri ve oyunlar.",
    fi: "Opi tataaria ilmaiseksi: oppitunnit askel askeleelta, äänisanakirja, sadut, sananlaskut ja pelit." },
  start: { ru: "Начать курс", en: "Start the course", tr: "Kursa başla", fi: "Aloita kurssi" },
  cont: { ru: "Продолжить курс", en: "Continue the course", tr: "Kursa devam et", fi: "Jatka kurssia" },
  wotd: { ru: "Слово дня", en: "Word of the day", tr: "Günün kelimesi", fi: "Päivän sana" },
  bot: { ru: "Учитесь и в Telegram — бот @TatarlargaBot присылает слово дня и сказки.", en: "Learn in Telegram too — @TatarlargaBot sends a word of the day and tales.",
    tr: "Telegram'da da öğrenin — @TatarlargaBot günün kelimesini ve masalları gönderir.", fi: "Opi myös Telegramissa — @TatarlargaBot lähettää päivän sanan ja satuja." },
  progress: { ru: "Пройдено", en: "Completed", tr: "Tamamlanan", fi: "Suoritettu" },
  phrasesU: { ru: "Фразы", en: "Phrases", tr: "İfadeler", fi: "Fraasit" },
  wordsU: { ru: "Слова", en: "Words", tr: "Kelimeler", fi: "Sanat" },
  learn: { ru: "Слушайте и повторяйте вслух, потом проверьте себя.", en: "Listen and repeat aloud, then test yourself.",
    tr: "Dinleyin, yüksek sesle tekrarlayın, sonra kendinizi sınayın.", fi: "Kuuntele ja toista ääneen, sitten testaa itsesi." },
  test: { ru: "Проверить себя", en: "Test yourself", tr: "Kendini sına", fi: "Testaa itsesi" },
  back: { ru: "← Назад", en: "← Back", tr: "← Geri", fi: "← Takaisin" },
  qMean: { ru: "Что это значит?", en: "What does it mean?", tr: "Ne anlama geliyor?", fi: "Mitä se tarkoittaa?" },
  qSay: { ru: "Как сказать по-татарски?", en: "How do you say it in Tatar?", tr: "Tatarca nasıl denir?", fi: "Miten se sanotaan tataariksi?" },
  qHear: { ru: "Что вы слышите?", en: "What do you hear?", tr: "Ne duyuyorsunuz?", fi: "Mitä kuulet?" },
  next: { ru: "Дальше →", en: "Next →", tr: "İleri →", fi: "Seuraava →" },
  result: { ru: "Результат", en: "Result", tr: "Sonuç", fi: "Tulos" },
  passed: { ru: "Урок пройден! Булдырдың!", en: "Lesson passed! Buldırdıñ!", tr: "Ders geçildi! Buldırdıñ!", fi: "Oppitunti läpäisty! Buldırdıñ!" },
  retry: { ru: "Нужно 70% — попробуйте ещё раз", en: "You need 70% — try again", tr: "%70 gerekli — tekrar deneyin", fi: "Tarvitset 70 % — yritä uudelleen" },
  again: { ru: "Ещё раз", en: "Again", tr: "Tekrar", fi: "Uudelleen" },
  toCourse: { ru: "К курсу", en: "To the course", tr: "Kursa dön", fi: "Kurssille" },
  search: { ru: "Поиск: по-татарски или по-русски…", en: "Search in Tatar or English…", tr: "Tatarca veya Türkçe ara…", fi: "Hae tataariksi tai suomeksi…" },
  all: { ru: "Все", en: "All", tr: "Tümü", fi: "Kaikki" },
  found: { ru: "Найдено", en: "Found", tr: "Bulunan", fi: "Löytyi" },
  tapWord: { ru: "Нажмите на слово, чтобы увидеть перевод.", en: "Tap a word to see its translation.", tr: "Çevirisini görmek için bir kelimeye dokunun.", fi: "Napauta sanaa nähdäksesi käännöksen." },
  listen: { ru: "Слушать сказку", en: "Listen to the tale", tr: "Masalı dinle", fi: "Kuuntele satu" },
  quizLead: { ru: "10 случайных вопросов по всем словам.", en: "10 random questions on all the words.", tr: "Tüm kelimelerden 10 rastgele soru.", fi: "10 satunnaista kysymystä kaikista sanoista." },
  best: { ru: "Рекорд", en: "Best", tr: "Rekor", fi: "Ennätys" },
  contact: { ru: "Отзывы и идеи", en: "Feedback and ideas", tr: "Görüş ve öneriler", fi: "Palaute ja ideat" },
  gamesLead: { ru: "Мини-игры работают в браузере и в Telegram.", en: "Mini games work in the browser and in Telegram.", tr: "Mini oyunlar tarayıcıda ve Telegram'da çalışır.", fi: "Minipelit toimivat selaimessa ja Telegramissa." },
};
const u = (k) => (S[k][lang] || S[k].ru);
const tr = (o) => o[lang] || o.ru;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// татарский текст по выбранному алфавиту
const T = (s) => esc(alpha === "lat" ? lat(s) : s);
const TT = (s) => alpha === "both" ? `${esc(s)}<div class="lat">${esc(lat(s))}</div>` : T(s);

// ---------- озвучка
const audioCache = {};
async function sha(t) {
  const b = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(t.trim()));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 12);
}
let player = null;
async function say(t) {
  const name = audioCache[t] || (audioCache[t] = await sha(t));
  if (player) player.pause();
  player = new Audio(`audio/site/${name}.mp3`);
  player.play().catch(() => {});
}
const playBtn = (t) => `<button class="play" data-say="${esc(t)}" aria-label="play">🔊</button>`;
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-say]");
  if (b) { e.preventDefault(); say(b.dataset.say); }
});

// ---------- курс: юниты = уроки фраз + темы слов
function units() {
  const out = D.lessons.map((l, i) => ({ id: "l" + i, emoji: "🗣", title: tr(l), sub: T(l.tt), kind: u("phrasesU"), items: l.items }));
  for (const t of D.topics) {
    const items = D.words.filter((w) => w.topic === t.id);
    if (items.length) out.push({ id: "t" + t.id, emoji: t.emoji, title: tr(t), sub: "", kind: u("wordsU"), items });
  }
  return out;
}
const doneSet = () => new Set(store.get("done", []));

// ---------- страницы
const pages = {
  home() {
    const days = Math.floor(Date.now() / 864e5), w = D.words[days % D.words.length];
    const us = units(), done = doneSet(), nxt = us.find((x) => !done.has(x.id)) || us[0];
    return `<div class="hero"><h1>${T("Татарча өйрәник!")}</h1><p class="muted">${u("lead")}</p>
      <a class="btn" href="#/unit/${nxt.id}">▶ ${done.size ? u("cont") : u("start")}</a>
      <p style="margin-top:14px">${u("progress")}: ${done.size} / ${us.length}</p>
      <div class="bar"><i style="width:${(100 * done.size) / us.length}%"></i></div></div>
      <h2>☀️ ${u("wotd")}</h2>
      <div class="card row" style="border-bottom:1px solid var(--bd)">${playBtn(w.tt)}<div class="w"><div class="tt">${TT(w.tt)}</div><div class="muted">${esc(tr(w))}</div></div></div>
      <h2>📚</h2><div class="grid small">${["course", "dict", "stories", "proverbs", "myths", "quiz", "games"].map((k) =>
        `<a class="card" href="#/${k}"><div class="big">${{ course: "🎓", dict: "📖", stories: "🌙", proverbs: "📜", myths: "🐉", quiz: "❓", games: "🎮" }[k]}</div><b>${u(k)}</b></a>`).join("")}</div>
      <p class="card" style="margin-top:20px">✈️ <a href="https://t.me/TatarlargaBot" target="_blank" rel="noopener">${u("bot")}</a></p>`;
  },
  course() {
    const us = units(), done = doneSet();
    return `<h1>🎓 ${u("course")}</h1><p>${u("progress")}: ${done.size} / ${us.length}</p>
      <div class="bar"><i style="width:${(100 * done.size) / us.length}%"></i></div><br>
      <div class="grid">${us.map((x, i) => `<a class="card" href="#/unit/${x.id}"><div class="big">${x.emoji}</div>
        <b>${i + 1}. ${esc(x.title)}</b> ${done.has(x.id) ? '<span class="done">✓</span>' : ""}
        <div class="lat">${x.kind} · ${x.items.length}${x.sub ? " · " + x.sub : ""}</div></a>`).join("")}</div>`;
  },
  unit(id) {
    const x = units().find((v) => v.id === id);
    if (!x) return pages.course();
    return `<a href="#/course">${u("back")}</a><h1>${x.emoji} ${esc(x.title)}</h1><p class="muted">${u("learn")}</p>
      <div class="card">${x.items.map((w) => `<div class="row">${playBtn(w.tt)}<div class="w"><div class="tt">${TT(w.tt)}</div><div class="muted">${esc(tr(w))}</div></div></div>`).join("")}</div>
      <p><button class="btn" onclick="startTest('${id}')">📝 ${u("test")}</button></p>`;
  },
  dict() {
    return `<h1>📖 ${u("dict")}</h1><input class="search" id="q" placeholder="${u("search")}" autocomplete="off">
      <div class="chips" id="chips"></div><p class="muted" id="cnt"></p><div class="card" id="list"></div>`;
  },
  stories() {
    return `<h1>🌙 ${u("stories")}</h1><div class="grid">${D.stories.map((s) =>
      `<a class="card" href="#/story/${s.id}"><div class="big">📖</div><b>${T(s.title)}</b><div class="lat">${s.paras.length} ¶</div></a>`).join("")}</div>`;
  },
  story(id) {
    const s = D.stories.find((v) => v.id === id);
    if (!s) return pages.stories();
    const wrap = (p) => p.replace(/[А-Яа-яЁёӘәӨөҮүҖҗҢңҺһ-]+/g, (w) => `<span class="wd" data-w="${esc(w)}">${T(w)}</span>`);
    return `<a href="#/stories">${u("back")}</a><h1>${T(s.title)}</h1>
      ${s.audio ? `<p>🎧 ${u("listen")}</p><audio controls preload="none" src="${s.audio}" style="width:100%"></audio>` : ""}
      <p class="muted">👆 ${u("tapWord")}</p><div class="card story">${s.paras.map((p) => `<p>${wrap(p)}</p>`).join("")}</div>`;
  },
  proverbs() {
    return `<h1>📜 ${u("proverbs")}</h1><div class="card">${D.proverbs.map((p) =>
      `<div class="row">${playBtn(p.tt)}<div class="w"><div class="tt">${TT(p.tt)}</div><div>💬 ${esc(tr(p))}</div>
      <div class="muted">💡 ${esc(p["meaning" + (lang === "ru" ? "" : "_" + lang)] || p.meaning)}</div></div></div>`).join("")}</div>`;
  },
  myths() {
    return `<h1>🐉 ${u("myths")}</h1><div class="grid">${D.creatures.map((c) =>
      `<div class="card"><div class="big">${c.emoji}</div><div class="tt">${TT(c.tt)}</div>
      <p style="display:flex;gap:8px;align-items:center">${playBtn(c.tt_text)}<i>${T(c.tt_text)}</i></p><p class="muted">${esc(tr(c))}</p></div>`).join("")}</div>`;
  },
  quiz() {
    return `<h1>❓ ${u("quiz")}</h1><p class="muted">${u("quizLead")}</p><p>🏆 ${u("best")}: ${store.get("quizBest", 0)} / 10</p>
      <button class="btn" onclick="startTest('quiz')">▶ ${u("quiz")}</button>`;
  },
  games() {
    const qs = `?lang=${lang}&a=${alpha === "both" ? "both" : alpha}`;
    const G = [["shurale.html", "🌲", "Шүрәле"], ["echpochmak.html", "🥟", "Эчпочмак пешер"], ["suz.html", "🟩", "Сүз уены"]];
    return `<h1>🎮 ${u("games")}</h1><p class="muted">${u("gamesLead")}</p><div class="grid">${G.map(([f, e, n]) =>
      `<a class="card" href="games/${f}${qs}"><div class="big">${e}</div><b>${T(n)}</b></a>`).join("")}</div>`;
  },
};

// ---------- упражнения
let test = null;
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
window.startTest = (id) => {
  const pool = id === "quiz" ? D.words : units().find((v) => v.id === id).items;
  const n = id === "quiz" ? 10 : Math.min(8, Math.max(6, pool.length));
  let qs = [];
  while (qs.length < n) qs = qs.concat(shuffle(pool));
  qs = qs.slice(0, n);
  const all = id === "quiz" ? D.words : pool.length >= 4 ? pool : D.words;
  test = { id, ok: 0, i: 0, qs: qs.map((w, n) => {
    const type = ["mean", "say", "hear"][n % 3];
    const wrong = shuffle(all.filter((x) => x.tt !== w.tt && tr(x) !== tr(w))).slice(0, 3);
    return { w, type, opts: shuffle([w, ...wrong]) };
  }) };
  renderQ();
};
function renderQ() {
  const q = test.qs[test.i], w = q.w;
  const head = q.type === "mean" ? `<div class="muted">${u("qMean")}</div><div class="q">${TT(w.tt)}</div>`
    : q.type === "say" ? `<div class="muted">${u("qSay")}</div><div class="q">${esc(tr(w))}</div>`
    : `<div class="muted">${u("qHear")}</div><div class="q"><button class="play" style="width:64px;height:64px;font-size:28px" data-say="${esc(w.tt)}">🔊</button></div>`;
  const label = (o) => q.type === "mean" ? esc(tr(o)) : T(o.tt);
  $("#app").innerHTML = `<p class="muted">${test.i + 1} / ${test.qs.length}</p><div class="bar"><i style="width:${(100 * test.i) / test.qs.length}%"></i></div>
    <div class="card" style="margin-top:14px">${head}<div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${label(o)}</button>`).join("")}</div></div>`;
  if (q.type === "hear") say(w.tt);
  document.querySelectorAll(".opt").forEach((b) => b.onclick = () => {
    const ok = q.opts[b.dataset.k].tt === w.tt;
    document.querySelectorAll(".opt").forEach((x) => { x.disabled = true; if (q.opts[x.dataset.k].tt === w.tt) x.classList.add("good"); });
    if (!ok) b.classList.add("bad"); else test.ok++;
    if (q.type !== "hear") say(w.tt);
    setTimeout(() => { test.i++; test.i < test.qs.length ? renderQ() : finish(); }, ok ? 900 : 1700);
  });
}
function finish() {
  const n = test.qs.length, pct = test.ok / n, quiz = test.id === "quiz";
  if (quiz) store.set("quizBest", Math.max(store.get("quizBest", 0), test.ok));
  else if (pct >= 0.7) { const d = doneSet(); d.add(test.id); store.set("done", [...d]); }
  const us = units(), idx = us.findIndex((x) => x.id === test.id), nxt = us[idx + 1];
  $("#app").innerHTML = `<div class="card" style="text-align:center;margin-top:20px"><div class="big">${pct >= 0.7 ? "🎉" : "💪"}</div>
    <h2>${u("result")}: ${test.ok} / ${n}</h2><p>${quiz ? "" : pct >= 0.7 ? u("passed") : u("retry")}</p>
    <p style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn ghost" onclick="startTest('${test.id}')">↻ ${u("again")}</button>
    ${!quiz && pct >= 0.7 && nxt ? `<a class="btn" href="#/unit/${nxt.id}">${u("next")}</a>` : `<a class="btn" href="#/${quiz ? "quiz" : "course"}">${quiz ? u("quiz") : u("toCourse")}</a>`}</p></div>`;
}

// ---------- словарь
let topic = "", dq = "";
function dictList() {
  dq = $("#q").value || "";
  const raw = dq.trim().toLowerCase();
  const hit = D.words.filter((w) => (!topic || w.topic === topic) && (!raw ||
    [w.tt, lat(w.tt), w.ru, w.en, w.tr, w.fi].some((s) => s.toLowerCase().includes(raw))));
  $("#chips").innerHTML = [["", u("all")], ...D.topics.map((t) => [t.id, t.emoji + " " + tr(t)])]
    .map(([id, n]) => `<button class="chip ${id === topic ? "on" : ""}" data-t="${id}">${esc(n)}</button>`).join("");
  $("#chips").onclick = (e) => { const b = e.target.closest("[data-t]"); if (b) { topic = b.dataset.t; dictList(); } };
  $("#cnt").textContent = `${u("found")}: ${hit.length}`;
  $("#list").innerHTML = hit.map((w) => `<div class="row">${playBtn(w.tt)}<div class="w"><div class="tt">${TT(w.tt)}</div><div class="muted">${esc(tr(w))}</div></div></div>`).join("");
}

// ---------- подсказка-перевод в сказках
function findWord(w) {
  const low = w.toLowerCase();
  let best = null;
  for (const x of D.words) {
    const s = x.tt.toLowerCase();
    if (low === s) return x;
    if (s.length >= 3 && low.startsWith(s) && (!best || s.length > best.tt.length)) best = x;  // слово с окончанием
  }
  return best;
}
document.addEventListener("click", (e) => {
  const tip = $("#tip"), s = e.target.closest(".wd");
  if (!s) { tip.style.display = "none"; return; }
  const w = findWord(s.dataset.w);
  tip.innerHTML = w ? `<b>${T(w.tt)}</b> — ${esc(tr(w))}` : `<b>${T(s.dataset.w)}</b> — …`;
  const r = s.getBoundingClientRect();
  tip.style.display = "block";
  tip.style.left = Math.max(8, Math.min(r.left, innerWidth - 270)) + "px";
  tip.style.top = r.bottom + 6 + "px";
  if (w) say(w.tt);
});

// ---------- навигация
function route() {
  const [, page = "home", arg] = (location.hash || "#/home").split("/");
  const fn = pages[page] || pages.home;
  $("#app").innerHTML = fn(arg);
  document.querySelectorAll("nav.tabs a").forEach((a) => a.classList.toggle("on", a.dataset.p === (page === "unit" ? "course" : page === "story" ? "stories" : page)));
  if (page === "dict") { $("#q").value = dq; $("#q").oninput = dictList; dictList(); }
  $("#tip").style.display = "none";
  scrollTo(0, 0);
}
function chrome() {
  document.documentElement.lang = lang;
  $("#tabs").innerHTML = ["home", "course", "dict", "stories", "proverbs", "myths", "quiz", "games"]
    .map((k) => `<a href="#/${k}" data-p="${k}">${u(k)}</a>`).join("");
  $("#langs").innerHTML = ["ru", "en", "tr", "fi"].map((l) => `<button class="${l === lang ? "on" : ""}" data-l="${l}">${l.toUpperCase()}</button>`).join("");
  $("#alpha").innerHTML = [["cyr", "Кк"], ["lat", "Qq"], ["both", "Кк/Qq"]].map(([a, x]) => `<button class="${a === alpha ? "on" : ""}" data-a="${a}">${x}</button>`).join("");
  $("#foot").innerHTML = `${u("contact")}: <a href="https://t.me/marat_2215">@marat_2215</a> · <a href="https://t.me/TatarlargaBot">@TatarlargaBot</a> · ${esc(lat("Казан"))} 2026`;
}
document.addEventListener("click", (e) => {
  const l = e.target.closest("[data-l]"), a = e.target.closest("[data-a]");
  if (l) { lang = l.dataset.l; try { localStorage.setItem("lang", lang); } catch (x) {} }
  if (a) { alpha = a.dataset.a; store.set("alpha", alpha); }
  if (l || a) { chrome(); route(); }
});
addEventListener("hashchange", route);
fetch("site/data.json").then((r) => r.json()).then((d) => { D = d; chrome(); route(); });
