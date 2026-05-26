import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Minimize2, Maximize2 } from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export default function GlobalAiAssistant() {
  const { studentData } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your SomoBloom AI study partner. How can I help you understand your lessons today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'student' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI "Thinking" and "Typing"
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Thinking...", 
        sender: 'ai',
        isTyping: true 
      }]);
      
      setTimeout(() => {
        setMessages(prev => prev.filter(m => !m.isTyping).concat({
          id: Date.now() + 2,
          text: `I've analyzed your query about "${userMsg.text}". Here's a helpful breakdown: \n\n1. First, we should look at the core concepts...\n2. Next, consider the context of your current grade level (${studentData.grade})...\n3. Finally, let's practice with an example.`,
          sender: 'ai'
        }));
      }, 1500);
    }, 500);
  };

  if (!studentData?.aiStudyEnabled) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 group border-4 border-white dark:border-gray-800"
        >
          <Bot size={32} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-white animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-8 right-8 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl transition-all duration-300 flex flex-col overflow-hidden ${
          isMinimized ? 'h-16 w-72' : 'h-[600px] w-[400px]'
        }`}>
          {/* Header */}
          <div className="p-4 bg-yellow-400 text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot size={24} />
              <span className="font-bold">SomoBloom AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-black/10 rounded-lg">
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/10 rounded-lg">
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-950">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'student' ? 'bg-blue-600' : 'bg-yellow-400'
                      }`}>
                        {msg.sender === 'student' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-900" />}
                      </div>
                      <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.sender === 'student' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSend} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything (e.g. explain gravity)..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 text-slate-900 rounded-xl flex items-center justify-center hover:bg-yellow-500 disabled:opacity-50 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  AI can help you learn, but double check important facts.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
