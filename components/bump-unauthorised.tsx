import { useRouter } from "next/router";
import { useSigninCheck, SuspenseWithPerf } from "reactfire";
import { Loading } from "./loading";

export const AuthWrapper = ({ children}) => {
    const { data: {user} } = useSigninCheck();
    const router = useRouter();
  
    if (!user) {
      router.push('/sign-in');
      return <></>;
    }
    
    if (!user.emailVerified) {
      router.push('/validate-email');
      return <></>;
    }

    return children as JSX.Element;
  };
  
export default function BumpUnauthorised({children}) {
    return (
      <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </SuspenseWithPerf>
    );
  };