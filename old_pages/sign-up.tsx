import { Loading } from '@/old_pages/components/loading';
import { SuspenseWithPerf, useAuth } from 'reactfire';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { RedirectToHome } from '@/old_pages/components/redirect-to-home';
import { AuthWrapper } from '@/old_pages/components/auth-wrapper';

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

export default function Signup() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<MySignup />}>
        <RedirectToHome />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};