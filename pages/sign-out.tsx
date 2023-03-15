import { Loading } from '@/components/loading';
import { SuspenseWithPerf, useAuth, useSigninCheck } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';
import { RedirectToHome } from '@/components/redirect-to-home';
import { AuthWrapper } from '@/components/auth-wrapper';

const googleAuthProvider = new GoogleAuthProvider();


export function MySignout() {
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    auth.signOut();
  }, [])

  return null;
}

export default function Signup() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<RedirectToHome />}>
        <MySignout />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};