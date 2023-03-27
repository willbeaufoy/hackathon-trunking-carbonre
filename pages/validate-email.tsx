import { useEffect } from "react"
import { useAuth } from "reactfire";

export default function ValidateEmail() {
  const auth = useAuth();

  useEffect(() => {
    auth.signOut();
  }, [auth])

  return (
    <main>
      <h1>Validate email</h1>
    </main>
  )
}