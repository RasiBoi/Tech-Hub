import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Mic, X, MessageSquare, Cpu, ShoppingCart, Send, Sparkles 
} from 'lucide-react';
import { useAiServiceStatus } from '../hooks/useAiServiceStatus';
import { askAiAssistant } from '../services/aiService';

// Custom visualizer bar component matching existing aesthetic
const VisualizerBar = ({ baseHeight, delay }) => (
  <motion.div
    className="w-[3px] rounded-full bg-gradient-to-t from-blue-600 to-blue-300"
    animate={{
      height: [
        `${baseHeight * 0.3}%`,
        `${baseHeight}%`,
        `${baseHeight * 0.6}%`,
        `${baseHeight * 0.9}%`,
        `${baseHeight * 0.4}%`,
        `${baseHeight * 0.7}%`,
        `${baseHeight * 0.3}%`,
      ],
      opacity: [0.6, 1, 0.8, 1, 0.7, 1, 0.6],
    }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay }}
  />
);

export default function AiAssistantWidget() {
  const aiServiceStatus = useAiServiceStatus();
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'mia', text: 'Hi! I am Mia, your smart workspace concierge. Ask me for styling suggestions (e.g. walnut, minimalist, black, cyberpunk) or specific accessories.' }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Custom Event Listener to toggle from Navbar
  useEffect(() => {
    const handleToggle = () => setIsChatActive(prev => !prev);
    window.addEventListener('toggle-ai-assistant', handleToggle);
    return () => window.removeEventListener('toggle-ai-assistant', handleToggle);
  }, []);

  // Auto-scroll chat messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatTyping]);

  const handleSendChatMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const userMsgText = chatMessageInput;
    const userMsg = { id: `msg_${Date.now()}`, sender: 'user', text: userMsgText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatMessageInput('');
    setIsChatTyping(true);

    try {
      const response = await askAiAssistant(userMsgText);
      const miaMsg = {
        id: `msg_${Date.now()}_mia`,
        sender: 'mia',
        text: response.response,
        recommendations: response.recommendations
      };
      
      setChatMessages(prev => [...prev, miaMsg]);

      // If a vibe is suggested, dispatch custom event (Home page will listen and update)
      if (response.vibeSuggested) {
        window.dispatchEvent(new CustomEvent('change-vibe', { detail: response.vibeSuggested }));
        window.dispatchEvent(new CustomEvent('show-toast', { detail: `Mia adjusted setup vibe to ${response.vibeSuggested}!` }));
      }
    } catch (err) {
      console.error('Chat AI failed', err);
      const errMsg = {
        id: `msg_${Date.now()}_err`,
        sender: 'mia',
        text: 'Sorry, I encountered an issue connecting to the recommendation service. Please try again.'
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleRecommendationAction = (p) => {
    if (p.vibe) {
      window.dispatchEvent(new CustomEvent('change-vibe', { detail: p.vibe }));
    }
    // Dispatch a global show-toast event
    window.dispatchEvent(new CustomEvent('show-toast', { detail: `"${p.title}" added to cart!` }));
  };

  return (
    <>
      {/* Floating Toggle Button (visible when chat is closed) */}
      <AnimatePresence>
        {!isChatActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-45"
          >
            <motion.button
              onClick={() => setIsChatActive(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.6)] group border border-blue-400/30"
              aria-label="Open AI Concierge"
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse" />
              <Brain className="text-white w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -left-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Glassmorphic Chat Drawer */}
      <AnimatePresence>
        {isChatActive && (
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-[#0b1021]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute top-[10%] left-[-20%] w-60 h-60 bg-indigo-500/10 rounded-full blur-[70px] pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    Mia Smart Concierge
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-emerald-400">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-none">AI Assistant Services • Active</p>
                </div>
              </div>

              <button 
                onClick={() => setIsChatActive(false)}
                className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-600/20 scrollbar-track-transparent">
              
              {/* Introduction Profile Card */}
              <div className="bg-gradient-to-b from-[#16234b]/60 to-[#0e1732]/60 border border-white/[0.06] rounded-2xl p-4 flex gap-4 shadow-lg mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-b from-[#21366d] to-[#13224a] border border-white/10 overflow-hidden shrink-0 flex items-end justify-center">
                  <img
                    src="https://res.cloudinary.com/ddarldtbb/image/upload/v1779814719/i_need_this_girl_alone_202605262138-removebg-preview_czgnx1.png"
                    alt="Mia"
                    className="w-[124%] h-[124%] object-contain"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="text-xs font-black text-white">Ask Mia anything</h4>
                  <p className="text-[11.5px] text-slate-350 leading-relaxed mt-1">
                    I can recommend products, search deals, adjust your desktop style vibe, or check shipping details.
                  </p>
                </div>
              </div>

              {/* Chat bubble list */}
              {chatMessages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white/[0.06] text-slate-100 rounded-tl-none border border-white/[0.06] shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Recommendation layout inside drawer */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="w-full mt-3 space-y-2.5 max-w-[90%]">
                      {msg.recommendations.map((p) => (
                        <div 
                          key={p.id} 
                          className="bg-[#0d1527]/70 border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-3 hover:border-white/[0.15] transition-all"
                        >
                          <img 
                            src={p.image} 
                            alt={p.title}
                            className="w-10 h-10 rounded-lg bg-white p-0.5 object-contain shrink-0 border border-white/10" 
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <h5 className="font-extrabold text-[11px] text-white truncate leading-tight">{p.title}</h5>
                            <p className="text-[10px] text-blue-400 font-black mt-0.5">LKR {Number(p.price).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleRecommendationAction(p)}
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isChatTyping && (
                <div className="flex items-center gap-1.5 text-slate-400 italic pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-150" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Wave visualizer bar section */}
            <div className="relative z-10 px-5 pt-2 flex flex-col items-center gap-1 opacity-80 border-t border-white/[0.04] bg-white/[0.01] py-2">
              <div className="flex items-center gap-[3px] h-8 justify-center">
                {[35, 55, 25, 80, 45, 95, 100, 70, 45, 85, 50, 75, 30, 55, 40].map((h, i) => (
                  <VisualizerBar key={`drawer-viz-${i}`} baseHeight={h} delay={i * 0.08} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-blue-300 font-bold uppercase tracking-widest leading-none">
                <Mic className="w-2.5 h-2.5 animate-pulse text-blue-400" />
                Voice Mode Ready
              </div>
            </div>

            {/* Input Form at bottom */}
            <div className="relative z-10 p-5 bg-[#0b1021] border-t border-white/[0.08]">
              <form onSubmit={handleSendChatMessage} className="flex items-center bg-white/5 border border-white/10 p-1.5 rounded-2xl focus-within:border-blue-500/50 group transition-all duration-300">
                <input
                  type="text"
                  placeholder="Ask about workspace aesthetics..."
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  className="flex-1 bg-transparent border-0 text-white text-xs px-3 py-2.5 focus:ring-0 focus:outline-none placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!chatMessageInput.trim()}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                    chatMessageInput.trim() 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95' 
                      : 'text-slate-500 bg-white/5 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
