
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, ChevronDown, Zap, HelpCircle, BookOpen } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  { label: "What is B3LYP?", icon: <Zap className="w-3 h-3" /> },
  { label: "Explain HOMO/LUMO", icon: <BookOpen className="w-3 h-3" /> },
  { label: "Geometry Optimization?", icon: <Sparkles className="w-3 h-3" /> },
  { label: "HF vs DFT?", icon: <HelpCircle className="w-3 h-3" /> },
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your Quantum Assistant. I can help explain computational chemistry concepts or guide you through simulations." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
        // Focus input on open
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const history = messages; 

    try {
      const responseText = await chatWithGemini(userMsg.text, history);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the quantum realm right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none font-sans">
      
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-[360px] sm:w-[420px] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right mb-5 overflow-hidden ring-1 ring-white/5 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 h-[600px]' : 'scale-90 opacity-0 translate-y-10 h-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full animate-pulse"></div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Quantum Assistant</h3>
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        Powered by Gemini 2.5
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                 <button 
                    onClick={() => setMessages([{ role: 'model', text: "Hello! I'm your Quantum Assistant. I can help explain computational chemistry concepts or guide you through simulations." }])}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Clear Chat"
                >
                    <Sparkles className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                             <Sparkles className="w-4 h-4 text-cyan-400" />
                        </div>
                    )}
                    <div 
                        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm' 
                            : 'bg-[#1a1a1a] border border-white/5 text-slate-200 rounded-tl-sm'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex justify-start w-full">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                             <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1.5 items-center h-10">
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
        </div>

        {/* Suggestions & Input Area */}
        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/50 backdrop-blur-lg">
            
            {/* Quick Suggestions (Only show if few messages or just AI greeting) */}
            {messages.length <= 2 && !isLoading && (
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mask-gradient-right">
                    {SUGGESTIONS.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(s.label)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-full text-xs text-slate-300 hover:text-cyan-300 transition-all whitespace-nowrap"
                        >
                            {s.icon}
                            {s.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a chemistry question..."
                    className="w-full bg-[#1a1a1a] border border-white/10 group-hover:border-white/20 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
            
            <div className="text-[10px] text-center text-slate-600 mt-2 font-medium">
                QuantaLab AI can make errors. Verify scientific data.
            </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 z-50 ${
            isOpen 
            ? 'bg-[#1a1a1a] text-slate-300 border border-white/10 rotate-90 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        
        {/* Unread indicator */}
        {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-black"></span>
            </span>
        )}

        {/* Hover Label */}
        {!isOpen && (
            <div className="absolute right-16 px-3 py-1.5 bg-black/80 backdrop-blur border border-white/10 rounded-lg text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none">
                Ask AI Assistant
            </div>
        )}
      </button>

    </div>
  );
};

export default Chatbot;
