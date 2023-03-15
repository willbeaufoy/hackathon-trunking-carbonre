import Link from "next/link";

export default function Layout({ children }) {
    return (
        <>
            <nav>
                <ul>
                    <li><Link href="/sign-in">Sign in</Link></li>
                    <li><Link href="/sign-up">Sign up</Link></li>
                </ul>
            </nav>
            {children}
        </>
    )
}