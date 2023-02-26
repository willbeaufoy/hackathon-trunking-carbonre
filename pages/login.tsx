import * as React from 'react';
import { useAuth, useUser, SuspenseWithPerf, useSigninCheck } from 'reactfire';
import { User, Auth } from "firebase/auth";
import Link from 'next/link';
import Signin from '@/components/signin';

const signOut = (auth: Auth) => auth.signOut().then(() => console.log('signed out'));

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error('Children must be provided');
  }
  
  if (signInCheckResult?.signedIn === true) {
    return children as JSX.Element;
  } 
  
  return fallback;
};

const UserDetails = () => {
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

const Loading = () => <span>Loading...</span>

export default function Login() {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading />}>
      <AuthWrapper fallback={<Signin />}>
        <UserDetails />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};