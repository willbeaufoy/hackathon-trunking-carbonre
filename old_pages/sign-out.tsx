import { AuthWrapper } from '@/old_pages/components/auth-wrapper';
import { Loading } from '@/old_pages/components/loading';
import { RedirectToHome } from '@/old_pages/components/redirect-to-home';
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