import { AuthWrapper } from '@/components/auth-wrapper';
import { Loading } from '@/components/loading';
import { RedirectTo } from '@/components/redirect-to';
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
      <AuthWrapper fallback={<RedirectTo to="/" />}>
        <MySignout />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};