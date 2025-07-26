import Link from 'next/link';
import styles from './page.module.css';

export default function Login() {
    return(
        <main className={styles.main}>
            <div>
                <h1> Login </h1>

                <div className={styles.container}>
                    <h3> Login Form </h3>
                    <p> First Name: <input /></p>
                    <p> Last Name: <input /></p>
                    <p> Email: <input /></p>
                    <p> Password: <input /></p>
                    <Link href="/"><button className={styles.btn}>Home</button></Link>
                    <Link href="/signup"><button className={styles.btn}>Signup</button></Link>
                </div>

            </div>
        </main>
    );
};