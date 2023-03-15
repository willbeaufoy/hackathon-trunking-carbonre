import { Loading } from '@/components/loading';
import { SuspenseWithPerf, useAuth, useSigninCheck } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';
import { RedirectToHome } from '@/components/redirect-to-home';

const googleAuthProvider = new GoogleAuthProvider();


export function MySignout() {
  const auth = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    auth.signOut();
  }, [])

  return null;

}

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult, status } = useSigninCheck();

  if (!children) throw new Error('Children must be provided');
  if (signInCheckResult?.signedIn === true) return children as JSX.Element;
  if (status === 'loading') return <>Loading</>
  return fallback;
};

export default function Signup() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<RedirectToHome />}>
        <MySignout />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};