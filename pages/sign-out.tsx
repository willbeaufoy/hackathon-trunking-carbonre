import BumpUnauthorised from '@/components/bump-unauthorised';
import { useEffect } from 'react';
import { useAuth } from 'reactfire';

export function MySignout() {
  const auth = useAuth();
  
  useEffect(() => {
    auth.signOut();
  }, [auth])

  return null;
}

export default function Signup() {
  return (
    <BumpUnauthorised>
      <MySignout/>
    </BumpUnauthorised>
  );
};