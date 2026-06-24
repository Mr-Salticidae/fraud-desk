/* =========================================================================
   THE FRAUD DESK — WeChat Mini Program port (EN / 中文)
   Game logic ported from the H5 build: LIBRARY draws 5-10 cases per shift,
   25s decision timer per case, scam = must flag, safe = let pass.
   DOM rendering is replaced by setData + WXML; data is reused verbatim.
   ========================================================================= */
const { DECISION_SECONDS, L, LIBRARY } = require("../../utils/data.js");

function pad2(n) { return String(n).padStart(2, "0"); }
function moneyFmt(n, lang) {
  const s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (lang === "zh" ? "¥" : "$") + s;
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
// CJK has no real italic; render the cover emphasis upright + bold + red.
function emToSpan(html) {
  return html
    .replace(/<em>/g, '<span style="color:#a72b22;font-weight:700">')
    .replace(/<\/em>/g, "</span>");
}

Page({
  data: {
    lang: "zh",
    t: L.zh,
    screen: "intro",
    view: { savedStr: "¥0", lostStr: "¥0", accStr: "0/0" },
    ticks: [],
    cv: {},
    vv: {},
    rv: {},
    timer: { pct: 100, secs: "0:25", low: false },
    coverTitleNodes: "",
    footerNodes: "",
  },

  // ----- non-reactive runtime state -----
  s: null,
  timerId: null,
  timeLeft: 0,

  onLoad() {
    let sysLang = "zh";
    try { sysLang = (wx.getSystemInfoSync().language || "zh").toLowerCase(); } catch (e) {}
    const stored = wx.getStorageSync("fd_lang");
    const lang = stored || (sysLang.indexOf("zh") === 0 ? "zh" : "en");
    this.s = { i: 0, saved: 0, lost: 0, correct: 0, answered: 0, decided: false, lastChoice: null, cases: [] };
    this.applyLang(lang, false);
  },
  onHide() { this.stopTimer(); },
  onUnload() { this.stopTimer(); },

  // ----- i18n helpers -----
  tc(o) { return o[this.data.lang]; },
  money(n) { return moneyFmt(n, this.data.lang); },

  onLang(e) {
    const l = e.currentTarget.dataset.l;
    if (l && l !== this.data.lang) this.applyLang(l, true);
  },
  applyLang(lang, rerender) {
    wx.setStorageSync("fd_lang", lang);
    const t = L[lang];
    this.setData({ lang, t, coverTitleNodes: emToSpan(t.coverTitle), footerNodes: t.footer });
    this.syncStats();
    if (rerender) {
      const scr = this.data.screen;
      if (scr === "case" || scr === "verdict") { this.paintCase(); if (this.s.decided) this.paintVerdict(); }
      else if (scr === "report") { this.paintReport(); }
    }
  },

  syncStats() {
    const s = this.s;
    this.setData({
      "view.savedStr": this.money(s.saved),
      "view.lostStr": this.money(s.lost),
      "view.accStr": s.correct + "/" + s.answered,
    });
  },

  // ----- round / draw -----
  drawRound() {
    const pool = shuffle(LIBRARY.slice());
    const n = Math.min(LIBRARY.length, 5 + Math.floor(Math.random() * 6)); // 5..10
    const picked = pool.slice(0, n);
    if (!picked.some((c) => c.answer === "scam")) {
      const x = pool.find((c) => c.answer === "scam" && picked.indexOf(c) < 0);
      if (x) picked[picked.length - 1] = x;
    }
    if (!picked.some((c) => c.answer === "safe")) {
      const x = pool.find((c) => c.answer === "safe" && picked.indexOf(c) < 0);
      if (x) picked[0] = x;
    }
    this.s.cases = shuffle(picked);
    Object.assign(this.s, { i: 0, saved: 0, lost: 0, correct: 0, answered: 0, decided: false, lastChoice: null });
  },

  onStart() { this.drawRound(); this.renderCase(); },
  onReplay() { this.drawRound(); this.renderCase(); },

  renderCase() {
    this.s.decided = false;
    this.setData({ screen: "case", vv: {} });
    this.paintCase();
    this.buildTicks();
    this.syncStats();
    this.startTimer();
  },

  buildTicks() {
    const s = this.s;
    this.setData({ ticks: s.cases.map((_, idx) => idx < s.i) });
  },

  paintCase() {
    const s = this.s, c = s.cases[s.i], t = this.data.t;
    this.setData({
      cv: {
        kicker: t.caseKickerWord + " " + pad2(s.i + 1) + " / " + pad2(s.cases.length) + " · " + this.tc(c.chan),
        title: this.tc(c.title),
        exhibitTab: t.exhibitWord + " " + String.fromCharCode(65 + s.i) + " — " + t.transcriptWord,
        text: this.tc(c.text),
        senderNodes: '<div style="color:#7a7063;font-size:24rpx;line-height:1.5">' + this.tc(c.sender) + "</div>",
        showRisk: c.risk > 0,
        riskStr: this.money(c.risk),
      },
    });
  },

  // ----- timer -----
  startTimer() {
    this.stopTimer();
    this.timeLeft = DECISION_SECONDS * 1000;
    this.paintTimer();
    this.timerId = setInterval(() => {
      this.timeLeft -= 100;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.paintTimer(); this.decide(null, true); return; }
      this.paintTimer();
    }, 100);
  },
  stopTimer() { if (this.timerId) { clearInterval(this.timerId); this.timerId = null; } },
  paintTimer() {
    const ms = this.timeLeft;
    const pct = Math.max(0, ms) / (DECISION_SECONDS * 1000) * 100;
    const sec = Math.max(0, Math.ceil(ms / 1000));
    this.setData({
      "timer.pct": pct,
      "timer.secs": Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"),
      "timer.low": ms <= 5000,
    });
  },

  // ----- decision / verdict -----
  onRule(e) { if (!this.s.decided) this.decide(e.currentTarget.dataset.c, false); },
  decide(choice, timedOut) {
    if (this.s.decided) return;
    this.stopTimer();
    const s = this.s, c = s.cases[s.i];
    const right = !timedOut && choice === c.answer;
    s.answered++;
    if (right) s.correct++;
    if (c.answer === "scam") { if (right) s.saved += c.risk; else s.lost += c.risk; }
    s.decided = true;
    s.lastChoice = timedOut ? "timeout" : choice;
    this.syncStats();
    this.paintVerdict();
  },

  paintVerdict() {
    const s = this.s, c = s.cases[s.i], t = this.data.t;
    const timedOut = s.lastChoice === "timeout";
    const right = !timedOut && s.lastChoice === c.answer;
    const stampKey = timedOut ? "stampTimeout"
      : right ? (c.answer === "scam" ? "stampBlocked" : "stampCleared")
              : (c.answer === "scam" ? "stampMissed" : "stampFalse");
    this.setData({
      screen: "verdict",
      vv: {
        stamp: t[stampKey],
        ok: right,
        tells: c.flags.map((f, idx) => ({ no: pad2(idx + 1), tx: this.tc(f) })),
        truth: this.tc(c.answer === "scam" ? c.truthScam : c.truthSafe),
        last: s.i === s.cases.length - 1,
      },
    });
  },

  onNext() {
    const s = this.s;
    if (s.i === s.cases.length - 1) this.paintReport();
    else { s.i++; this.renderCase(); }
  },

  paintReport() {
    const s = this.s, t = this.data.t;
    const pct = s.answered ? s.correct / s.answered : 0;
    let grade = "C", lineKey = "gC";
    if (pct === 1) { grade = "S"; lineKey = "gS"; }
    else if (pct >= 0.8) { grade = "A"; lineKey = "gA"; }
    else if (pct >= 0.6) { grade = "B"; lineKey = "gB"; }
    this.setData({
      screen: "report",
      rv: {
        grade, gradeLine: t[lineKey],
        savedStr: this.money(s.saved), lostStr: this.money(s.lost), accStr: s.correct + "/" + s.answered,
      },
    });
  },
});
