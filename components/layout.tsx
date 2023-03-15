import Link from "next/link";
import { useUser } from "reactfire";

export default function Layout({ children }) {
    const { data: user } = useUser();

    return (
        <>
            <nav>
                <ul>

                    {user?.email ? (
                        <>
                            <li>Hello {user.email}</li>
                            <li><Link href="/sign-out">Sign out</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/sign-in">Sign in</Link></li>
                            <li><Link href="/sign-up">Sign up</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            {children}
        </>
    )
}