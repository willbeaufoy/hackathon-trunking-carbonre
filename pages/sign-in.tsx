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
  const handleContinueWithGoogle = () => signInWithPopup(auth, googleAuthProvider);

  return (
    <main className="flex flex-col items-center h-screen w-screen bg-white dark:bg-gray-900 mx-auto max-w-xs sm:max-w-screen-md text-center">
      <h3 className='mt-4 mb-8'>Login</h3>
      <form onSubmit={handleFormSubmit} className='flex-1 flex flex-col space-y-8'>
        <input type="email" id="email" aria-label="Email" className="bg-gray-50 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" />
        <input type="password" id="password" aria-label="Password" className="bg-gray-50 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" />
        <button type="submit" className="shadow-xl py-3 w-72 sm:w-96 text-base font-normal text-center text-black rounded-full bg-green-300 hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900">Login</button>
        {signInState && (
          <dialog open>
            <p>Invalid email or password</p>
          </dialog>
        )}
        <Link href="#" className='text-base underline'>
          Forgot the password?
        </Link>
      </form>


      <section className='flex-1 flex flex-col space-y-8'>
        <button type="button" onClick={handleContinueWithGoogle} className="sm:w-96 text-base font-normal text-center rounded-full hover:bg-green-400 focus:ring-green-200 dark:focus:ring-green-900 text-white shadow-xl py-3 w-72 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 
        focus:outline-none focus:ring-[#4285F4]/50  inline-flex items-center dark:focus:ring-[#4285F4]/55 p-6">
          <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          <span className='flex-1'>Sign in with Google</span>
        </button>
        <Link href="/sign-up" className='text-base underline'>
          Don&apos;t have an account? Sign up
        </Link>
        <Link href="/" className='text-base underline'>
          Back home
        </Link>
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