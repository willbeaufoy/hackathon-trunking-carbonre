"use client"

import { useAuth } from 'reactfire';

export default async function Signout() {
  const auth = useAuth();
  
  await auth.signOut();

  return undefined;
}
