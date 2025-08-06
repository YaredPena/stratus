import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  
  return (
    <main className={styles.main}>
      
      {/* HEADER */}
      <div className={styles.head}>
        <h1 className={styles.title}>Stratus</h1>
        <p className={styles.subtitle}>
          Your personal AI-powered guide for finding the perfect laptop.
        </p>
        <Link href="/signup"><button className={styles.enterButton}>Get Started</button></Link>
      </div>

      {/* what we provide */}
      <div className={styles.features}>

        <div className={styles.featureCard}>
          <h3>AI Recommendations</h3>
          <p> Our RAG-based AI analyzes specs, performance, and pricing to suggest the
      best tech options tailored to your needs.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>Personalized Insights</h3>
          <p>Whether it&apos;s gaming, programming, or productivity, Stratus helps you 
      discover devices that fit your lifestyle.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>Trusted Brands</h3>
          <p>Recommendations are guaranteed to provide a reliable option using common, well known brands.</p>
        </div>

      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Stratus </p>
      </footer>
    </main>
  );
};
