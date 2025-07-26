'use client';
import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';
import { signup, signupData } from '../lib/api';

export default function Signup() {

    /*
     async function signup(data) {
        try {
            const signupCall = axios.post()

            const result = await signupCall.json();
            console.log(result);

        } catch {

        }
    };
    */
    /*
    on sign up: Specify datapoints.
    what is signup passing in?
    (parameter = data)
    what is data?
    a hashmap
    fn:
    ln:
    email:
    pword:
    user info account stored in db
    user is moved to chat page
    
    
    */
    return(
        <main className={styles.main}>
            <div className={styles.left}>
                <div className={styles.formContainer}>

                <div className={styles.formHeader}>
                    <h1>Signup</h1>
                    <p>Create your account here!</p>
                </div>    

                <div className={styles.form}>
                    <p>First Name: </p>
                    <input type="firstname" placeholder="John"/>
                    <p>Last Name: </p>
                    <input type="lastname" placeholder="Doe"/>
                    <p>Email:</p>
                    <input type="email" placeholder="Enter your email" />
                    <p>Password:</p>
                    <input type="password" placeholder="Enter your password" />

                    {/* need to build signup logic */}
                    <button className={styles.btn}>Signup</button>

                    <Link href="/"><button className={styles.homebtn}>Home</button></Link>
                </div>

                <p className={styles.linkText}> Already have an account? <Link className={styles.loginLinkText} href="/login">Login</Link></p>
                </div>
            </div>

            <div className={styles.right}>
                <h2>Stratus Text.</h2>
                <p>Stratus Text</p>
            </div>
        </main>
    );
};