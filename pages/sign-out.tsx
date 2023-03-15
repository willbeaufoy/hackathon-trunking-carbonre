import { Loading } from '@/components/loading';
import { SuspenseWithPerf, useAuth } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RedirectToHome } from '@/components/redirect-to-home';
import { AuthWrapper } from '@/components/auth-wrapper';

export function MySignout() {
  const auth = useAuth();
  
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