import Link from 'next/link';

export default function signup() {
    return(
        <div>
            <h1> signup </h1>
            <Link href="/"><button>Home</button></Link>
            <Link href="/login"><button>Login</button></Link>
        </div>
    )
}