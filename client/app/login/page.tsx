'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useState } from 'react';
import { login, loginData } from '../lib/api';

export default function Login() {
  const [form, setForm] = useState<loginData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await login(form);
      setSuccess(response.data.message ?? null);
      console.log(response.data);
      router.push('/chat');
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.left}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>Login</h1>
            <p>Welcome Back!</p>
          </div>

          <form className={styles.form} onSubmit={onLogin}>
            <p>Email:</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <p>Password:</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit" className={styles.btn}>
              Login
            </button>

            <Link href="/">
              <button type="button" className={styles.homebtn}>Back</button>
            </Link>
          </form>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <p className={styles.linkText}>
            Need an account?{' '}
            <Link className={styles.loginLinkText} href="/signup">
              Signup
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <h2>Stratus Text.</h2>
        <p>Stratus Text</p>
      </div>
    </main>
  );
};
