import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParentContext } from '../../context/ParentContext';
import { api } from '../../lib/api';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your AI Parent Helper. How can I help you interpret your child\'s progress, fees, or messages today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { activeChild, t } = useParentContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.post('/parent/ask-assistant', {
        prompt: userText,
        childData: activeChild
      });
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: res.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="ai-fab"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="ai-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} />
                <span style={{ fontWeight: 600 }}>AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: 'white', border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="ai-chat-body">
              {messages.map(msg => (
                <div key={msg.id} className={`ai-message-wrapper ${msg.sender}`}>
                  {msg.sender === 'ai' && <div className="ai-avatar"><Bot size={14} /></div>}
                  <div className={`ai-message ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="ai-message-wrapper ai">
                  <div className="ai-avatar"><Bot size={14} /></div>
                  <div className="ai-message ai typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="ai-chat-footer" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Ask about progress, fees..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping} style={{ border: 'none', cursor: 'pointer' }}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
