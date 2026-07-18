/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, RefreshCw, Layers, Volume2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface GemmaChatbotProps {
  onActivityLog: (activity: string, xpEarned: number) => void;
}

const QUICK_PROMPTS = [
  { id: 'qp_1', label: '🤟 Translate C-A-T to Sign!', text: 'How do you spell CAT in Sign Language? Tell me step by step!' },
  { id: 'qp_2', label: '💻 IT Level 1: Hardware', text: 'I want to learn IT Level 1: What is the hardware in a computer?' },
  { id: 'qp_3', label: '🇫🇷 Bonjour! French sign', text: 'How do you say hello in French, and how do you sign Bonjour?' },
  { id: 'qp_4', label: '⚡ IT Next Level: Safe Online', text: 'Tell me about IT Level 3: How can I stay safe on the internet?' }
];

export default function GemmaChatbot({ onActivityLog }: GemmaChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'gemini',
      text: '👋 Bleep Bloop! Hello there! I am **Gemma AI**, your friendly, visual IT and Sign Language tutor! 💻🤟\n\nI love helping children learn computers and fingerspelling! You can click any of the **Quick Questions** below, or type anything you want! \n\nHow can I help you learn today? 🌟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add student message
    const studentMsg: ChatMessage = {
      id: `msg_${Date.now()}_student`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      onActivityLog(`Asked Gemma AI Tutor: "${textToSend.slice(0, 30)}..."`, 5);

      // Call our secure server-side API proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          // Only send the last 6 messages to avoid clogging the context
          history: messages.slice(-6)
        })
      });

      if (!response.ok) {
        throw new Error('Server API call returned error');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        sender: 'gemini',
        text: data.text || "I didn't receive a response, but let's try another IT concept! 💻🎈",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      onActivityLog('Received guidance from Gemma AI Tutor', 8);

    } catch (err) {
      console.error('Error sending chat message:', err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        sender: 'gemini',
        text: '⚠️ Oh oh! Something scrambled my learning wires! Let’s double check our internet or try another quick prompt! 🔌✨',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_welcome_res',
        sender: 'gemini',
        text: '👋 Fresh start! I am **Gemma AI**, ready for computers and fingerspelling! What shall we learn next? 🖥️🤟',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    onActivityLog('Cleared chat conversation', 0);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[520px]" id="section_gemma_chatbot">
      {/* Chat header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm animate-float">
            🤖
          </div>
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm leading-none flex items-center gap-1">
              <span>Gemma AI Tutor</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Fingerspelling & IT Level Trainer</span>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          title="Restart conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-3 scroll-smooth">
        {messages.map((msg) => {
          const isAI = msg.sender === 'gemini';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isAI ? 'self-start items-start' : 'self-end items-end'
              }`}
            >
              {/* Sender Tag */}
              <span className="text-[9px] font-mono font-bold text-slate-400 mb-0.5 px-1 uppercase">
                {isAI ? '🤖 Gemma AI' : '🎈 Student'} - {msg.timestamp}
              </span>

              {/* Message box */}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed border whitespace-pre-line shadow-xs ${
                  isAI
                    ? 'bg-white border-slate-150 text-slate-800 rounded-tl-xs'
                    : 'bg-indigo-600 border-indigo-600 text-white rounded-tr-xs'
                }`}
              >
                {/* Parse basic bolding and emojis */}
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex flex-col max-w-[80%] self-start items-start">
            <span className="text-[9px] font-mono text-slate-400 mb-0.5 px-1">🤖 Gemma AI is thinking...</span>
            <div className="p-3 bg-white border border-slate-150 text-slate-700 rounded-2xl rounded-tl-xs flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts tray */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center space-x-2 overflow-x-auto select-none">
        <span className="text-[9px] font-mono font-bold text-indigo-700 uppercase shrink-0">
          Quick Questions:
        </span>
        <div className="flex space-x-1.5">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.id}
              onClick={() => sendMessage(qp.text)}
              disabled={isLoading}
              className="text-[10px] bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 transition-colors font-medium cursor-pointer animate-fade-in"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Send message form */}
      <form onSubmit={handleFormSubmit} className="bg-white border-t border-slate-200 p-3 flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type a word or ask an IT question... 💻🤟"
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl px-4 py-2.5 transition-all flex items-center justify-center cursor-pointer shadow-xs"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
