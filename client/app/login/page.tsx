import Link from 'next/link';
import styles from './page.module.css';

export default function Login() {
    /*
    user login:


    user inputs: their email and password
    if the email and password are equal to what's stored in the db
    let user into chat page
    otherwise 
    return incorrect email or password message error.


    */
    return(
        <main className={styles.main}>
            <div className={styles.left}>
                <div className={styles.formContainer}>

                <div className={styles.formHeader}>
                    <h1>Login</h1>
                    <p>Welcome Back!</p>
                </div>    

                <div className={styles.form}>
                    <p>Email:</p>
                    <input type="email" placeholder="Enter your email" />
                    <p>Password:</p>
                    <input type="password" placeholder="Enter your password" />

                    {/* need to build LOGIN logic */}
                    <button className={styles.btn}>Login</button>

                    <Link href="/"><button className={styles.homebtn}>Home</button></Link>
                </div>

                <p className={styles.linkText}> Need an account? <Link className={styles.loginLinkText} href="/signup">Signup</Link></p>
                </div>
            </div>

            <div className={styles.right}>
                <h2>Stratus Text.</h2>
                <p>Stratus Text</p>
            </div>
        </main>
    );
};