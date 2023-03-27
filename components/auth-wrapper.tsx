import { useRouter } from "next/router";
import { useUser } from "reactfire";


export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: user, status } = useUser();
  const router = useRouter();

  console.log({user, verified: user?.emailVerified})

  if (!children) throw new Error('Children must be provided');
  if (!user) return fallback;
  if (!user.emailVerified) router.push('/validate-email');
  if (status === 'loading') return <>Loading</>
  return children as JSX.Element;
};