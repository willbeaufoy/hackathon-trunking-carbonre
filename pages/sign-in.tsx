import CheckNotSignedIn from '@/components/check-not-signed-in';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from 'reactfire';

const googleAuthProvider = new GoogleAuthProvider();

type SignInState = undefined | 'auth/user-not-found' | 'auth/wrong-password';

export function Signin() {
  const auth = useAuth();
  const router = useRouter();

  const [signInState, setSignInState] = useState<SignInState>();

  function handleFormSubmit(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        if (!user.emailVerified) {
          await auth.signOut();
          router.push('/validate-email')
        }
      })
      .catch((err) => {
        if (err?.code) setSignInState(err?.code)
      })
  }

  return (
    <main>
      <h1>Sign in</h1>
      <section>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" required /><br /><br />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required /><br /><br />
          <button type="submit">Login</button>
        </form>
      </section>
      <section>
        <button onClick={() => signInWithPopup(auth, googleAuthProvider)}>Sign in with Google</button>
      </section>
      {signInState && (
        <section>
          <dialog open>
            <p>Invalid email or password</p>
          </dialog>
        </section>
      )}
      <section>
        <ul>
          <li><Link href="/sign-up">Sign up</Link></li>
          <li><Link href="/">Home</Link></li>
        </ul>
      </section>
    </main>
  );
}

export default function Login() {
  return (
    <CheckNotSignedIn>
      <Signin />
    </CheckNotSignedIn>
  );
};