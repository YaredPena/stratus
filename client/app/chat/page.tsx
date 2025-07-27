'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout, recommend } from '../lib/api';
import styles from './page.module.css';
import { resolveCaa } from 'dns';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me about laptops or phones.' },
  ]);
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    const query = input;
    setInput('');

    try {
      const response = await recommend(query);
      const result = response.data.recommendations;

      let botText = '';
      if (result.length > 0) {
        //botText = result.map((item: any) => `${item.manufacturer} ${item.model_name} - ${item.price}`).join('\n');
        botText = result.forEach((item: any) => {
          const cardText = `${item.manufacturer} ${item.model_name} - $${item.price}`;
          setMessages((prev) => [...prev, { sender: 'bot', text: cardText }]);
        });
      } else {
        let defaultResponse = "No products match the description";
        return defaultResponse;
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);

    } catch(error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong fetching recommendations.' }]);
    }
  };

  /* save the user's suggestions onto the database this shouldn't be done on the client-side */
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
