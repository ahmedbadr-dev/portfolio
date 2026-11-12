/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Terminal, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import HeroMascot from './HeroMascot';
import { playTechBoot, playTechType, unlockTechAudio } from '../lib/techSound';

const WELCOME =
  '// SYS_BOOT :: AHMED_CLI online. Ask about projects, stack, services — or how to start a build.';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isTypingWelcome, setIsTypingWelcome] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const welcomedRef = useRef(false);
  const typeTimerRef = useRef<number | null>(null);

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
  }, [messages, typingText, isOpen, isLoading]);

  useEffect(() => {
    const openTerminal = () => setIsOpen(true);
    window.addEventListener('open-ai-terminal', openTerminal);
    return () => window.removeEventListener('open-ai-terminal', openTerminal);
  }, []);

  useEffect(() => {
    const unlock = () => unlockTechAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const bootDelay = window.setTimeout(() => {
      setIsOpen(true);
      playTechBoot();

      if (welcomedRef.current) return;
      welcomedRef.current = true;

      if (reduceMotion) {
        setMessages([{ role: 'model', text: WELCOME }]);
        return;
      }

      setIsTypingWelcome(true);
      let i = 0;
      const tick = () => {
        i += 1;
        setTypingText(WELCOME.slice(0, i));
        if (i % 2 === 0) playTechType();
        if (i < WELCOME.length) {
          typeTimerRef.current = window.setTimeout(tick, 22 + Math.random() * 28);
        } else {
          setIsTypingWelcome(false);
          setTypingText('');
          setMessages([{ role: 'model', text: WELCOME }]);
        }
      };
      typeTimerRef.current = window.setTimeout(tick, 280);
    }, 700);

    return () => {
      window.clearTimeout(bootDelay);
      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTypingWelcome) return;

    const userMessage: ChatMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    playTechType();

    setTimeout(scrollToBottom, 100);

    const history = messages.filter((m) => m.role === 'user' || m.role === 'model');

    void fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    }).catch(() => {});

    const responseText = await sendMessageToGemini(text, history);

    setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[min(92vw,22rem)] bg-black/95 backdrop-blur-2xl border border-white/20 overflow-hidden shadow-2xl shadow-black/80"
          >
            <div className="bg-zinc-950 px-3 py-2.5 flex justify-between items-center border-b border-white/15">
              <div className="flex items-center gap-2 min-w-0">
                <Terminal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="text-[10px] font-bold text-zinc-300 tracking-widest uppercase truncate">
                  AHMED_CLI // TERMINAL
                </span>
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

            <div
              ref={chatContainerRef}
              data-lenis-prevent
              className="h-52 md:h-64 overflow-y-auto p-3 space-y-2.5 text-xs leading-relaxed"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-2.5 border text-[11px] md:text-xs ${
                      msg.role === 'user'
                        ? 'bg-white text-black border-white font-medium'
                        : 'bg-zinc-900/90 text-zinc-300 border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTypingWelcome && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] p-2.5 border border-emerald-500/30 bg-zinc-900/90 text-emerald-300/90 text-[11px] md:text-xs">
                    <span>{typingText}</span>
                    <span className="inline-block w-1.5 h-3 ml-0.5 align-middle bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/10 p-2.5 flex items-center gap-2 text-zinc-400 text-[11px]">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <span>executing query...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2.5 border-t border-white/15 bg-black">
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
                  disabled={isTypingWelcome}
                  className="flex-1 bg-transparent text-white placeholder-zinc-600 text-xs focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || isTypingWelcome || !input.trim()}
                  className="bg-white text-black px-2.5 py-1.5 text-xs font-bold uppercase hover:bg-zinc-200 transition-colors disabled:opacity-40"
                  data-hover="true"
                  aria-label="Send"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-[4.25rem] h-[4.25rem] md:w-[4.75rem] md:h-[4.75rem] rounded-full border border-white/30 bg-zinc-950 shadow-[0_0_24px_rgba(255,255,255,0.12)] flex items-center justify-center overflow-visible"
        data-hover="true"
      >
        <HeroMascot
          size={58}
          className="chat-mascot"
          label={isOpen ? 'Close AI terminal' : 'Open AI terminal'}
          onClick={() => {
            setIsOpen((open) => !open);
            playTechType();
          }}
        />
        {!isOpen && (
          <span className="pointer-events-none absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse z-10" />
        )}
      </motion.div>
    </div>
  );
};

export default memo(AIChat);
