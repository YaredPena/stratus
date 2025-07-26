import Link from 'next/link';
import styles from './page.module.css';


export default function chat() {
    return (
        <div className={styles.container}>
            <h1 > Main Content here </h1>
            <Link className={styles.btn} href="/">Home</Link>
        </div>
        
    )
};