'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout as apiLogout, recommend } from '../lib/api';
import styles from './page.module.css';

type Product = {
    manufacturer: string;
    model_name: string;
    price: number;
};

type Message = {
    id: string;
    sender: 'user' | 'bot';
    text: string;
	product?: Product;
	
};

export default function Chat() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: Date.now().toString(), sender: 'bot', text: 'Hello! Ask me about laptops.' },
    ]);
    const [input, setInput] = useState('');
    const [saved, setSaved] = useState<string[]>([]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);

        const query = input;
        setInput('');

        try {
            const response = await recommend(query);
            const { answer, sources } = response.data;

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: answer || "I couldn't find anything that fits this description.",
                },
            ]);

            if (sources && sources.length > 0) {
                sources.forEach((item: Product) => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: `${Date.now()}-${item.model_name}`,
                            sender: 'bot',
                            text: `${item.manufacturer} ${item.model_name} - $${item.price}`,
                            product: item,
                        },
                    ]);
                });
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: 'Something went wrong fetching recommendations.',
                },
            ]);
        }
    };
    
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
            {/* Chat Section */}
            <section className={styles.chatSection}>
                <div className={styles.header}>
                    <h1>Stratus</h1>
                </div>

                <div className={styles.chatContainer}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.message} ${
                                msg.sender === 'user' ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            {msg.product ? (
                                <div className={styles.productCard}>
                                    <p>
                                        <strong>
                                            {msg.product.manufacturer} {msg.product.model_name}
                                        </strong>
                                    </p>
                                    <p>${msg.product.price}</p>
                                    <button
                                        className={styles.saveBtn}
                                        onClick={() => saveSuggestion(msg.text)}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Section */}
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>▶</button>
                    <button onClick={logout} className={styles.btn}>
                        Logout
                    </button>
                </div>
            </section>

            {/* Saved Suggestions Sidebar */}
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
}