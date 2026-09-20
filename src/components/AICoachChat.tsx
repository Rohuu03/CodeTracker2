import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  BrainCircuit,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  BookOpen,
} from 'lucide-react';
import { AICoachMessage, CodingProfile, AIAnalysisResult } from '../types/index';

interface AICoachChatProps {
  profiles: CodingProfile[];
  aiAnalysis: AIAnalysisResult | null;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({ profiles, aiAnalysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialCoachGreeting = (): AICoachMessage => {
    const totalSolved = profiles.reduce((acc, p) => acc + (p.problemsSolved || 0), 0);
    const topWeak = aiAnalysis?.weakAreas?.[0]?.topic || 'Dynamic Programming';
    const topRec = aiAnalysis?.dailyPractice?.[0]?.title || 'Coin Change';

    return {
      id: 'welcome',
      sender: 'coach',
      text: `Hello! I'm your **CodeTrack AI Coach**. I'm actively tracking your progress across **${totalSolved} solved problems** on your connected profiles.\n\nYour primary algorithmic bottleneck is currently **${topWeak}**. Would you like to review today's recommended drill (**${topRec}**), or get Socratic hints on a problem you're solving right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const [messages, setMessages] = useState<AICoachMessage[]>([initialCoachGreeting()]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AICoachMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages,
          profiles,
          aiAnalysis,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const coachMsg: AICoachMessage = {
          id: `coach_${Date.now()}`,
          sender: 'coach',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, coachMsg]);
      } else {
        throw new Error(data.error || 'Failed to get reply');
      }
    } catch (err: any) {
      const errorMsg: AICoachMessage = {
        id: `coach_err_${Date.now()}`,
        sender: 'coach',
        text: 'I ran into a temporary issue connecting to the AI engine. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'What should I practice today?', text: 'What should I practice today based on my gaps?' },
    { label: 'Why am I weak in DP?', text: 'Why is Dynamic Programming flagged as my main weakness?' },
    { label: 'Give me a progressive hint', text: 'I am stuck on a problem. Can you give me a subtle Hint 1 without giving away the approach?' },
    { label: 'Guide me without code', text: "Don't give me the solution - guide me with Socratic questions to help me formulate the invariant myself." },
  ];

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="btn-open-ai-coach-chat"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-white shadow-xl hover:bg-zinc-800 hover:scale-105 transition-all ring-4 ring-emerald-500/20"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">AI Coach Chat</span>
        </button>
      )}

      {/* Slide-over / Drawer Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[95vw] sm:w-[600px] h-[85vh]'
              : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-none">CodeTrack AI Coach</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Grounded in your real profile</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="border-b border-zinc-100 bg-zinc-50/70 px-3 py-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.text)}
                disabled={isLoading}
                className="rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 whitespace-nowrap hover:bg-zinc-100 hover:border-zinc-300 disabled:opacity-50 transition-colors shadow-2xs"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-zinc-50/30">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'coach' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 text-white rounded-br-xs font-normal'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`mt-1.5 block text-[9px] font-mono ${
                      msg.sender === 'user' ? 'text-zinc-400 text-right' : 'text-zinc-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-700 font-bold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-zinc-400 pl-9">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Coach is formulating analysis...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-zinc-100 bg-white p-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything (hints, roadmap, DP...)"
              disabled={isLoading}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white disabled:opacity-40 hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
