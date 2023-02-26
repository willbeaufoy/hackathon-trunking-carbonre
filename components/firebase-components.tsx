import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+
import { useEffect } from 'react';

import { AuthProvider, useFirebaseApp } from 'reactfire';

// TODO AppCheck
// TODO SSR auth

export default function FirebaseComponents({ children }) {
    const app = useFirebaseApp();
    const auth = getAuth(app);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_EMULATOR === 'true') {
            // Set up emulators
            connectAuthEmulator(auth, 'http://127.0.0.1:9099');
        }
    }, [app])
    // useInitPerformance(
    //     async (firebaseApp) => {
    //         const { getPerformance } = await import('firebase/performance');
    //         return getPerformance(firebaseApp);
    //     },
    //     { suspense: false } // false because we don't want to stop render while we wait for perf
    // );

    return (
        <AuthProvider sdk={auth}>
            {children}
        </AuthProvider>
    );
}

function useInitPerformance(arg0: (firebaseApp: any) => Promise<import("firebase/performance").FirebasePerformance>, arg1: { suspense: boolean; }) {
    throw new Error('Function not implemented.');
}
