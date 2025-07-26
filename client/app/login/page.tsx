import Link from 'next/link';

export default function signup() {
    return(
        <div>
            <h1> Login </h1>
            <Link href="/"><button>Home</button></Link>
            <Link href="/signup"><button>signup</button></Link>
        </div>
    )
}