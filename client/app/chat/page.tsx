'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '../lib/api';
import styles from './page.module.css';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me about laptops or phones.' },
  ]);
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Best buy API/ RAG LLM
  };


  /* save the user's suggestions onto the database this shouldn't be done on the client-side*/
  const saveSuggestion = (text: string) => {
    setSaved((prev) => [...prev, text]);
  };

  const logout = async () => {
    try {
      await apiLogout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <main className={styles.chatPage}>

      <section className={styles.chatSection}>
        <div className={styles.header}>
          <h1>Stratus</h1>
        </div>

        <div className={styles.chatContainer}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                msg.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <p>{msg.text}</p>
              {msg.sender === 'bot' && (
                <button
                  className={styles.saveBtn}
                  onClick={() => saveSuggestion(msg.text)}
                >
                  Save
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>▶</button>
          <button onClick={logout} className={styles.btn}>Logout</button>
        </div>
      </section>

      <aside className={styles.catalogSection}>
        <h2>Saved Suggestions</h2>
        {saved.length === 0 ? (
          <p className={styles.noSaved}>No saved suggestions yet.</p>
        ) : (
          <ul className={styles.savedList}>
            {saved.map((s, i) => (
              <li key={i} className={styles.savedCard}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </main>
  );
};
