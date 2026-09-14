import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TripPlan } from '../types';
import { X, Send, Bot } from 'lucide-react';
import { api } from '../services/api';

interface AIConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripPlan | null;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How can I cut $150 from this budget?',
  'Where are the best local coffee spots?',
  'What is the public transit hack for this city?',
  'Recommend a romantic dinner alternative.'
];

export const AIConciergeDrawer: React.FC<AIConciergeDrawerProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hello! I'm your WanderWise Travel Concierge. I'm actively monitoring your ${trip ? `${trip.duration}-day trip to ${trip.destination}` : 'travel plans'}. Ask me anything about budget trimming, secret photo spots, or local etiquette!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await api.askAIConcierge(query, trip || undefined);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I ran into an issue retrieving real-time tips, but I suggest checking with your hotel concierge or booking tickets early morning to beat the crowds!',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      aria-hidden={!isOpen}
    >
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
      />

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="relative w-full max-w-md bg-white border-l border-slate-200 h-full shadow-2xl flex flex-col justify-between"
      >

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900 font-display">AI Travel Concierge</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {trip ? `${trip.destination} (${trip.duration}d • $${trip.totalBudget})` : 'Active Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 text-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span className={`block text-[9px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  KS
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-32 shadow-xs">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Quick Prompts & Chat Input */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-3">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[11px] font-bold px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about spots, costs, transit..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </motion.div>
    </div>
  );
};
