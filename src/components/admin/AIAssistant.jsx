import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Sparkles, Bot, X } from 'lucide-react';
import { api } from '../../lib/api';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI assistant. I can help interpret financial data, student metrics, and perform calculations. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const { metrics, activity } = useAdmin();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setMessages(prev => [...prev, { role: 'ai', text: "Thinking...", isTyping: true }]);

    try {
      const res = await api.post('/admin/ask-assistant', {
        prompt: userMsg,
        metrics
      });
      setMessages(prev => prev.filter(m => !m.isTyping).concat({ role: 'ai', text: res.response }));
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.filter(m => !m.isTyping).concat({ role: 'ai', text: "Sorry, I'm having trouble connecting right now." }));
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          fontSize: 24,
          zIndex: 999,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Sparkles size={24} />
      </button>

      {/* Slide Panel / Chat Window */}
      {open && (
        <div className="panel-overlay" onClick={() => setOpen(false)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()} style={{ zIndex: 1000 }}>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center' }}><Bot size={24} /></span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>AI Assistant</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Online</div>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} style={{ display: 'flex' }}><X size={16} /></button>
            </div>

            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-base)' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: 16,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
                  maxWidth: '85%',
                  fontSize: 14,
                  boxShadow: 'var(--shadow)',
                  border: m.role === 'ai' ? '1px solid var(--border)' : 'none'
                }}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="panel-footer" style={{ background: 'var(--bg-card)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', width: '100%', gap: 8 }}>
                <input 
                  type="text" 
                  className="input" 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about finance, students..."
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
