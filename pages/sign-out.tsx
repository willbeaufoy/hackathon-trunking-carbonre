import { AuthWrapper } from '@/components/auth-wrapper';
import { Loading } from '@/components/loading';
import { RedirectToHome } from '@/components/redirect-to-home';
import { useEffect } from 'react';
import { SuspenseWithPerf, useAuth } from 'reactfire';

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