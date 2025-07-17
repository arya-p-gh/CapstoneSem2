import React, { useState, useRef, useEffect } from 'react';
import './FloatingAIChat.css';

const GEMINI_API_KEY = 'AIzaSyCelZ3o9F5nh9oedA8__U5aboZ_2b6jLtg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: "Hi! I'm your AI assistant. How can I help you today?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { if (open && messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);

  const sendMessage = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
      });
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';
      setMessages(msgs => [...msgs, { sender: 'ai', text: aiText }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Error connecting to AI service.' }]);
    }
    setLoading(false);
  };

  return (
    <div>
      {!open && (
        <button className="floating-ai-chat-icon" onClick={() => setOpen(true)} title="Chat with AI">
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
      {open && (
        <div className="floating-ai-chat-window">
          <div className="floating-ai-chat-header">
            <span>AI Chat</span>
            <button className="floating-ai-chat-close" onClick={() => setOpen(false)} title="Close">×</button>
          </div>
          <div className="floating-ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`floating-ai-chat-message ${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="floating-ai-chat-input-row" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="floating-ai-chat-input"
              autoFocus
            />
            <button type="submit" disabled={loading || !input.trim()} className="floating-ai-chat-send">{loading ? '...' : 'Send'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default FloatingAIChat; 