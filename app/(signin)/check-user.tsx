"use client"

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "reactfire";

function AuthWrapper ({ children }) {
    const { data: user, status } = useUser();
    const router = useRouter();
    const path = usePathname();

    console.log ("App", {user, v: user?.emailVerified, status})
    if (user && user.emailVerified) return router.push('/profile');
    if (user && !user.emailVerified && path !== '/validate-email') return router.push('/validate-email');

    return children;
  };

export default function CheckUser({children}) {
    return (
        <AuthWrapper>
          {children}
        </AuthWrapper>
    );
  };