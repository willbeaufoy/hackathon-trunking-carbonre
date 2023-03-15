import { Loading } from '@/components/loading';
import { SuspenseWithPerf, useAuth, useSigninCheck } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';

const googleAuthProvider = new GoogleAuthProvider();


export function MySignup() {
  const auth = useAuth();
  const router = useRouter();

  function handleFormSubmit(event) {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (user) => {
      await sendEmailVerification(user.user);
      await auth.signOut();
      router.push('/validate-email')
    })
  }

  return (
    <main>
      <h1>Sign up</h1>
      <section>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" required /><br /><br />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required /><br /><br />
          <button type="submit">Sign up</button>
        </form>
      </section>
      <section>
        <button onClick={() => signInWithPopup(auth, googleAuthProvider)}>Sign in with Google</button>
      </section>
    </main>
  );
}

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult, status } = useSigninCheck();

  if (!children) throw new Error('Children must be provided');
  if (signInCheckResult?.signedIn === true) return children as JSX.Element;
  if (status === 'loading') return <>Loading</>
  return fallback;
};

function RedirectToHome() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [])
  return undefined;
}

export default function Signup() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<MySignup />}>
        <RedirectToHome />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};