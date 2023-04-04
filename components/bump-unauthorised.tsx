import { useRouter } from "next/router";
import { useSigninCheck } from "reactfire";
import { Loading } from "./loading";

export default function BumpUnauthorised({ children }) {
  const { data, status } = useSigninCheck();
  const router = useRouter();

  if (status === 'loading') return <Loading />;

  const { user } = data;
  if (!user) {
    router.push('/sign-in');
    return <></>;
  }

  if (!user.emailVerified) {
    router.push('/validate-email');
    return <></>;
  }

  return children;
}