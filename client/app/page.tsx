import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  
  return (
    <main className={styles.main}>
      
      {/* HEADER */}
      <div className={styles.head}>
        <h1 className={styles.title}>Stratus</h1>
        <p className={styles.subtitle}>
          One stop shop for getting your next smartphone or laptop!
        </p>
        <Link href="/signup"><button className={styles.enterButton}>Get Started</button></Link>
      </div>

      {/* what we provide */}
      <div className={styles.features}>

        <div className={styles.featureCard}>
          <h3>Best Deals</h3>
          <p> Somehting about helping user get the best deals.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>Cater to your interest</h3>
          <p>how our webapp will cater to what the tech the user is interested in.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>Trusted Brands</h3>
          <p>Common Brands people have seen before.</p>
        </div>

      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Stratus </p>
      </footer>
    </main>
  );
};
