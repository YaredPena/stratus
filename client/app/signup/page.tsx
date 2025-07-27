'use client';
import Link from 'next/link';
import { useRouter, redirect, RedirectType } from 'next/navigation';
import styles from './page.module.css';
import { useState } from 'react';
import { signup, signupData } from '../lib/api';

export default function Signup() {
    const [form, setForm] = useState<signupData>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const onSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
        const response = await signup(form);
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
                <h1>Signup</h1>
                <p>Create your account here!</p>
                </div>

                <form className={styles.form} onSubmit={onSignup}>
                <p>First Name: </p>
                <input
                    type="text"
                    placeholder="John"
                    value={form.firstname}
                    onChange={(e) => setForm({ ...form, firstname: e.target.value })}
                />

                <p>Last Name: </p>
                <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastname}
                    onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                />

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
                    Signup
                </button>

                <Link href="/">
                    <button type="button" className={styles.homebtn}>Back</button>
                </Link>
                </form>

                <p className={styles.linkText}>
                Already have an account?{' '}
                <Link className={styles.loginLinkText} href="/login">
                    Login
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