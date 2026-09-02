import { useState } from 'react';
import { Bot, MessageCircle, Send, ShieldCheck, X, Minimize2 } from 'lucide-react';
import { api } from '../services/api';

type Message = { who: 'bot' | 'you'; text: string };

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sending, setSending] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { who: 'bot', text: 'JalMitra is ready. Ask about current flood risk, rainfall, drainage, shelters or safe routes.' },
  ]);

  const send = async () => {
    const text = q.trim();
    if (!text || sending) return;
    setQ('');
    setMsgs((m) => [...m, { who: 'you', text }]);
    setSending(true);
    try {
      const r = await api.chat({ query: text });
      setMsgs((m) => [...m, { who: 'bot', text: r.answer || 'I can help with flood risk, drainage, rainfall and routing.' }]);
    } catch {
      setMsgs((m) => [...m, { who: 'bot', text: 'Live chat service is unavailable. Please check the API gateway.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`chat-dock ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="chat-panel" aria-label="JalMitra flood intelligence assistant">
          <div className="chat card">
            <div className="card-head">
              <div className="chat-title">
                <div className="bot-mark"><Bot size={17} /></div>
                <div>
                  <div className="eyebrow">JALMITRA</div>
                  <h3>Flood intelligence assistant</h3>
                </div>
              </div>
              <div className="chat-head-actions">
                <ShieldCheck size={17} />
                <button className="chat-close" onClick={() => setOpen(false)} aria-label="Minimize JalMitra">
                  <Minimize2 size={15} />
                </button>
              </div>
            </div>

            <div className="messages">
              {msgs.map((m, i) => (
                <div key={i} className={m.who === 'you' ? 'msg you' : 'msg'}>{m.text}</div>
              ))}
              {sending && <div className="msg typing">JalMitra is checking live data…</div>}
            </div>

            <div className="chat-input">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about flood risk…"
                aria-label="Ask JalMitra"
              />
              <button onClick={send} disabled={sending || !q.trim()} aria-label="Send message">
                <Send size={16} />
              </button>
            </div>
            <div className="chat-note">Demo assistant · responses use the synthetic pilot-city dataset</div>
          </div>
        </section>
      )}

      <button
        className={`chat-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close JalMitra' : 'Open JalMitra'}
        title={open ? 'Close JalMitra' : 'Talk to JalMitra'}
      >
        {open ? <X size={21} /> : <MessageCircle size={22} />}
        {!open && <span className="chat-fab-dot" />}
      </button>
    </div>
  );
}
