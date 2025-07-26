'use client';
import { useRouter } from 'next/navigation';
import { logout as apiLogout } from '../lib/api';
import styles from './page.module.css';

export default function Chat() {
  const router = useRouter();

  const logout = async () => {
    try {
      await apiLogout();
      router.push('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Main Content here</h1>
      <button onClick={logout} className={styles.btn}>Logout</button>
    </div>
  );
}
