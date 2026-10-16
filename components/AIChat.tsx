/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect, memo } from 'react';
import { Terminal, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '// AHMED_BADR_CLI online. Ask about projects, services, stack — or how to start a build.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const openTerminal = () => setIsOpen(true);
    window.addEventListener('open-ai-terminal', openTerminal);
    return () => window.removeEventListener('open-ai-terminal', openTerminal);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    const history = messages.filter((m) => m.role === 'user' || m.role === 'model');

    void fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    }).catch(() => {});

    const responseText = await sendMessageToGemini(text, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-96 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-lg overflow-hidden shadow-2xl shadow-black/80"
          >
            {/* Terminal Header */}
            <div className="bg-zinc-950 px-4 py-3 flex justify-between items-center border-b border-white/15">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white tracking-wider uppercase">AHMED_CLI // TERMINAL</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-zinc-400 hover:text-white p-1 transition-colors" 
                data-hover="true"
                aria-label="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-64 md:h-80 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded border text-xs ${
                      msg.role === 'user'
                        ? 'bg-white text-black border-white font-medium'
                        : 'bg-zinc-900/90 text-zinc-300 border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/10 p-3 rounded flex items-center gap-2 text-zinc-400 text-xs">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <span>executing query...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal Input */}
            <div className="p-3 border-t border-white/15 bg-black">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-bold text-xs select-none">&gt;_</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="enter command or question..."
                  className="flex-1 bg-transparent text-white placeholder-zinc-600 text-xs focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-white text-black px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-zinc-200 transition-colors disabled:opacity-40"
                  data-hover="true"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 rounded border border-white/30 bg-black text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-white hover:text-black transition-all group"
        data-hover="true"
      >
        <Terminal className="w-4 h-4" />
        <span>{isOpen ? 'CLOSE CLI' : 'AI_TERMINAL'}</span>
      </motion.button>
    </div>
  );
};

export default memo(AIChat);
