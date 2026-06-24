// src/screens/ChatScreen.jsx
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, doc, getDoc
} from 'firebase/firestore';
import './ChatScreen.css';

export default function ChatScreen({ matchData, currentUser, onOpenSettings, onViewProfile }) {
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState('');
  const [matchedUser, setMatchedUser] = useState(null);
  const bottomRef                 = useRef(null);

  const chatId = matchData.matchId;

  // Load matched user's name
  useEffect(() => {
    async function loadMatch() {
      try {
        const matchRef  = doc(db, 'matches', chatId);
        const matchSnap = await getDoc(matchRef);
        if (matchSnap.exists()) {
          const data      = matchSnap.data();
          const isUser1   = data.user1.uid === currentUser.uid;
          setMatchedUser(isUser1 ? data.user2 : data.user1);
        }
      } catch (err) {
        console.error('Error loading match:', err);
      }
    }
    loadMatch();
  }, [chatId, currentUser.uid]);

  // Listen to messages in real time
  useEffect(() => {
    const messagesRef = collection(db, 'matches', chatId, 'messages');
    const q           = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });

    return () => unsub();
  }, [chatId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;

    setText('');

    try {
      await addDoc(collection(db, 'matches', chatId, 'messages'), {
        text:      trimmed,
        senderId:  currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Send error:', err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const initials = matchedUser?.name
    ? matchedUser.name.charAt(0).toUpperCase()
    : '?';

  return (
    <div className="chat-screen">

      {/* Header */}
      <div className="chat-header">
        <div className="chat-av">{initials}</div>
        <div className="chat-header-info" onClick={onViewProfile} style={{ cursor: 'pointer' }}>
          <div className="chat-header-name">
            {matchedUser?.name || '…'}
          </div>
          <div className="chat-header-status">
            <div className="chat-status-dot" />
            View profile
          </div>
        </div>
        <button className="chat-settings" onClick={onOpenSettings}>
          ✦
        </button>
      </div>

      {/* Messages */}
      <div className="chat-body">

        {/* Opening prompt */}
        <div className="chat-system-msg">
          You both said you're in. ✦ Say hello.
        </div>

        {messages.length === 0 && (
          <div className="chat-empty">
            No messages yet — break the ice!
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe     = msg.senderId === currentUser.uid;
          const prevMsg  = messages[i - 1];
          const showTime = !prevMsg ||
            (msg.createdAt && prevMsg.createdAt &&
              msg.createdAt.seconds - prevMsg.createdAt.seconds > 300);

          return (
            <div key={msg.id}>
              {showTime && msg.createdAt && (
                <div className="chat-time">{formatTime(msg.createdAt)}</div>
              )}
              <div className={`chat-bubble-wrap ${isMe ? 'me' : 'them'}`}>
                <div className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-footer">
        <textarea
          className="chat-input"
          placeholder="Write a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send"
          onClick={handleSend}
          disabled={!text.trim()}
          style={{ opacity: text.trim() ? 1 : 0.4 }}
        >
          ↑
        </button>
      </div>

    </div>
  );
}
