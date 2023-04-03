import { useRouter } from "next/router";
import { useSigninCheck, SuspenseWithPerf } from "reactfire";
import { Loading } from "./loading";

export const AuthWrapper = ({ children }) => {
  const { data: { user } } = useSigninCheck();
  const router = useRouter();

  if (user && user.emailVerified) {
    router.push('/');
    return <></>;
  }
  
  if (user && !user.emailVerified && router.pathname !== '/validate-email') {
    router.push('/validate-email');
    return <></>;
  }

  return children as JSX.Element;
};

export default function CheckNotSignedIn({ children }) {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};