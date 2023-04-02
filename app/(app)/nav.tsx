"use client"

import Link from "next/link";
import { useUser } from "reactfire";

export default function Nav() {
    const { data: user } = useUser();

    return (
        <>
            <nav>
                <ul>
                    <>
                        <li>Hello {user?.email}</li>
                        <li><Link href="/sign-out">Sign out</Link></li>
                    </>
                </ul>
            </nav>
        </>
    )
}
