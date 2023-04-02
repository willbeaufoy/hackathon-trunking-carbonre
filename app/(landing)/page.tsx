import Link from "next/link";

export default function Landing() {
    return (
      <main>
        <h1>Home</h1>
        <ul>
          <li><Link href="/sign-in">Sign in</Link></li>
        </ul>
      </main>
    )
  }