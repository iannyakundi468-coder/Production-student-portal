import { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Bot, Send, Lock, Sparkles } from 'lucide-react';

export default function AiStudy() {
  const { studentData } = useStudent();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your AI Study Assistant. What topic would you like to explore today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), text: input, sender: 'student' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `That's an interesting question about "${newMessage.text}". Here is a simple explanation to help you understand...`,
        sender: 'ai'
      }]);
    }, 1000);
  };

  if (!studentData?.aiStudyEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Lock className="text-gray-400 dark:text-gray-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant Locked</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          The AI Study Assistant is currently disabled for your account. Please ask your teacher to activate this feature for you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
          <Bot className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            AI Study Assistant <Sparkles className="text-yellow-500" size={16} />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Ask questions and learn at your own pace</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.sender === 'student' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
