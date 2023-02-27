import { signOut } from "@firebase/auth";
import Link from "next/link";
import { useAuth, useUser } from "reactfire";

export default function Home() {
  const auth = useAuth();
  const { data: user }  = useUser();
  
  return (
    <main>
      <h1>Home</h1>
      {user ? (
        <>
          Logged in as: {user.displayName}<br />
          Email: {user.email}<br />
          <button onClick={() => signOut(auth)}>Sign out</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link><br />
        </>
      )}
    </main>
  )
}