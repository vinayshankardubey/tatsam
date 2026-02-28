"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Message {
  id: string;
  from: "user" | "ai";
  text: string;
  time: string;
  hindi?: string; // optional Hindi sub-line
}

const getTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const WELCOME: Message[] = [
  {
    id: "w1",
    from: "ai",
    text: "🙏 Pranam! Main hoon Tara — aapki Tatsam Jyotish Sahaayika.",
    hindi: "Aapke graha, nakshatra, aur dasha ko samajhne mein main aapki madad karungi.",
    time: getTime(),
  },
  {
    id: "w2",
    from: "ai",
    text: "Aaj kundali mein kaun sa prashna hai? Vivah, career, swasthya — kuch bhi poochh sakte hain. ✦",
    time: getTime(),
  },
];

const AI_REPLIES: { text: string; hindi?: string }[] = [
  {
    text: "Aapke Shani ki Mahadasha abhi chal rahi hai — yeh samay dhairya aur mehnat ka hai.",
    hindi: "Is dasha mein jo bhi karein soch-samajhkar karein. Safalta zaroor milegi, thodi deri se.",
  },
  {
    text: "Guru (Jupiter) aapki 9th house mein transit kar raha hai — yeh bhagya aur adhyatma ka samay hai.",
    hindi: "Naye raaste khulenge, lekin pehle purane karmon ka hisaab chukana hoga.",
  },
  {
    text: "Aapka Mangal aur Shukra ka yoga bahut shubh hai is saal vivah ke liye.",
    hindi: "November–December 2026 ka samay bahut acha rahega rishte ke liye.",
  },
  {
    text: "Ketu ke prabhav se aap andar se kuch khoj rahe hain — yeh spirituality ka aahvaan hai.",
    hindi: "Jo chhod rahe hain, woh maheena jaana chahiye — naya raasta mil raha hai.",
  },
  {
    text: "Aapke liye poori Kundali dekhna zaroori hai — hamara ek expert Jyotishi se milein?",
    hindi: "Sirf ek consultation mein aapke saare sawaalon ke jawab mil sakte hain.",
  },
];

const QUICK_PROMPTS = [
  { label: "Meri Kundali", emoji: "📜" },
  { label: "Vivah Yog", emoji: "💍" },
  { label: "Career & Business", emoji: "💼" },
  { label: "Sade Sati Check", emoji: "🪐" },
  { label: "Lucky Number 2026", emoji: "🔢" },
  { label: "Kab hogi Naukri?", emoji: "✨" },
];

export default function AstroChat() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState<Message[]>(WELCOME);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [closing, setClosing] = useState(false);
  const [tab, setTab]         = useState<"chat"|"about">("chat");

  const shownRef       = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  /* ── Trigger on scroll to bottom (once per page load) ── */
  useEffect(() => {
    const sentinel = document.getElementById("page-end");
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shownRef.current) {
          shownRef.current = true;
          setTimeout(() => setOpen(true), 500);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (open && tab === "chat") setTimeout(() => inputRef.current?.focus(), 400);
  }, [open, tab]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setMsgs((m) => [...m, { id: Date.now().toString(), from: "user", text, time: getTime() }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800));
    setTyping(false);
    const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
    setMsgs((m) => [...m, { id: (Date.now() + 1).toString(), from: "ai", ...reply, time: getTime() }]);
  }, [input, typing]);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 380);
  };

  if (!open) return null;

  return (
    <div className={`ac-overlay${closing ? " ac-overlay--out" : ""}`} role="dialog" aria-modal="true" aria-label="Tatsam Jyotish Chat">
      {/* Warm aurora mesh backdrop */}
      <div className="ac-backdrop" aria-hidden="true" />

      <div className={`ac-panel${closing ? " ac-panel--out" : ""}`}>

        {/* ── Top decorative mandala strip ── */}
        <div className="ac-mandala-strip" aria-hidden="true">
          <span>ॐ</span>
          {Array.from({length:12}).map((_,i)=><span key={i} className="ac-mandala-dot"/>)}
          <span>✦</span>
          {Array.from({length:12}).map((_,i)=><span key={i} className="ac-mandala-dot"/>)}
          <span>ॐ</span>
        </div>

        {/* ── Header ── */}
        <header className="ac-header">
          <div className="ac-header__avatar">
            <span className="ac-header__om">ॐ</span>
          </div>
          <div className="ac-header__info">
            <p className="ac-header__name">JYOTISHI TARA</p>
            <p className="ac-header__sub">
              <span className="ac-dot" />
              Vedic Expert · Abhi Online Hai
            </p>
          </div>
          <div className="ac-header__right">
            <div className="ac-header__badge">TATSAM AI</div>
            <button className="ac-close" onClick={close} aria-label="Band karein">✕</button>
          </div>
        </header>

        {/* ── Tab bar ── */}
        <div className="ac-tabs">
          <button className={`ac-tab${tab==="chat"?" ac-tab--active":""}`} onClick={()=>setTab("chat")}>
            💬 Baat Karein
          </button>
          <button className={`ac-tab${tab==="about"?" ac-tab--active":""}`} onClick={()=>setTab("about")}>
            🪷 Hamare Baare Mein
          </button>
        </div>

        {tab === "about" ? (
          /* ── About tab ── */
          <div className="ac-about">
            <div className="ac-about__symbol">ॐ</div>
            <h2 className="ac-about__title">Tatsam Jyotish</h2>
            <p className="ac-about__sub">Vedic Astrology · Kundali · Numerology</p>
            <div className="ac-about__cards">
              {[
                { icon: "📜", title: "Kundali Vishleshan", desc: "Janam patrika ka sampurna adhyayan — lagna, rashi, nakshatra sab" },
                { icon: "🪐", title: "Graha Gochar", desc: "Shani, Guru, Rahu-Ketu ke transit ka prabhav aap par kya hai" },
                { icon: "💍", title: "Vivah Yog", desc: "Kundali milan, manglik dosh, aur shubh muhurat" },
                { icon: "📊", title: "Dasha Kaal", desc: "Aapki mahadasha-antardasha mein kab kya hoga" },
              ].map(c => (
                <div key={c.title} className="ac-about__card">
                  <span className="ac-about__card-icon">{c.icon}</span>
                  <strong className="ac-about__card-title">{c.title}</strong>
                  <p className="ac-about__card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
            <button className="ac-cta-btn" onClick={()=>setTab("chat")}>
              Abhi Poochhen →
            </button>
          </div>
        ) : (
          <>
            {/* ── Messages ── */}
            <div className="ac-messages">
              {msgs.map((msg) => (
                <div key={msg.id} className={`ac-msg ac-msg--${msg.from}`}>
                  {msg.from === "ai" && (
                    <div className="ac-msg__avatar" aria-hidden="true">ॐ</div>
                  )}
                  <div className="ac-msg__wrap">
                    <div className="ac-msg__bubble">
                      <p className="ac-msg__text">{msg.text}</p>
                      {msg.hindi && (
                        <p className="ac-msg__hindi">{msg.hindi}</p>
                      )}
                    </div>
                    <span className="ac-msg__time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="ac-msg ac-msg--ai">
                  <div className="ac-msg__avatar" aria-hidden="true">ॐ</div>
                  <div className="ac-msg__wrap">
                    <div className="ac-msg__bubble ac-msg__bubble--typing">
                      <span /><span /><span />
                      <span className="ac-typing-text">Tara soch rahi hai…</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick prompts ── */}
            <div className="ac-chips">
              {QUICK_PROMPTS.map((p) => (
                <button key={p.label} className="ac-chip" onClick={() => setInput(p.label)}>
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>

            {/* ── Input ── */}
            <div className="ac-input-row">
              <input
                ref={inputRef}
                className="ac-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Apna sawaal likhen… (Hindi/English)"
                aria-label="Apna sawaal"
              />
              <button
                className="ac-send"
                onClick={send}
                disabled={!input.trim() || typing}
                aria-label="Bhejein"
              >
                ↑
              </button>
            </div>

            <p className="ac-footer-note">
              🔒 Aapki jaankari surakshit hai · Tara ek AI sahaayika hai
            </p>
          </>
        )}

        {/* ── Bottom decorative bar ── */}
        <div className="ac-bottom-bar" aria-hidden="true">
          <span>Har grah ki raah mein Tatsam saath hai ✦</span>
        </div>
      </div>
    </div>
  );
}
