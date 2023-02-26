import { AuthWrapper } from "@/components/auth-wrapper";
import { Loading } from "@/components/loading";
import Signin from "@/components/signin";
import { User, signOut } from "firebase/auth";
import Link from "next/link";
import { SuspenseWithPerf, useAuth, useUser } from "reactfire";

export function MyProfile() {
  const auth = useAuth();
  const { data: user } = useUser();

  return (
    <section>
      <h3>Profile:</h3>
      <p>{(user as User).displayName}</p>
      <ul>
        {(user as User).providerData?.map(profile => (
          <li key={profile?.providerId}>{profile?.providerId}</li>
        ))}
      </ul>
      <button onClick={() => signOut(auth)}>Sign out</button> <br/>
      <Link href='/'>Home</Link>
    </section>
  );
};

export default function Profile() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<Signin />}>
        <MyProfile />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};