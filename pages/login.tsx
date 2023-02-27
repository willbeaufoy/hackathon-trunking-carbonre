import { Loading } from '@/components/loading';
import { SuspenseWithPerf, useAuth, useSigninCheck } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const googleAuthProvider = new GoogleAuthProvider();

export function Signin() {
  const auth = useAuth();

  function handleFormSubmit(event) {
    event.preventDefault(); // prevent the form from actually submitting
    const email = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    // do something with the username and password, e.g. send them to a server using an AJAX request
    signInWithEmailAndPassword(auth, email, password)
  }

  return (
    <main>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" required /><br /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required /><br /><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => signInWithPopup(auth, googleAuthProvider)}>Sign in with Google</button>
    </main>
  );
}

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult, status } = useSigninCheck();
  
  if (!children)  throw new Error('Children must be provided');
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

export default function Login() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<Signin />}>
        <RedirectToHome />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};