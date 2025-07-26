import Link from 'next/link';
import styles from './page.module.css';

export default function Signup() {
    return(
        <main className={styles.main}>
            <div className={styles.left}>
                <div className={styles.container}>
                    <h3> Sign Up Form </h3>
                    <p> First Name: <input /></p>
                    <p> Last Name: <input /></p>
                    <p> Email: <input /></p>
                    <p> Password: <input /></p>
                    <Link href="/"><button className={styles.btn}>Home</button></Link>
                    <Link href="/login"><button className={styles.btn}>Login</button></Link>
                </div>

            </div>
        </main>
    )
}