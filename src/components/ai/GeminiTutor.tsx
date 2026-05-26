import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../lib/api';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export const GeminiTutor = () => {
    const { aiEnabled } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi there! I'm your AI Tutor. Need help with homework or studying?", sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await api.post<{ response: string }>('/student/ask-tutor', { prompt: userMsg.text });

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: data.response || "I'm having trouble connecting to my brain right now.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: error.message || "Sorry, I encountered an error. Please try again later.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!aiEnabled) return null;

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all z-50 animate-bounce-slow group"
                >
                    <Sparkles className="w-6 h-6 text-white" />
                    <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Ask AI Tutor
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <Card className="h-full flex flex-col border-purple-500/50 shadow-2xl shadow-purple-900/20 bg-slate-900/95 backdrop-blur-md">
                        {/* Header */}
                        <div className="p-4 border-b border-purple-500/20 flex justify-between items-center bg-purple-500/10 rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                    <Bot className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Gemini Tutor</h3>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                                            max-w-[85%] p-3 rounded-2xl text-sm 
                                            ${msg.sender === 'user'
                                                ? 'bg-purple-600 text-white rounded-tr-none'
                                                : 'bg-slate-800 border border-slate-700 text-gray-200 rounded-tl-none'}
                                        `}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/50 rounded-b-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 rounded-md text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
};

// AI Tutor Component
