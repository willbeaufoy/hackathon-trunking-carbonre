import Signin from '@/components/signin';
import { AuthWrapper } from '@/components/auth-wrapper';
import { Loading } from '@/components/loading';
import { SuspenseWithPerf } from 'reactfire';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function RedirectToProfile() {
  const router = useRouter();
  useEffect(() => {
    router.push("/profile");
  }, [])
  return undefined;
}

export default function Login() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<Signin />}>
        <RedirectToProfile />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};