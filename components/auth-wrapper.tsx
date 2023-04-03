import { useRouter } from "next/router";
import { useSigninCheck } from "reactfire";


export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: {user} } = useSigninCheck();
  const router = useRouter();

  if (!user) return fallback;
  if (!user.emailVerified) router.push('/validate-email');
  return children as JSX.Element;
};