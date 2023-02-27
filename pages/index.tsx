import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <ul>
        <li><Link href="/login">Login</Link></li>
      </ul>
    </main>
  )
}